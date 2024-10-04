import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const getFileListAPI = async (param) => {

  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.get('/api/cloudDrive/getFileList', {
        params: {
          folderUid: param
        },
        headers: {
          'Authorization': Cookies.get('token')
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