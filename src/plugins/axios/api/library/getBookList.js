import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const getBookListAPI = async (opt = 0, param = "") => {

  /**
   * opt 可能的参数
   * 0：常规获取书籍列表
   * 1：获取用户收藏列表
   * 2：获取用户编写列表
   */

  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.get('/api/library/getBookList', {
        params: {
          opt: opt,
          param: param
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

export default getBookListAPI