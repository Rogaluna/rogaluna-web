import { axiosInstance } from "../../main"
import { CHUNK_SIZE } from "../../configs/axiosConfigs";
import AsyncTask from "../../module/tasks/AsyncTask";

const postFileAPI = async (file, targetPath) => {
  
  // 定义 HTTP 分块上传的任务执行函数
  const uploadFunction = async () => {

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', chunk);

      try {
        const response = await axiosInstance.post('/fileStorage/postFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-File-Name': encodeURIComponent(file.name),
            'X-Chunk-Index': chunkIndex,
            'X-Total-Chunks': totalChunks,
            'X-Target-Path': encodeURIComponent(targetPath),
            'X-Merge-Request': chunkIndex === totalChunks - 1 ? 'true' : 'false' // 在最后一个块时设置为 true
          }
        });

        console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`, response.data);

      } catch (error) {
        console.error(`Error uploading chunk ${chunkIndex + 1}/${totalChunks}`, error);
        throw error;
      }
    }
  };

  // 创建 AsyncTask 实例并添加到上传队列
  const task = new AsyncTask(uploadFunction);

  // 将任务添加到上传队列并执行
  axiosInstance.uploadQueue.addTask(task);
  
};

export default postFileAPI