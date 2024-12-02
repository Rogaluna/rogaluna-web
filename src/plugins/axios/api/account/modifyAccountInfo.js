import { axiosInstance } from "../../main";
import Cookies from 'js-cookie';


const modifyAccountInfoAPI = async (username, password, oldPassword) => {
  try {
    // 发送 POST 请求到注册 API
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('oldPassword', oldPassword);

    const response = await axiosInstance.post('/api/account/modifyAccountInfo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Cookies.get('token')
        }
    });

    console.log("已修改", response.data);

    // 返回注册成功的信息
    return response.data;
  } catch (error) {
    console.error("修改失败: ", error);
    // 根据需要返回值
    return { success: false, error: error.message };
  }
};

export default modifyAccountInfoAPI;
