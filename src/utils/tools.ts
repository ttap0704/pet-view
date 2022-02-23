export function setImageArray(data: { file_name: string }[]) {
  let image_arr = [];
  for (const x of data) {
    image_arr.push(x.file_name)
  }
  return image_arr;
}

export function setFileToImage(files: FileList | null): Promise<{ new: boolean, src: string }[]> {
  return new Promise((resolve) => {
    let new_file_arr: { new: boolean, src: string }[] = [];
    let count = 0;
    if (files) {
      Array.from(files).forEach(async (file) => {
        count++;
        const new_file_name = await readFile(file);
        new_file_arr.push({ new: true, src: new_file_name })
        if (count == files.length && new_file_arr.length == files.length) {
          console.log(new_file_arr, files.length, count, 'files length')
          resolve([...new_file_arr])
        }
        // setPreviewFile((state) => [...state, { file: file, imageUrl: new_file_name }]);
      })
    }
  })
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString())
      }
    }
    reader.readAsDataURL(file)
  })
}