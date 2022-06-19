import { FormControlLabel, FormGroup, Radio, styled } from '@mui/material';
import dynamic from 'next/dynamic';
import { NextRouter, useRouter } from 'next/router';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import Button from '../../../src/components/button/Button';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import { ModalContext } from '../../../src/provider/ModalProvider';
import { fetchGetApi } from '../../../src/utils/api_back';

interface NoticeRegistrationProps {
  router?: NextRouter;
}

const Editor = dynamic(import('../../../src/components/common/Editor'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const AdminRestaurantInfo = (props: NoticeRegistrationProps) => {
  const router = useRouter();
  const { modal_confirm } = useContext(ModalContext);
  const [confirm, setConfirm] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEdit(true);
    }
  }, [router.isReady]);

  const confirmRegistration = () => {
    modal_confirm.openModalConfirm(`공지사항을 ${edit ? '수정' : '등록'}하시겠습니까?`, () => {
      setConfirm(true);
    });
  };

  return (
    <>
      <ContainerRegistrationItem title='공지사항 작성'>
        <Editor confirm={confirm} onComplete={() => setConfirm(false)} />
        <Button variant='contained' color='orange' sx={{ marginTop: '1rem' }} onClick={confirmRegistration}>
          {edit ? '수정' : '등록'}
        </Button>
      </ContainerRegistrationItem>
    </>
  );
};

export default AdminRestaurantInfo;
