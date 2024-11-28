const getFileExtension = (file) => {
  // 检查输入是否为 File 对象
  if (!(file instanceof File)) {
      throw new Error("Input must be a File object");
  }

  const fileName = file.name;
  const lastDotIndex = fileName.lastIndexOf('.');

  // 如果没有点，或者点在开头（隐藏文件名的情况），返回空字符串
  if (lastDotIndex === -1 || lastDotIndex === 0 || lastDotIndex === fileName.length - 1) {
      return '';
  }

  // 返回扩展名，并转为小写
  return fileName.substring(lastDotIndex + 1).toLowerCase();
}

export default getFileExtension;