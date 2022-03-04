import * as React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import FormPostcode from '../form/FormPostcode';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';

interface ModalPostcodeFormProps {
  visible: boolean;
  onClose: () => void;
  onChangeAddress: (address: FinalPostcodeDataType) => void;
}

const ModalPostcodeFormContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 2rem',
  gap: '1rem',
}));

function ModalPostcodeForm(props: ModalPostcodeFormProps) {
  const onChangeAddress = props.onChangeAddress;
  const onClose = props.onClose;
  const visible = props.visible;

  const [address, setAddress] = useState<FinalPostcodeDataType>({
    zonecode: '',
    sido: '',
    sigungu: '',
    bname: '',
    road_address: '',
    building_name: '',
    detail_address: '',
  });

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title={`주소 수정`} onClose={onClose} />
          <ModalPostcodeFormContentsBox>
            <FormPostcode
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress({ ...address, detail_address: e.target.value })
              }
              onChangeAddress={data => setAddress({ ...address, ...data })}
              address={address}
            />
          </ModalPostcodeFormContentsBox>
          <UtilBox>
            <Button variant='contained' color='orange' onClick={() => onChangeAddress(address)}>
              주소 수정
            </Button>
          </UtilBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalPostcodeForm;
