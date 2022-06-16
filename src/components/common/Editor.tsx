import { FormControlLabel, FormGroup, Radio, styled } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { createElement, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import ImageResize from '@looop/quill-image-resize-module-react';
import UtilBox from './UtilBox';
import { setImageFormData } from '../../utils/tools';
import { fetchFileApi, fetchGetApi, fetchPostApi } from '../../utils/api';
Quill.register('modules/ImageResize', ImageResize);

interface EditorProps {
  confirm: boolean;
  onComplete: () => void;
}

const StyledQuill = styled(ReactQuill)(({ theme }) => ({
  width: '100%',

  '.ql-container': {
    height: '550px',

    '.ql-editor': {
      height: '100%',
    },
  },
}));

export default function Editor(props: EditorProps) {
  const contents = useRef('');
  const confirm = props.confirm;
  const onComplete = props.onComplete;

  const [targetContents, setTargetContents] = useState([
    {
      checked: false,
      type: 1,
      label: '유저',
    },
    {
      checked: false,
      type: 2,
      label: '관리자',
    },
  ]);

  useEffect(() => {
    if (confirm) {
      registrateNotice();
    }
  }, [confirm]);

  const registrateNotice = async () => {
    const img_tag_reg = /<IMG src=\"([^\"]*?)\"[^>]*>/gi;
    const img_tags = contents.current.match(img_tag_reg);

    const notice_files: File[] = [];
    const src_arr: string[] = [];
    if (img_tags && img_tags.length > 0) {
      for (const tag of img_tags) {
        const tmp_el = document.createElement('div');
        tmp_el.innerHTML = tag;
        if (tmp_el.children[0]) {
          const src = tmp_el.children[0].getAttribute('src');
          if (src) {
            src_arr.push(src);

            const src_res = await fetch(src);
            const blob = await src_res.blob();

            const extension = blob.type.split('/')[1];

            const new_file = new File([blob], 'tmp_name.' + extension, {
              lastModified: new Date().getTime(),
              type: blob.type,
            });

            notice_files.push(new_file);
          }
        }
      }
    }
    const find_item = targetContents.find(item => item.checked);
    if (find_item) {
      const last_id = await fetchGetApi(`/super/notice/last-id`);

      let tmp_contents = contents.current;
      console.log(src_arr);

      if (notice_files.length > 0) {
        const notice_image_data = await setImageFormData(
          [{ target_id: Number(last_id) + 1, files: notice_files }],
          'notice',
        );

        const uploaded_images: ImageType[] = await fetchFileApi('/upload/image', notice_image_data);
        const target_path = Math.floor(Number(last_id + 1) / 50) * 50;

        const tmp_div = document.createElement('div');
        tmp_div.innerHTML = tmp_contents;

        const children = tmp_div.children;
        let cnt = 0;
        for (const child of Array.from(children)) {
          const second_children = child.children;

          for (const child2 of Array.from(second_children)) {
            if (child2.tagName == 'IMG') {
              child2.setAttribute(
                'src',
                `http://localhost:3080/images/notice/${target_path}/${uploaded_images[cnt].file_name}`,
              );
              cnt++;
            }
          }
        }

        for (const image of uploaded_images) {
          console.log(image.file_name);
          tmp_contents.replace(
            src_arr[image.seq],
            `http://localhost:3080/image/notice/${target_path}/${image.file_name}`,
          );
        }

        tmp_contents = JSON.stringify(tmp_div.innerHTML);
      }

      const create_data = {
        contents: tmp_contents,
        target: find_item.type,
      };
      const notice = await fetchPostApi(`/super/notice`, create_data);

      console.log(notice);
    }

    onComplete();
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ size: ['small', false, 'large', 'huge'] }, { color: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
          ['image', 'video'],
        ],
      },

      ImageResize: {
        parchment: Quill.import('parchment'),
      },
    }),
    [],
  );

  const handleRadio = (idx: number) => {
    const tmp_contents = [...targetContents];
    tmp_contents[idx].checked = true;

    let false_idx = 0;
    if (idx == 0) {
      false_idx = 1;
    }
    tmp_contents[false_idx].checked = false;
    setTargetContents([...tmp_contents]);
  };

  return (
    <>
      <UtilBox sx={{ justifyContent: 'flex-start' }}>
        <FormGroup sx={{ flexDirection: 'row' }}>
          {targetContents.map((target, target_idx) => {
            return (
              <FormControlLabel
                control={
                  <Radio checked={target.checked} onChange={() => handleRadio(target_idx)} name={`${target.type}`} />
                }
                key={`target_content_${target_idx}`}
                label={target.label}
              />
            );
          })}
        </FormGroup>
      </UtilBox>
      <StyledQuill
        value={contents.current}
        onChange={(value: any) => {
          contents.current = value;
        }}
        modules={modules}
        placeholder='내용을 입력해주세요.'
      />
    </>
  );
}
