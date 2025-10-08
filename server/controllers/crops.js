// crop.controller.js
const { supabase } = require('../configs/supabase');
const multer = require('multer');
const axios = require('axios');
const  plantAnalyzer  = require('../apis/plant');

// Configure multer for image upload (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('image');

// Multer error handling middleware
const handleMulterUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        error: 'File upload error',
        details: err.message
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        error: 'Unknown upload error',
        details: err.message
      });
    }
    next();
  });
};

// Helper to build public URL robustly
function getPublicUrlForFile(bucket, path) {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || data?.publicURL || null;
  } catch (err) {
    console.error('getPublicUrl error:', err);
    return null;
  }
}

// Helper function to get current growing season
const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 5) return 'Long Rains';
  if (month >= 9 && month <= 11) return 'Short Rains';
  return 'Dry Season';
};

/**
 * Add crop and diagnose in one request
 */
const addCropAndDiagnose = async (req, res, next) => {
  try {
    const { crop_name, planting_date, plot_size } = req.body;
    if (!crop_name || !planting_date || !plot_size || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields or image file'
      });
    }

    // 1) Insert crop first
    const { data: cropData, error: cropError } = await supabase
      .from('crops')
      .insert({
        farmer_id: req.user.id,
        crop_name,
        planting_date,
        plot_size,
        ...req.body
      })
      .select()
      .single();

    if (cropError || !cropData) {
      return res.status(400).json({
        success: false,
        error: cropError ? cropError.message : 'Crop creation failed'
      });
    }

    // 2) Try disease analysis (don’t block flow if it fails)
    let analysis = { plantIdAnalysis: null, aiRecommendations: null };
    try {
      analysis = await plantAnalyzer.analyzeDiseaseImage(req.file.buffer, {
        cropType: cropData.crop_name,
        location: req.user.location,
        season: getCurrentSeason()
      });
    } catch (err) {
      console.error('Plant.id analysis failed:', err.message);
    }

    // 3) Upload file to Supabase
    const filename = `${req.user.id}/${cropData.id}/${Date.now()}-${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cropsImages')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(400).json({ success: false, error: uploadError.message });
    }

    const publicUrl = getPublicUrlForFile('cropsImages', filename) || uploadData?.path || null;

    // 4) Update crop row with image_url
    if (publicUrl) {
      await supabase
        .from('crops')
        .update({ image_url: publicUrl })
        .eq('id', cropData.id);
    }

    // 5) Save analysis results
    let analysisData = null;
    if (analysis.plantIdAnalysis || analysis.aiRecommendations) {
      const { data, error } = await supabase
        .from('disease_analyses')
        .insert({
          crop_id: cropData.id,
          image_url: publicUrl || uploadData?.path || null,
          plant_id_response: analysis.plantIdAnalysis,
          ai_recommendations: analysis.aiRecommendations?.response,
          is_healthy: analysis.plantIdAnalysis?.isHealthy ?? null,
          confidence_level: analysis.aiRecommendations?.confidenceLevel ?? null
        })
        .select()
        .single();
      if (!error) analysisData = data;
    }

    return res.status(201).json({
      success: true,
      data: {
        crop: { ...cropData, image_url: publicUrl },
        diagnosis: analysis,
        storedAnalysis: analysisData
      }
    });
  } catch (error) {
    console.error('addCropAndDiagnose unexpected error:', error);
    return next(error);
  }
};

/**
 * Add a new crop (image optional)
 */
const addCrop = async (req, res, next) => {
  try {
    const { crop_name, planting_date, plot_size } = req.body;
    if (!crop_name || !planting_date || !plot_size) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const { data: cropData, error: cropError } = await supabase
      .from('crops')
      .insert({
        farmer_id: req.user.id,
        crop_name,
        planting_date,
        plot_size,
        ...req.body
      })
      .select()
      .single();

    if (cropError || !cropData) {
      return res.status(400).json({
        success: false,
        error: cropError ? cropError.message : 'Crop creation failed'
      });
    }

    if (req.file) {
      const filename = `${req.user.id}/${cropData.id}/${Date.now()}-${req.file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cropsImages')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error on addCrop:', uploadError);
        return res.status(400).json({ success: false, error: uploadError.message });
      }

      const publicUrl = getPublicUrlForFile('cropsImages', filename) || uploadData?.path || null;

      if (publicUrl) {
        await supabase.from('crops').update({ image_url: publicUrl }).eq('id', cropData.id);
        return res.status(201).json({
          success: true,
          data: { ...cropData, image_url: publicUrl }
        });
      }
    }

    return res.status(201).json({ success: true, data: cropData });
  } catch (error) {
    console.error('addCrop unexpected error:', error);
    return next(error);
  }
};

