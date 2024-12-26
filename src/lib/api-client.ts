import axios from 'axios';
import { backendUrl } from './constants';

const axiosInstance = axios.create({ baseURL: backendUrl });
export const apiClient = axiosInstance;
