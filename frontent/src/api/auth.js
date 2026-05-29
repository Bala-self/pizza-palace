import API from "./axios";

//------------api endpoint for user

export const registerUser = (userData) => API.post('/auth/register' , userData);

export const loginUser = (userData) => API.post('/auth/login' , userData);

export const fetchProfile = () => API.get('/auth/profile');

export const updateUserProfile = (userData) => API.put('/auth/profile' , userData);






