export function setImageArray(data: { file_name: string }[]) {
  let image_arr = [];
  for (const x of data) {
    image_arr.push(x.file_name)
  }
  return image_arr;
}

export function setFileToImage(files: FileList | null): Promise<{ new: boolean, src: string, origin: number }[]> {
  return new Promise((resolve) => {
    let new_file_arr: { new: boolean, src: string, origin: number }[] = [];
    let count = 0;
    if (files) {
      Array.from(files).forEach(async (file) => {
        const new_file_name = await readFile(file);
        count++;
        new_file_arr.push({ new: true, src: new_file_name, origin: count - 1 })
        if (count == files.length && new_file_arr.length == files.length) {
          resolve([...new_file_arr])
        }
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