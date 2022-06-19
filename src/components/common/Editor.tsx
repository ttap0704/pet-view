import { FormControlLabel, FormGroup, Radio, styled } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { createElement, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import InputOutlined from '../input/InputOutlined';
import ImageResize from '@looop/quill-image-resize-module-react';
import UtilBox from './UtilBox';
import { setImageFormData } from '../../utils/tools';
import { fetchFileApi, fetchGetApi, fetchPostApi } from '../../utils/api';
import { ModalContext } from '../../provider/ModalProvider';
import { useRouter } from 'next/router';
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
  const { modal_alert } = useContext(ModalContext);
  const contents = useRef('');
  const confirm = props.confirm;
  const onComplete = props.onComplete;
  const router = useRouter();

  const [editId, setEditId] = useState(0);
  const [title, setTitle] = useState('');
  const [targetContents, setTargetContents] = useState([
    {
      checked: false,
      type: 1,
      label: '유저/공지사항',
    },
    {
      checked: false,
      type: 2,
      label: '관리자/공지사항',
    },
    {
      checked: false,
      type: 3,
      label: '유저/이벤트',
    },
    {
      checked: false,
      type: 4,
      label: '관리자/이벤트',
    },
  ]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditId(Number(router.query.id));
      setEditContents(Number(router.query.id));
    }
  }, [router.isReady]);

  const setEditContents = async (id: number) => {
    const detail = await fetchGetApi(`/notice/${id}`);
    if (detail) {
      const tmp_target_contenst = [...targetContents];
      for (const item of tmp_target_contenst) {
        if (item.type == detail.target) {
          item.checked = true;
        }
      }
      try {
        contents.current = JSON.parse(detail.contents);
      } catch (err) {
        contents.current = detail.contents;
      }
      setTargetContents([...tmp_target_contenst]);
      setTitle(detail.title);
    }
  };

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
        title: title,
      };
      const notice = await fetchPostApi(`/super/notice`, create_data);
      const type = editId > 0 ? '수정' : '등록';

      if (notice.id) {
        modal_alert.openModalAlert(`공지사항이 ${type}되었습니다.`, true, () => {
          clearContents();
          onComplete();
        });
      } else {
        modal_alert.openModalAlert(`오류로 인해 ${type}이 실패하였습니다.`, true);
      }

      if (editId > 0) {
        await fetchPostApi(`/super/notice/${editId}/delete`, {});
      }
    }
  };

  const clearContents = () => {
    const tmp_contents = [...targetContents];
    for (const item of tmp_contents) {
      item.checked = false;
    }

    contents.current = '';
    setTargetContents([...tmp_contents]);
    setTitle('');
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
    let cur_idx = 0;
    for (const content of tmp_contents) {
      if (cur_idx == idx) {
        tmp_contents[cur_idx].checked = true;
      } else {
        tmp_contents[cur_idx].checked = false;
      }
      cur_idx++;
    }

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
      <InputOutlined
        placeholder='제목을 입력해주세요.'
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        sx={{ marginBottom: '0.5rem' }}
      />
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
