import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import InputOutlined from '../input/InputOutlined';
import Textarea from '../textarea/Textarea';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import Button from '../button/Button';

interface ModalEditProps {
  onChange: (value: string | number) => void;
}

const ModalEditContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '40rem',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 2rem',
  gap: '1rem',

  '&.column': {
    flexDirection: 'column',
  },
}));

function ModalEdit(props: ModalEditProps) {
  const onChange = props.onChange;

  const { modal_edit, modal_confirm } = useContext(ModalContext);
  const [newValue, setNewValue] = useState<string | number>('');

  useEffect(() => {
    setNewValue(modal_edit.data.value);
  }, [modal_edit.data.value]);

  const completeEdit = () => {
    modal_edit.closeModalEdit();
    onChange(newValue);
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={modal_edit.data.visible} onClose={modal_edit.closeModalEdit}>
        <ContainerModalContents>
          <LabelModal title={modal_edit.data.title} onClose={modal_edit.closeModalEdit} />
          <ModalEditContentsBox className={modal_edit.data.type == 'textarea' ? 'column' : ''}>
            {modal_edit.data.type == 'input' ? (
              <InputOutlined
                readOnly={modal_edit.data.read_only}
                value={newValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
              />
            ) : (
              <Textarea
                readOnly={modal_edit.data.read_only}
                value={newValue}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewValue(e.target.value)}
                placeholder=''
              />
            )}
            {modal_edit.data.read_only ? null : (
              <Button
                variant='contained'
                color='orange'
                onClick={() => modal_confirm.openModalConfirm(`수정을 완료하시겠습니까?`, completeEdit)}
              >
                수정
              </Button>
            )}
          </ModalEditContentsBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalEdit;
