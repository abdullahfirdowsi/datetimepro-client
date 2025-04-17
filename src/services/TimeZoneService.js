import axios from 'axios';

const API_URL = 'http://localhost:5096/TimeZone';

export const getLocalTime = async () => {
  const response = await axios.get(`${API_URL}/local`);
  return response.data;
};

export const getAllTimeZones = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

export const getTimeZoneById = async (timeZoneId) => {
  const response = await axios.get(`${API_URL}/${timeZoneId}`);
  return response.data;
};