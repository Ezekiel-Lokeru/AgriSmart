// crop.controller.js
const { supabase } = require('../configs');
const multer = require('multer');
const axios = require('axios');
const { plantAnalyzer } = require('../apis');

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
    // supabase client versions differ in field name; support both
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
 * - Requires a file upload in req.file
 */
const addCropAndDiagnose = async (req, res, next) => {
  try {
    // Validate required fields
    const { crop_name, planting_date, plot_size } = req.body;
    if (!crop_name || !planting_date || !plot_size || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields or image file'
      });
    }

    // 1) Insert crop first to get crop ID
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

    // 2) Analyze disease using the uploaded image buffer (do this before upload so analyzer gets raw buffer)
    const analysis = await plantAnalyzer.analyzeDiseaseImage(
      req.file.buffer,
      {
        cropType: cropData.crop_name,
        location: req.user.location,
        season: getCurrentSeason()
      }
    );

    // 3) Upload file to Supabase Storage using crop id in filename
    const filename = `${req.user.id}/${cropData.id}/${Date.now()}-${req.file.originalname}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('crop-images')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      // We created a crop already; you may choose to rollback crop here if desired.
      return res.status(400).json({ success: false, error: uploadError.message });
    }

    // 4) Get public URL for uploaded image
    const publicUrl = getPublicUrlForFile('crop-images', filename) || uploadData?.path || null;

    // 5) Update crop row with image_url (if publicUrl exists)
    if (publicUrl) {
      await supabase
        .from('crops')
        .update({ image_url: publicUrl })
        .eq('id', cropData.id);
    }

    // 6) Save analysis results into disease_analyses
    const { data: analysisData, error: analysisError } = await supabase
      .from('disease_analyses')
      .insert({
        crop_id: cropData.id,
        image_url: publicUrl || uploadData?.path || null,
        plant_id_response: analysis.plantIdAnalysis,
        ai_recommendations: analysis.aiRecommendations,
        is_healthy: analysis.plantIdAnalysis?.isHealthy ?? null,
        confidence_level: analysis.aiRecommendations?.confidenceLevel ?? null
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Saving analysis error:', analysisError);
      return res.status(400).json({ success: false, error: analysisError.message });
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
 * - If req.file present, upload and set image_url
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

    // Insert crop first
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

    // If an image was uploaded, store it and update crop.image_url
    if (req.file) {
      const filename = `${req.user.id}/${cropData.id}/${Date.now()}-${req.file.originalname}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error on addCrop:', uploadError);
        // Not failing the whole request — return informative response
        return res.status(400).json({ success: false, error: uploadError.message });
      }

      const publicUrl = getPublicUrlForFile('crop-images', filename) || uploadData?.path || null;

      if (publicUrl) {
        const { error: updErr } = await supabase
          .from('crops')
          .update({ image_url: publicUrl })
          .eq('id', cropData.id);

        if (updErr) {
          console.error('Failed to update crop with image_url:', updErr);
        }

        // return updated crop data to client
        return res.status(201).json({
          success: true,
          data: { ...cropData, image_url: publicUrl }
        });
      }
    }

    // No file case - return crop as is
    return res.status(201).json({
      success: true,
      data: cropData
    });
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
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Analyze crop disease - supports:
 * - new uploaded file (req.file) OR
 * - falling back to crop.image_url (downloaded and converted to buffer)
 */
const analyzeDisease = async (req, res, next) => {
  try {
    const { cropId } = req.body;

    if (!cropId) {
      return res.status(400).json({
        success: false,
        error: 'Missing crop ID'
      });
    }

    // Get crop details
    const { data: cropData, error: cropError } = await supabase
      .from('crops')
      .select('*')
      .eq('id', cropId)
      .single();

    if (cropError || !cropData) {
      return res.status(404).json({
        success: false,
        error: 'Crop not found'
      });
    }

    // Ensure the user owns the crop
    if (cropData.farmer_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to crop'
      });
    }

    let bufferToAnalyze = null;
    let imagePublicUrl = cropData.image_url || null;

    if (req.file) {
      // Upload new image and update crop.image_url
      const filename = `${req.user.id}/${cropId}/${Date.now()}-${req.file.originalname}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('upload error in analyzeDisease:', uploadError);
        return res.status(400).json({ success: false, error: uploadError.message });
      }

      imagePublicUrl = getPublicUrlForFile('crop-images', filename) || uploadData?.path || null;

      // update crop with new image url
      if (imagePublicUrl) {
        await supabase
          .from('crops')
          .update({ image_url: imagePublicUrl })
          .eq('id', cropId);
      }

      bufferToAnalyze = req.file.buffer;
    } else if (cropData.image_url) {
      // fetch image from public URL and convert to buffer so analyzer can use it
      try {
        const resp = await axios.get(cropData.image_url, { responseType: 'arraybuffer' });
        bufferToAnalyze = Buffer.from(resp.data);
      } catch (err) {
        console.error('Failed to fetch existing crop image for analysis:', err);
        return res.status(400).json({
          success: false,
          error: 'Failed to fetch existing crop image. Please upload a new image.'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'No crop image available for analysis. Please upload one.'
      });
    }

    // Perform analysis (bufferToAnalyze is a Buffer)
    const analysis = await plantAnalyzer.analyzeDiseaseImage(bufferToAnalyze, {
      cropType: cropData.crop_name,
      location: req.user.location,
      season: getCurrentSeason()
    });

    // Save analysis results to DB
    const { data: analysisData, error: analysisError } = await supabase
      .from('disease_analyses')
      .insert({
        crop_id: cropId,
        image_url: imagePublicUrl || null,
        plant_id_response: analysis.plantIdAnalysis,
        ai_recommendations: analysis.aiRecommendations,
        is_healthy: analysis.plantIdAnalysis?.isHealthy ?? null,
        confidence_level: analysis.aiRecommendations?.confidenceLevel ?? null
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Failed saving analysis in analyzeDisease:', analysisError);
      return res.status(400).json({ success: false, error: analysisError.message });
    }

    return res.status(200).json({
      success: true,
      data: {
        analysis,
        storedAnalysis: analysisData
      }
    });
  } catch (error) {
    console.error('analyzeDisease unexpected error:', error);
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
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return next(error);
  }
};

// Delete crop by ID
const deleteCrop = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete from crops table
    const { error } = await supabase
      .from('crops')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Crop deleted successfully',
    });
  } catch (err) {
    console.error('Delete crop error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete crop',
      error: err.message,
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
