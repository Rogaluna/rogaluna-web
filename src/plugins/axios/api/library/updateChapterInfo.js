import { axiosInstance } from "../../main"
import Cookies from 'js-cookie';

const updateChapterInfoAPI = async (formData) => {

  // 创建一个新的 FormData 实例并添加表单数据
  // {
  //   id: '书籍 id',
  //   index: '章节索引',
  //   newIndex: '新的章节索引',
  //   name: '新的章节名称'
  //   group: '新的章节组别'
  // }
  const form = new FormData();
  Object.keys(formData).forEach((key) => {
    form.append(key, formData[key]);
  });
  
  try {
    // 使用 URL 参数对象传递查询参数
    const response = await axiosInstance.post('/api/library/updateChapterInfo', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Cookies.get('token')
        }
    });
    // 返回文件列表
    return response.data;
  } catch (error) {
    console.error("更新章节信息失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default updateChapterInfoAPI