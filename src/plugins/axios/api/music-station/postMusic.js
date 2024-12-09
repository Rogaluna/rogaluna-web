import { axiosInstance } from "../../main"
import { CHUNK_SIZE } from "../../configs/axiosConfigs";
import Cookies from 'js-cookie';

import AsyncTask from "../../module/tasks/AsyncTask";
import { generateMD5 , generateFileMD5 } from "../../module/functions/generateMD5";

const postMusicAPI = async (musicFile) => {

  // 延迟函数
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // 定义合并音乐文件的 API 请求
  const mergeMusicAPI = async (uid, totalChunks) => {
    try {
      const formData = new FormData();
      formData.append('uid', uid);
      formData.append('fileName', encodeURIComponent(musicFile.name)); // 音乐文件名
      formData.append('totalChunks', totalChunks);

      const response = await axiosInstance.post('/api/musicStation/mergeMusic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Cookies.get('token')
        }
      });

      console.log("Music merge request successful:", response.data);
    } catch (error) {
      console.error("Music merge request failed:", error);
      throw new Error("Music merge failed");
    }
  };

  // 定义 HTTP 分块上传的任务执行函数
  const uploadFunction = async () => {
    const totalSize = musicFile.size;
    const totalChunks = Math.ceil(totalSize / CHUNK_SIZE); // 计算总的块数
    const uuid = await generateFileMD5(musicFile); // 生成文件 Md5 值
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunk = musicFile.slice(start, end); // 获取当前块

      // 生成当前块的 MD5 校验码
      const chunkMd5Hash = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result; // 转换为 ArrayBuffer
          const md5Hash = generateMD5(arrayBuffer);
          resolve(md5Hash);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(chunk);
      });
  
      const formData = new FormData();
      formData.append('uid', uuid); // 音乐文件 MD5 校验码
      formData.append('chunkIndex', chunkIndex); // 块索引
      formData.append('totalChunks', totalChunks); // 总块数
      formData.append('chunkMd5', chunkMd5Hash); // 块 MD5 校验码
      formData.append('chunkData', chunk); // 当前音乐块数据
  
      let retryCount = 0;
      const maxRetries = 5;
      let success = false;
      const delayTime = 1000;
  
      // 循环尝试上传当前块
      while (retryCount < maxRetries && !success) {
        try {
          // 发送当前块的 POST 请求
          const response = await axiosInstance.post('/api/musicStation/postMusic', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': Cookies.get('token')
            }
          });
  
          console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`, response.data);
          success = true; // 成功上传后，退出重试循环
        } catch (error) {
          retryCount++;
          console.warn(`Error uploading chunk ${chunkIndex + 1}/${totalChunks}, retrying... (${retryCount}/${maxRetries})`);
  
          if (retryCount >= maxRetries) {
            console.error(`Chunk ${chunkIndex + 1} failed after ${maxRetries} attempts, aborting.`);
            throw new Error(`Upload failed after ${maxRetries} attempts for chunk ${chunkIndex + 1}`);
          }
  
          // 重试前等待
          await delay(delayTime);
        }
      }
    }

    console.log("All chunks uploaded, merging music...");

    await mergeMusicAPI(uuid, totalChunks);
  };

  // 创建 AsyncTask 实例并添加到上传队列
  const task = new AsyncTask(uploadFunction);

  // 将任务添加到上传队列并执行
  axiosInstance.uploadQueue.addTask(task);
  
};

export default postMusicAPI;