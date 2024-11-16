import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const getChapterInfoAPI = async (bookId, chapterIndex) => {

  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.get('/api/library/getChapterInfo', {
        params: {
          id: bookId,
          index: chapterIndex
        },
        headers: {
          'Authorization': Cookies.get('token')
        }
    });
    // 返回文件列表
    return response.data;
  } catch (error) {
    console.error("获取书籍列表失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default getChapterInfoAPI