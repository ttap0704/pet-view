import { styled } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

import { readFile } from '../../utils/tools';

interface EditorProps {
  confirm: boolean;
  onComplete: () => void;
}

const Quill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const StyledQuill = styled(Quill)(({ theme }) => ({
  width: '100%',

  '.ql-container': {
    height: '750px',

    '.ql-editor': {
      height: '100%',
    },
  },
}));

export default function Editor(props: EditorProps) {
  const contents = useRef('');
  const confirm = props.confirm;
  const onComplete = props.onComplete;

  useEffect(() => {
    if (confirm) {
      registrateNotice();
    }
  }, [confirm]);

  const registrateNotice = async () => {
    console.log(contents.current);
    const img_tag_reg = /<IMG src=\"([^\"]*?)\">/gi;
    const img_tags = contents.current.match(img_tag_reg);

    console.log(img_tags);
    if (img_tags && img_tags.length > 0) {
      for (const tag of img_tags) {
        const tmp_el = document.createElement('div');
        tmp_el.innerHTML = tag;
        if (tmp_el.children[0]) {
          const src = tmp_el.children[0].getAttribute('src');
          if (src) {
            const src_res = await fetch(src);
            const blob = await src_res.blob();

            const new_file = new File([blob], 'src_res', {
              lastModified: new Date().getTime(),
              type: blob.type,
            });
          }
        }
      }
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
    }),
    [],
  );

  return (
    <>
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
