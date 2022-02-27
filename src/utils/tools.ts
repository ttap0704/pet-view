export function setImageArray(data: { file_name: string }[]) {
  let image_arr = [];
  for (const x of data) {
    image_arr.push(x.file_name)
  }
  return image_arr;
}

export function setFileToImage(files: FileList | null, exclude_origin_idx: number[]): Promise<ImageListType[]> {
  return new Promise((resolve) => {
    let new_file_arr: ImageListType[] = [];
    let count = 0;
    let origin = 0;
    if (files) {
      Array.from(files).forEach(async (file) => {
        const new_file_name = await readFile(file);
        count++;

        do {
          origin++
        } while (exclude_origin_idx.includes(origin - 1))

        new_file_arr.push({ new: true, src: new_file_name, origin: origin - 1, file })
        if (count == files.length && new_file_arr.length == files.length) {
          resolve([...new_file_arr])
        }
      })
    }
  })
}

export function setFileArray(image_list: ImageListType[]) {
  const file_array: File[] = [];
  for (const item of image_list) {
    if (item.file) {
      file_array.push(item.file);
    }
  }
  return file_array;
}

export function setImageFormData(files: File[], target: string, target_id: number) {
  let upload_images = new FormData();
  for (let i = 0, leng = files.length; i < leng; i++) {
    const file_name_arr = files[i].name.split(".");
    const file_extention = file_name_arr[file_name_arr.length - 1];
    let file_name = "";
    // if (target == "accommodation") {
    //   file_name = `${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
    // } else if (target == "rooms") {
    //   file_name = `${item.accommodation_id}_${target_id}_${i}_${new Date().getTime()}.${file_extention}`;
    // }

    const new_file = new File([files[i]], file_name, {
      type: "image/jpeg",
    });

    upload_images.append(`files_${i}`, new_file);
  }
  let category = "";
  if (target == "accommodation") {
    category = "2";
  } else if (target == "rooms") {
    category = "21";
  }
  upload_images.append("length", files.length.toString());
  upload_images.append("category", category);
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
