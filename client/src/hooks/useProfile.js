import { useEffect, useState } from 'react';
import api from '../services/api';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
  const res = await api.get('/v1/profile/get');
        setProfile(res.data?.data || res.data);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return { profile, loading, error };
}
