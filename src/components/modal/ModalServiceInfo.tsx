import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModalContext } from '../../provider/ModalProvider';

import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';
import FormServiceInfo from '../form/FormServiceInfo';

import validation from '../../../src/utils/validation';

interface ModalServiceInfoProps {
  visible: boolean;
  contents: ServiceInfoType;
  type: string;
  mode?: string;
  onClose: () => void;
  onUpdateInfo: (service_info: ServiceInfoType) => void;
}

const ModalServiceInfoContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  gap: '1rem',

  '&.read': {
    width: '25rem',
  },
}));

function ModalServiceInfo(props: ModalServiceInfoProps) {
  const { modal_confirm, modal_alert } = useContext(ModalContext);

  const visible = props.visible;
  const mode = props.mode;
  const type = props.type;
  const contents = props.contents;
  const onClose = props.onClose;
  const onUpdateInfo = props.onUpdateInfo;

  const [serviceInfo, setServiceInfo] = useState<ServiceInfoType>({
    contact: '',
    site: '',
    kakao_chat: '',
  });

  useEffect(() => {
    if (visible) {
      setServiceInfo({
        contact: contents.contact ?? '',
        site: contents.site ?? '',
        kakao_chat: contents.kakao_chat ?? '',
        open: contents.open ?? '',
        close: contents.close ?? '',
        last_order: contents.last_order ?? '',
      });
    }
  }, [visible]);

  const updateInfo = (key: string, value: string) => {
    setServiceInfo(state => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const confirmUpdate = () => {
    let alert_message = '';

    const service_info_concact_vali = validation.number(serviceInfo.contact);
    if (!service_info_concact_vali && serviceInfo.contact.length > 0) {
      alert_message = '문의 전화번호는 숫자로만 입력해주세요.';
    }

    if (type == 'accommodation') {
      const service_info_vali = validation.service(serviceInfo);
      if (!service_info_vali) {
        alert_message = '1개 이상의 문의 정보를 입력해주세요.';
      }
    } else {
      let service_info_time_vali = true;
      for (const [key, val] of Object.entries(serviceInfo)) {
        if (['open', 'close', 'last_order'].includes(key)) {
          const service_time_vali = validation.time(val);

          if (!service_time_vali) {
            service_info_time_vali = false;
            break;
          }
        }
      }
      if (!service_info_time_vali) {
        alert_message = '[ 오픈 시간, 마감 시간, 마지막 주문 시간]은\r\n[ HH:MM ]형식으로 입력해주세요.';
      }
      const service_info_vali = validation.restaurant_time(serviceInfo);
      if (!service_info_vali) {
        alert_message = '[ 오픈 시간, 마감 시간, 마지막 주문 시간]은\r\n필수 입력사항입니다.';
      }
    }

    if (alert_message.length > 0) {
      modal_alert.openModalAlert(alert_message, true);
      return;
    } else {
      const final_servie_info = { ...serviceInfo };

      if (type == 'accommodation') {
        delete final_servie_info.close;
        delete final_servie_info.open;
        delete final_servie_info.last_order;
      }
      modal_confirm.openModalConfirm('문의 정보를 등록하시겠습니까?', () => {
        onUpdateInfo(final_servie_info);
      });
    }
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='가격 설정' onClose={onClose} />
          <ModalServiceInfoContentsBox>
            <FormServiceInfo data={serviceInfo} onChangeInfo={updateInfo} mode={mode} type={type} />
          </ModalServiceInfoContentsBox>
          {mode == 'read' ? null : (
            <UtilBox>
              <Button variant='contained' color='orange' onClick={confirmUpdate}>
                등록
              </Button>
            </UtilBox>
          )}
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalServiceInfo;
