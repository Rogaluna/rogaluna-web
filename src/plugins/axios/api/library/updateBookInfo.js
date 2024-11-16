import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const updateBookInfoAPI = async (formData) => {

  // 创建一个新的 FormData 实例并添加表单数据
  // {
  //   id: '书籍 id',
  //   name: '新的书籍名称',
  //   desc: '新的书籍描述'
  //   tags: '新的书籍标签（整形数组）'
  // }
  const form = new FormData();
  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    
    // 检查属性是否为数组
    if (Array.isArray(value)) {
      value.forEach((item) => {
        // 为数组元素添加多个表单字段
        form.append(key, item);
      });
    } else {
      // 普通属性直接添加
      form.append(key, value);
    }
  });
  
  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.post('/api/library/updateBookInfo', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Cookies.get('token')
        }
    });
    // 返回文件列表
    return response.data;
  } catch (error) {
    console.error("更新书籍信息失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default updateBookInfoAPI