import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, List, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import { ModalContext } from '../../provider/ModalProvider';
import ImageBox from '../image/ImageBox';
import OrderList from '../list/ListOrder';
import ButtonFileInput from '../button/ButtonFileInput';

import { setFileToImage } from '../../utils/tools';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';
import ContainerModalContents from '../container/ContainerModalContents';

interface ModalUploadProps {
  onUpload: () => void;
}

const ModalUploadContents = styled(Box)(({ theme }) => ({
  width: '50rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '2rem 1rem',
}));

function ModalUpload(props: ModalUploadProps) {
  const onUpload = props.onUpload;

  const { modal_upload, modal_confirm } = useContext(ModalContext);
  const [orderList, setOrderList] = useState<{ label: string; number: string; origin: number }[]>([]);
  const [buttonLabel, setButtonLabel] = useState('');

  useEffect(() => {
    if (!modal_upload.data.visible) setOrderList([]);
    else {
      if (modal_upload.data.title.indexOf('수정') >= 0) {
        setButtonLabel('수정');
      } else {
        setButtonLabel('등록');
      }
      setImageList(modal_upload.data.image_list);
    }
  }, [modal_upload.data.visible]);

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const exclude_origin_idx = [...modal_upload.data.image_list.map(item => item.origin)];
    const res_image_list = await setFileToImage(e.target.files, exclude_origin_idx);
    const image_list = [...modal_upload.data.image_list, ...res_image_list];
    if (image_list && image_list.length > 0) {
      modal_upload.setModalUploadImageList(image_list);
      setImageList(image_list);
    }
  };

  const deleteList = (origin_idx: number | null | undefined) => {
    if (Number(origin_idx) >= 0) {
      console.log(origin_idx, 'origin_idx');
      console.log(modal_upload.data.image_list);
      const image_list = [];
      for (const list of modal_upload.data.image_list) {
        if (list.origin != origin_idx) {
          image_list.push(list);
        }
      }

      modal_upload.setModalUploadImageList(image_list);
      modal_upload.setCurNum(0);
      setImageList(image_list);
    }
  };

  const setImageList = (image_list: ImageListType[]) => {
    setOrderList([
      ...image_list.map((item, index) => {
        return {
          ...item,
          label: `이미지 ${index + 1}번`,
          number: `${index + 1}`,
        };
      }),
    ]);
  };

  const setImageOrder = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setOrderList(state => {
      return [
        ...state.map((item, index) => {
          if (index == idx) {
            return {
              ...item,
              number: e.target.value,
            };
          } else {
            return item;
          }
        }),
      ];
    });
  };

  const completeChangeOrder = (origin_idx: number) => {
    let same_cnt = 0;
    const clone_order_list = [...orderList];
    const tmp_order_list = [...clone_order_list.sort((a, b) => Number(a.number) - Number(b.number))].map(
      (item, index) => {
        let new_item = {
          ...item,
          number: `${index + 1}`,
        };
        if (new_item.origin == orderList[index].origin) same_cnt++;
        return new_item;
      },
    );

    setOrderList([...tmp_order_list]);
    if (same_cnt == orderList.length) return;
    onChangeOrder(tmp_order_list, origin_idx);
  };

  const onChangeOrder = (tmp_order_list: { number: string; label: string; origin: number }[], origin_idx: number) => {
    const image_list: ImageListType[] = tmp_order_list.map(item => {
      const list = modal_upload.data.image_list.find(list_item => list_item.origin == item.origin);

      // 타입 에러 처리
      if (list == undefined) {
        return { new: true, src: '', origin: -1, file: null };
      }
      return list;
    });

    const tmp_cur_num = tmp_order_list.findIndex(item => item.origin == origin_idx);

    setOrderList([...tmp_order_list]);
    modal_upload.setModalUploadImageList(image_list);
    modal_upload.setCurNum(tmp_cur_num);
  };

  return (
    <>
      <ModalDefault
        bottom={false}
        white={false}
        visible={modal_upload.data.visible}
        onClose={modal_upload.closeModalUpload}
      >
        <ContainerModalContents>
          <LabelModal title={modal_upload.data.title} onClose={modal_upload.closeModalUpload} />
          <ModalUploadContents>
            <ImageBox
              type={modal_upload.data.type}
              imageList={
                modal_upload.data.image_list[modal_upload.data.cur_num]
                  ? [modal_upload.data.image_list[modal_upload.data.cur_num]]
                  : []
              }
              slide={false}
            />
            <UtilBox justifyContent='flex-end'>
              <ButtonFileInput title='업로드' multiple={true} onChange={uploadImages} id={'upload_modal'} />
            </UtilBox>
            <OrderList
              data={orderList}
              delete={true}
              type='image'
              onClick={(idx: number) => modal_upload.setCurNum(idx)}
              onChange={setImageOrder}
              onComplete={completeChangeOrder}
              onDeleteList={(origin_idx: number, idx: number) =>
                modal_confirm.openModalConfirm(`${idx + 1}번째 이미지를 삭제하시겠습니까?`, () => {
                  deleteList(origin_idx);
                })
              }
            />
          </ModalUploadContents>
          <UtilBox>
            <Button
              variant='contained'
              color='orange'
              onClick={() => modal_confirm.openModalConfirm(`등록하신 순서대로 이미지를 업로드하시겠습니까?`, onUpload)}
            >
              {buttonLabel}
            </Button>
          </UtilBox>
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalUpload;