/**
 * Get farmer's crops
 */
const getCrops = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('crops')
      .select('*')
      .eq('farmer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

/**
 * Analyze disease
 */
const analyzeDisease = async (req, res, next) => {
  try {
    const { cropId } = req.body;
    if (!cropId) {
      return res.status(400).json({ success: false, error: 'Missing crop ID' });
    }

    const { data: cropData, error: cropError } = await supabase
      .from('crops')
      .select('*')
      .eq('id', cropId)
      .single();

    if (cropError || !cropData) {
      return res.status(404).json({ success: false, error: 'Crop not found' });
    }

    if (cropData.farmer_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized access to crop' });
    }

    let bufferToAnalyze = null;
    let imagePublicUrl = cropData.image_url || null;

    if (req.file) {
      const filename = `${req.user.id}/${cropId}/${Date.now()}-${req.file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cropsImages')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        return res.status(400).json({ success: false, error: uploadError.message });
      }

      imagePublicUrl = getPublicUrlForFile('cropsImages', filename) || uploadData?.path || null;
      if (imagePublicUrl) {
        await supabase.from('crops').update({ image_url: imagePublicUrl }).eq('id', cropId);
      }

      bufferToAnalyze = req.file.buffer;
    } else if (cropData.image_url) {
      try {
        const resp = await axios.get(cropData.image_url, { responseType: 'arraybuffer' });
        bufferToAnalyze = Buffer.from(resp.data);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Failed to fetch existing crop image. Please upload a new image.'
        });
      }
    } else {
      return res.status(400).json({ success: false, error: 'No crop image available' });
    }

    let analysis = { plantIdAnalysis: null, aiRecommendations: null };
    try {
      analysis = await plantAnalyzer.analyzeDiseaseImage(bufferToAnalyze, {
        cropType: cropData.crop_name,
        location: req.user.location,
        season: getCurrentSeason()
      });
    } catch (err) {
      console.error('Plant.id analysis failed in analyzeDisease:', err.message);
    }

    try {
  // 🧩 Debug log before insert
  console.log('🧩 Attempting to insert into disease_analyses with payload:', {
    crop_id: cropId,
    image_url: imagePublicUrl || null,
    plant_id_response: analysis.plantIdAnalysis,
    ai_recommendations: analysis.aiRecommendations,
    is_healthy: analysis.plantIdAnalysis?.isHealthy?.binary ?? null,
    confidence_level: analysis.plantIdAnalysis?.isHealthy?.probability ?? null,
    analyzed_at: new Date().toISOString()
  });

  // 🧠 Perform the insert
  const { data: analysisData, error: analysisError } = await supabase
    .from('disease_analyses')
    .insert({
      crop_id: cropId,
      image_url: imagePublicUrl || null,
      plant_id_response: analysis.plantIdAnalysis,
      ai_recommendations: analysis.aiRecommendations,
      is_healthy: analysis.plantIdAnalysis?.isHealthy?.binary ?? null,
      confidence_level: analysis.plantIdAnalysis?.isHealthy?.probability ?? null,
      analyzed_at: new Date().toISOString()
    })
    .select()
    .single();

  // 🧾 Debug log after insert attempt
  if (analysisError) {
    console.error('❌ Disease analyses insert error:', analysisError.message);
    console.error('🔍 Full error object:', analysisError);
    return res.status(400).json({ success: false, error: analysisError.message });
  }

  console.log('✅ Disease analyses insert success:', analysisData);

  return res.status(200).json({
    success: true,
    data: { analysis, storedAnalysis: analysisData }
  });
} catch (error) {
  console.error('💥 Unexpected analyzeDisease error:', error);
  return next(error);
}
  } catch (error) {
    return next(error);
  }
};

/**
 * Get disease analysis history
 */
const getAnalysisHistory = async (req, res, next) => {
  try {
    const { cropId } = req.params;
    const { data, error } = await supabase
      .from('disease_analyses')
      .select('*, crops (crop_name, planting_date)')
      .eq('crop_id', cropId)
      .order('analyzed_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

// Delete crop
const deleteCrop = async (req, res) => {
  const { cropId } = req.params;
  try {
    const { error } = await supabase.from('crops').delete().eq('id', cropId);
    if (error) throw error;
    return res.status(200).json({ success: true, message: 'Crop deleted successfully' });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete crop',
      error: err.message
    });
  }
};

module.exports = {
  handleMulterUpload,
  addCrop,
  getCrops,
  analyzeDisease,
  getAnalysisHistory,
  addCropAndDiagnose,
  deleteCrop
};
