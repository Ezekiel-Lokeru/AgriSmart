import api from '../services/api';

export default async function logout() {
  // Call backend signout endpoint
  try {
    await api.post('/v1/auth/logout');
  } catch {
    // Ignore errors for logout
  }
  // Remove token from localStorage
  localStorage.removeItem('access_token');
}
