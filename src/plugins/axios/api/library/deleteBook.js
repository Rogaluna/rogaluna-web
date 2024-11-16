import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const deleteBookAPI = async (bookId) => {

  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.delete('/api/library/deleteBook', {
        params: {
          id: bookId
        },
        headers: {
          'Authorization': Cookies.get('token')
        }
    });
    // 返回文件列表
    return response.data;
  } catch (error) {
    console.error("删除书籍失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default deleteBookAPI