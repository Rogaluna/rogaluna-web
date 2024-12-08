import SparkMD5 from 'spark-md5';

// 生成 MD5 校验码，需传入字节数组，需要注意：如果传入 blob ，很有可能会造成编码错误，因为 blob 和二进制字节流不一致
export const generateMD5 = (data) => {
  return SparkMD5.ArrayBuffer.hash(data);
};

// 生成一整个文件的 MD5 校验码，需传入文件对象，可传入两个函数，开始的时候触发（onStart）结束的触发（onProgress）
export const generateFileMD5 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const md5Hash = generateMD5(arrayBuffer); 
      resolve(md5Hash);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};