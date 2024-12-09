import { axiosInstance } from "../../main"
import { CHUNK_SIZE } from "../../configs/axiosConfigs";
import Cookies from 'js-cookie';

import AsyncTask from "../../module/tasks/AsyncTask";
import { generateMD5 , generateFileMD5 } from "../../module/functions/generateMD5";

/**
 * 
 * @param {File} file 上传的文件 
 * @param {String} parentUid 上传的目录（目标目录）
 * @param {Function} startCallback 启动上传前调用的回调函数，
 * @param {Function} uploadCallback 上传时调用的回调函数，包含 chunkIndex （上传的块索引）、 totalChunks （需要上传的块总量）、 size （当前上传的大小）、 totalSize （需要上传的大小）
 * @param {Function} mergeCallback 合并块时调用的回调函数， response（合并结果）
 */
const postFileAPI = async (file, parentUid, startCallback, uploadCallback, mergecallback) => {

  // 创建 AsyncTask 实例
  const task = new AsyncTask();

  // 创建任务实例后，执行任务之前调用
  if (typeof startCallback === "function") {
    startCallback();
  }

  // 延迟函数
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // 定义合并文件的 API 请求
  const mergeFileAPI = async (uid, totalChunks) => {
    try {
      const formData = new FormData();
      formData.append('uid', uid);
      formData.append('parentUid', parentUid); // 父文件夹uid
      formData.append('fileName', encodeURIComponent(file.name)); // 文件名
      formData.append('totalChunks', totalChunks);

      const response = await axiosInstance.post('/api/cloudDrive/mergeFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Cookies.get('token')
        }
      });

      console.log("File merge request successful:", response.data);
    } catch (error) {
      console.error("File merge request failed:", error);
      throw new Error("File merge failed");
    }
  };

  // 定义 HTTP 分块上传的任务执行函数
  const uploadFunction = async () => {
    const totalSize = file.size;
    const totalChunks = Math.ceil(totalSize / CHUNK_SIZE); // 计算总的块数

    const uuid = await generateFileMD5(file);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunk = file.slice(start, end); // 获取当前块

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
      formData.append('uid', uuid) // 文件 MD5 校验码
      formData.append('chunkIndex', chunkIndex); // 块索引：类比于数组索引，0开头，标记1
      formData.append('totalChunks', totalChunks); // 总块数：类比于数组长度
      formData.append('chunkMd5', chunkMd5Hash); // 块 MD5 校验码
      formData.append('chunkData', chunk); // 当前文件块数据
  
      let retryCount = 0;
      const maxRetries = 5;
      let success = false;
      const delayTime = 1000;
  
      // 循环尝试上传当前块
      while (retryCount < maxRetries && !success) {
        try {
          // 发送当前块的 POST 请求
          const response = await axiosInstance.post('/api/cloudDrive/postFile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': Cookies.get('token')
            }
          });
  
          if (typeof uploadCallback === "function") {
            uploadCallback({
              chunkIndex: chunkIndex, 
              totalChunks: totalChunks,
              size: end,
              totalSize: totalSize
            });
          }

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

    console.log("All chunks uploaded, merging file...");

    mergeFileAPI(uuid, totalChunks).then((response)=>{
      if (typeof mergecallback === "function") {
        mergecallback(response);
      }
    });
  };

  task.setExecuteFunction(uploadFunction);

  // 将任务添加到上传队列并执行
  axiosInstance.uploadQueue.addTask(task);
  
};

export default postFileAPI