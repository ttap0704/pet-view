import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModalContext } from '../../provider/ModalProvider';

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
  const { modal_confirm } = useContext(ModalContext);

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

  useEffect(() => {
    if (!visible) {
      setAddress({
        zonecode: '',
        sido: '',
        sigungu: '',
        bname: '',
        road_address: '',
        building_name: '',
        detail_address: '',
      });
    }
  }, [visible]);

  const confirmChange = () => {
    modal_confirm.openModalConfirm('주소를 수정하시겠습니까?', () => {
      onChangeAddress(address);
    });
  };

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
            <Button variant='contained' color='orange' onClick={() => confirmChange()}>
              수정
            </Button>
          </UtilBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalPostcodeForm;
