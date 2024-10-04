import { axiosInstance } from "../../main"
import { BASE_HTTP_URL } from "../../configs/baseUrl";
import Cookies from 'js-cookie';

const fetchFileDirectLinkAPI = async (filePath) => {
  try {
		// 创建一个 FormData 对象
    const formData = new FormData();
    formData.append('filePath', filePath); // 添加 filePath 到表单数据中

		// 使用 URL 参数对象传递查询参数
		const response = await axiosInstance.post('/api/cloudDrive/fetchFileDirectLink', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 设置请求头
				'Authorization': Cookies.get('token')
      },
    });

		// 获取直链
		const { downloadToken } = response.data;
		
		// 创建一个临时的 URL 对象，指向下载的文件
		const link = document.createElement('a');
		link.href = `${BASE_HTTP_URL}/api/cloudDrive/getFile?token=${downloadToken}`;
		// 从文件路径中提取文件名，设置为下载的文件名
		link.setAttribute('download', filePath.split('/').pop());
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		return { success: true };

  } catch (error) {
		console.error("获取下载链接失败: ", error);
		// 根据需要返回值
		return { success: false, error: error.message };
  }
};

export default fetchFileDirectLinkAPI;