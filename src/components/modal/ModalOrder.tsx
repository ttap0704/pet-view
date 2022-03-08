import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import OrderList from '../common/OrderList';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';

interface ModalOrderProps {
  visible: boolean;
  list: OrderListDataType[];
  title: string;
  onClose: () => void;
  onChange: (list: OrderListDataType[]) => void;
}

const ModalOrderContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem 2rem',
  gap: '1rem',
  backgroundColor: theme.palette.white.main,

  '&.column': {
    flexDirection: 'column',
  },
}));

function ModalOrder(props: ModalOrderProps) {
  const { modal_edit, modal_confirm } = useContext(ModalContext);
  const [tmpList, setTmpList] = useState<OrderListDataType[]>([]);
  const visible = props.visible;
  const list = props.list;
  const title = props.title;
  const onClose = props.onClose;
  const onChange = props.onChange;

  useEffect(() => {
    if (list.length > 0) {
      setTmpList([...list]);
    } else {
      setTmpList([]);
    }
  }, [list]);

  const handleListInput = (value: string, idx: number) => {
    setTmpList(state => {
      return [
        ...state.map((item, item_idx) => {
          if (idx == item_idx) {
            return {
              ...item,
              number: value,
            };
          } else {
            return item;
          }
        }),
      ];
    });
  };

  const completeChangeOrder = (origin_idx: number) => {
    const tmp_list: OrderListDataType[] = tmpList
      .sort((a, b) => Number(a.number) - Number(b.number))
      .map((item, item_idx) => {
        return {
          ...item,
          number: `${item_idx + 1}`,
        };
      });

    setTmpList([...tmp_list]);
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title={title} onClose={onClose} />
        </ContainerModalContents>
        <ModalOrderContentsBox>
          <OrderList
            data={tmpList}
            delete={false}
            onClick={() => false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>, idx: number) => handleListInput(e.target.value, idx)}
            onComplete={origin_idx => completeChangeOrder(origin_idx)}
            onDeleteList={() => false}
          />
          <UtilBox>
            <Button
              variant='contained'
              color='orange'
              onClick={() =>
                modal_confirm.openModalConfirm(`등록하신 순서대로 객실을 수정하시겠습니까?`, () => {
                  onChange(tmpList);
                })
              }
            >
              수정
            </Button>
          </UtilBox>
        </ModalOrderContentsBox>
      </ModalDefault>
    </>
  );
}

export default ModalOrder;
