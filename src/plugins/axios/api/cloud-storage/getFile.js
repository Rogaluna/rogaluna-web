import { axiosInstance } from "../../main"

const getFileAPI = async (filePath) => {
  
  try {
      // 使用 URL 参数对象传递查询参数
      const response = await axiosInstance.get('/fileStorage/getFile', {
          params: {
              file: filePath
          },
          responseType: 'blob'
      });

      // 创建一个临时的 URL 对象，指向下载的文件
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // 从文件路径中提取文件名，设置为下载的文件名
      link.setAttribute('download', filePath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };

  } catch (error) {
      console.error("获取文件失败: ", error);
      // 根据需要返回值
      return { success: false, error: error.message };
  }
};

export default getFileAPI