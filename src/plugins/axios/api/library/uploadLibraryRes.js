import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';
import { generateFileMD5 } from "../../module/functions/generateMD5";
import { MAX_LIBRARY_RESOURCE_UPLOAD_SIZE } from "../../configs/axiosConfigs";
import getFileExtension from "../../module/functions/getFileExtension";

const uploadLibraryResourceAPI = async (bookId, chapterIndex, file) => {
  try {
    // 检查文件大小
    if (file.size > MAX_LIBRARY_RESOURCE_UPLOAD_SIZE) {
      throw new Error(`文件大小超过限制（最大 ${MAX_LIBRARY_RESOURCE_UPLOAD_SIZE / (1024 * 1024)} MB）`);
    }

    // 生成文件 MD5 值
    const fileMd5 = await generateFileMD5(file);

    const form = new FormData();
    form.append('id', bookId);
    form.append('index', chapterIndex);
    form.append('type', getFileExtension(file));
    form.append('data', file);
    form.append('md5', fileMd5);

    // 发起 POST 请求
    const response = await axiosInstance.post('/api/library/uploadResource', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': Cookies.get('token'),
      },
    });

    // 判断响应是否成功
    if (response.status === 200 && response.data.success) {
      return response.data; // 成功返回响应数据
    } else {
      throw new Error(response.data.message || '文件上传失败');
    }
  } catch (error) {
    console.error("上传资源失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default uploadLibraryResourceAPI