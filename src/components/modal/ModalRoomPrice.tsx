import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModalContext } from '../../provider/ModalProvider';

import InputOutlined from '../input/InputOutlined';
import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';
import FormPeakSeason from '../form/FormPeakSeason';

interface ModalRoomPriceProps {
  visible: boolean;
  contents: {
    normal_price: string;
    normal_weekend_price: string;
    peak_price: string;
    peak_weekend_price: string;
  };
  mode?: string;
  onClose: () => void;
  onUpdatePrice: (data: { [key: string]: number }) => void;
}

interface PriceContentsType {
  [key: string]: {
    title: string;
    price: string;
  };
}

const ModalRoomPriceContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '40rem',
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

const PriceInputBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '100%',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

function ModalRoomPrice(props: ModalRoomPriceProps) {
  const { modal_confirm } = useContext(ModalContext);

  const visible = props.visible;
  const mode = props.mode;
  const contents = props.contents;
  const onClose = props.onClose;
  const onUpdatePrice = props.onUpdatePrice;

  const [priceContents, setPriceContents] = useState<PriceContentsType>({});

  useEffect(() => {
    if (visible) {
      setPriceContents({
        normal_price: {
          title: '기본 평일 가격',
          price: contents.normal_price,
        },
        normal_weekend_price: {
          title: '기본 주말 가격',
          price: contents.normal_weekend_price,
        },
        peak_price: {
          title: '성수기 평일 가격',
          price: contents.peak_price,
        },
        peak_weekend_price: {
          title: '성수기 주말 가격',
          price: contents.peak_weekend_price,
        },
      });
    }
  }, [visible]);

  const confirmUpdate = () => {
    modal_confirm.openModalConfirm('객실 가격을 등록하시겠습니까?', () => {
      const price_data: { [key: string]: number } = {};
      for (const [key, val] of Object.entries(priceContents)) {
        price_data[key] = Number(priceContents[key].price.replace(/[\,]/gi, ''));
      }

      onUpdatePrice(price_data);
    });
  };

  const onChangePirce = (value: string, key: string) => {
    setPriceContents(state => {
      return {
        ...state,
        [key]: {
          ...state[key],
          price: value,
        },
      };
    });
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title='가격 설정' onClose={onClose} />
          <ModalRoomPriceContentsBox className={mode == 'read' ? 'read' : ''}>
            {Object.keys(priceContents).map((key, item_idx) => {
              return (
                <PriceInputBox key={`room_price_${item_idx}`}>
                  <Typography sx={{ fontWeight: 'bold' }}>{priceContents[key].title}</Typography>
                  {mode != 'read' ? (
                    <InputOutlined
                      align='right'
                      width='70%'
                      value={priceContents[key].price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangePirce(e.target.value, key)}
                      format='price'
                    />
                  ) : (
                    <Typography>{priceContents[key].price} 원</Typography>
                  )}
                </PriceInputBox>
              );
            })}
          </ModalRoomPriceContentsBox>
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

export default ModalRoomPrice;
