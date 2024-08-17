import axios from 'axios';
import TaskQueue from './module/taskQueue';
import { BASE_HTTP_URL } from './configs/baseUrl';

const downloadQueue = new TaskQueue();
const uploadQueue = new TaskQueue();

export const axiosInstance = axios.create({
  baseURL: BASE_HTTP_URL, // 服务器基础URL
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.downloadQueue = downloadQueue;
axiosInstance.uploadQueue = uploadQueue;

export default {
  install(Vue) {
    Vue.prototype.$axios = axiosInstance;
  },
  instance: axiosInstance
};