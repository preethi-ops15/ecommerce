// src/features/auth/AuthApi.jsx
import { axiosi } from '../../config/axios';

const handleError = (error) => {
  // normalize network vs. server errors
  if (error.response && error.response.data) {
    throw error.response.data;
  }
  throw { message: 'Network error – please try again' };
};

export const signup = async (cred) => {
  try {
    // your backend route is POST /api/auth/register
    const res = await axiosi.post('/auth/register', cred);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const login = async (cred) => {
  try {
    const res = await axiosi.post('/auth/login', cred);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

// if your backend supports OTP flows, update these paths accordingly:
export const verifyOtp = async (cred) => {
  try {
    const res = await axiosi.post('/auth/verify-otp', cred);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const resendOtp = async (cred) => {
  try {
    const res = await axiosi.post('/auth/resend-otp', cred);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const forgotPassword = async (cred) => {
  try {
    const res = await axiosi.post('/auth/forgot-password', cred);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const resetPassword = async (cred) => {
  try {
    const res = await axiosi.post('/auth/reset-password', cred);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const checkAuth = async () => {
  try {
    const res = await axiosi.get('/auth/check-auth');
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const logout = async () => {
  try {
    const res = await axiosi.get('/auth/logout');
    return res.data;
  } catch (err) {
    handleError(err);
  }
};
