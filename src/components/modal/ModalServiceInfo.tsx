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
      alert_message = '?????? ??????????????? ???????????? ??????????????????.';
    }

    if (type == 'accommodation') {
      const service_info_vali = validation.service(serviceInfo);
      if (!service_info_vali) {
        alert_message = '1??? ????????? ?????? ????????? ??????????????????.';
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
        alert_message = '[ ?????? ??????, ?????? ??????, ????????? ?????? ??????]???\r\n[ HH:MM ]???????????? ??????????????????.';
      }
      const service_info_vali = validation.restaurant_time(serviceInfo);
      if (!service_info_vali) {
        alert_message = '[ ?????? ??????, ?????? ??????, ????????? ?????? ??????]???\r\n?????? ?????????????????????.';
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
      modal_confirm.openModalConfirm('?????? ????????? ?????????????????????????', () => {
        onUpdateInfo(final_servie_info);
      });
    }
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='?????? ??????' onClose={onClose} />
          <ModalServiceInfoContentsBox>
            <FormServiceInfo data={serviceInfo} onChangeInfo={updateInfo} mode={mode} type={type} />
          </ModalServiceInfoContentsBox>
          {mode == 'read' ? null : (
            <UtilBox>
              <Button variant='contained' color='orange' onClick={confirmUpdate}>
                ??????
              </Button>
            </UtilBox>
          )}
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalServiceInfo;
