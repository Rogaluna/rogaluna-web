import { axiosInstance } from "../../main";
import Cookies from 'js-cookie';

const createFolderAPI = async (parentUid, folderName) => {
  try {
    const formData = new FormData();
    formData.append('parent_uid', parentUid);
    formData.append('folder_name', folderName);

    // 发送 POST 请求以创建新文件夹
    const response = await axiosInstance.post('/api/fileStorage/createFolder', formData, {
      headers: {
        'Authorization': Cookies.get('token'),
        'Content-Type': 'multipart/form-data'
      }
    });
    // 返回响应数据
    return response.data;
  } catch (error) {
    console.error("新建文件夹失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default createFolderAPI;
