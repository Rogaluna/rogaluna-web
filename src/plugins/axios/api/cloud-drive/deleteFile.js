import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const deleteFileAPI = async (uid) => {

  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.delete('/api/cloudDrive/deleteFile', {
        params: {
          id: uid
        },
        headers: {
          'Authorization': Cookies.get('token')
        }
    });
    // 返回文件列表
    return response.data;
  } catch (error) {
    console.error("删除文件/文件夹失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default deleteFileAPI