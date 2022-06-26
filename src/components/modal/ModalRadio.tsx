import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import Button from '../button/Button';
import UtilBox from '../common/UtilBox';

interface ModalRadioProps {
  visible: boolean;
  title: string;
  contents: { label: string; id: number | string }[];
  onClose: () => void;
  onCompleteUpdate: (data: { label: string; id: number | string }) => void;
  buttonTitle?: string;
  useConfirm?: boolean;
}

const CustomFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  '.MuiFormControlLabel-root': {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    margin: 0,
  },
}));

const ModalRadioContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '20rem',
  height: 'auto',
  maxHeight: '20rem',
  padding: '2rem',
  overflowY: 'auto',
}));

function ModalRadio(props: ModalRadioProps) {
  const { modal_confirm, modal_alert, modal_upload } = useContext(ModalContext);
  const visible = props.visible;
  const title = props.title;
  const contents = props.contents;
  const onClose = props.onClose;
  const onCompleteUpdate = props.onCompleteUpdate;
  const button_title = props.buttonTitle;
  const use_confirm = props.useConfirm;

  const [value, setValue] = useState<number | string>('');

  useEffect(() => {
    if (!visible) {
      setValue('');
    }
  }, [visible]);

  const setCurValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const confirmUpdate = () => {
    const item = contents.find(item => item.id == value);
    if (item) {
      onCompleteUpdate(item);
    }
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title={title} onClose={onClose} />
          <ModalRadioContentsBox>
            <CustomFormControl>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                name='radio-buttons-group'
                value={value}
                onChange={setCurValue}
              >
                {contents.map((item, item_idx) => {
                  return (
                    <FormControlLabel
                      key={`radio_contents_${item_idx}`}
                      value={item.id}
                      control={<Radio />}
                      label={item.label}
                    />
                  );
                })}
              </RadioGroup>
            </CustomFormControl>
          </ModalRadioContentsBox>
          <UtilBox>
            <Button
              variant='contained'
              color='orange'
              onClick={() => {
                if (use_confirm !== false) {
                  modal_confirm.openModalConfirm(`수정을 완료하시겠습니까?`, confirmUpdate);
                } else {
                  confirmUpdate();
                }
              }}
            >
              {button_title ? button_title : '선택'}
            </Button>
          </UtilBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalRadio;
