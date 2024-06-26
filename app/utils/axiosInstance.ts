import axios, {AxiosInstance} from 'axios';

const axiosInstance: AxiosInstance = axios.create({});

axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request', JSON.stringify(request, null, 2));
  return request;
});

axiosInstance.interceptors.response.use(response => {
  console.log('Response:', JSON.stringify(response, null, 2));
  return response;
});

export default axiosInstance;
