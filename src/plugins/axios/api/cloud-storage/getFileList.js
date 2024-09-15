import { axiosInstance } from "../../main"

const getFileListAPI = async (filePath) => {
  
  try {
      // 使用 URL 参数对象传递查询参数
      const response = await axiosInstance.get('/api/fileStorage/getFileList', {
          params: {
              directory: filePath
          }
      });
      // 返回文件列表
      return response.data;
  } catch (error) {
      console.error("获取文件列表失败: ", error);
      // 根据需要返回值
      return { success: false, error: error.message };
  }
};

export default getFileListAPI