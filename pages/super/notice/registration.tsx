import { FormControlLabel, FormGroup, Radio, styled } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import Button from '../../../src/components/button/Button';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import { ModalContext } from '../../../src/provider/ModalProvider';

const Editor = dynamic(import('../../../src/components/common/Editor'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const AdminRestaurantInfo = () => {
  const { modal_confirm } = useContext(ModalContext);
  const [confirm, setConfirm] = useState(false);

  const confirmRegistration = () => {
    modal_confirm.openModalConfirm('공지사항을 등록하시겠습니까?', () => {
      setConfirm(true);
    });
  };

  return (
    <>
      <ContainerRegistrationItem title='공지사항 작성'>
        <Editor confirm={confirm} onComplete={() => setConfirm(false)} />
        <Button variant='contained' color='orange' sx={{ marginTop: '1rem' }} onClick={confirmRegistration}>
          등록
        </Button>
      </ContainerRegistrationItem>
    </>
  );
};

export default AdminRestaurantInfo;
