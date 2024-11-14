import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const getBookReadProgressAPI = async (bookId) => {

  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.get('/api/library/getBookReadProgress', {
        params: {
          id: bookId
        },
        headers: {
          'Authorization': Cookies.get('token')
        }
    });
    // 返回结果
    return response.data;
  } catch (error) {
    console.error("获取书籍阅读进度失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default getBookReadProgressAPI