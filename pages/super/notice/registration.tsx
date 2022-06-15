import { styled } from '@mui/material';
import { useEffect, useState, useContext, useMemo } from 'react';
import Button from '../../../src/components/button/Button';

import Editor from '../../../src/components/common/Editor';
import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import { ModalContext } from '../../../src/provider/ModalProvider';
import { toolbar } from '../../../src/utils/editor_tools';

const CustomEditor = styled(Editor)(({ theme }) => ({}));

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
        <CustomEditor confirm={confirm} onComplete={() => setConfirm(false)} />
        <Button variant='contained' color='orange' sx={{ marginTop: '1rem' }} onClick={confirmRegistration}>
          등록
        </Button>
      </ContainerRegistrationItem>
    </>
  );
};

export default AdminRestaurantInfo;
