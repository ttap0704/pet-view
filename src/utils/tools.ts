export function setImageArray(data: { file_name: string }[]) {
  let image_arr = [];
  for (const x of data) {
    image_arr.push(x.file_name)
  }
  return image_arr;
}