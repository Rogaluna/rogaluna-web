import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const newChapterAPI = async (formData) => {

  // 创建一个新的 FormData 实例并添加表单数据
  // {
  //   id: 'f6d35e4a-44ba-4f0e-b165-79960c5fbca5',
  //   index： 0,
  //   name: '新章节',
  //   group: ''
  // }
  const form = new FormData();
  Object.keys(formData).forEach((key) => {
    form.append(key, formData[key]);
  });

  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.post('/api/library/newChapter', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Cookies.get('token')
        }
    });
    // 返回文件列表
    return response.data;
  } catch (error) {
    console.error("新建章节失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default newChapterAPI