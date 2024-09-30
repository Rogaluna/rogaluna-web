import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const getFileListAPI = async (param, option = 0) => {
  
  /**
   * option 选项，根据不同的值传递不同的查询参数
   * 
   * 0：传递文件夹uid （默认）
   * 1：传递路径
   */

  try {
    let params = {}
    switch (option) {
      case 0:
        params = {
          folderUid: param
        }
        break; 
      case 1:
        params = {
          path: param
        }
        break;
    }
    
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.get('/api/fileStorage/getFileList', {
        params: params,
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