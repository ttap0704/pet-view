import * as React from 'react';
import { useContext, useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ModalDefault from './ModalDefault';
import ModalTitle from './ModalTitle';
import { ModalContext } from '../../provider/ModalProvider';
import ImageBox from '../image/ImageBox';
import OrderList from '../common/OrderList';
import ButtonFileInput from '../button/ButtonFileInput';

import { setFileToImage } from '../../utils/tools';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';

const ModalUploadBox = styled(Box)(({ theme }) => ({
  width: '50rem',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

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

function ModalUpload() {
  const { modal_upload, modal_confirm } = useContext(ModalContext);

  const [orderList, setOrderList] = useState<{ label: string; number: string }[]>([]);
  const [curNum, setCurNum] = useState(0);

  useEffect(() => {
    if (!modal_upload.data.visible) setOrderList([]);
  }, [modal_upload.data.visible]);

  useEffect(() => {
    if (modal_confirm.data.confirm) {
      const target = modal_confirm.data.target;
      const target_idx = modal_confirm.data.target_idx;

      console.log(target);
      switch (target) {
        case 'delete_list':
          deleteList(target_idx);
          break;
      }
    }
  }, [modal_confirm.data.confirm]);

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const res_image_list = await setFileToImage(e.target.files);
    const image_list = [...modal_upload.data.image_list, ...res_image_list];
    if (image_list && image_list.length > 0) {
      modal_upload.addModalUploadImageList(image_list);
      setImageList(image_list);
    }
  };

  const deleteList = (idx: number | null | undefined) => {
    if (idx) {
      const image_list = [
        ...modal_upload.data.image_list.filter((item, index) => {
          console.log(item, index);
          return index != idx;
        }),
      ];
      modal_upload.setModalUploadImageList(image_list);
      setImageList(image_list);
    }
  };

  const setImageList = (image_list: { new: boolean; src: string }[]) => {
    setOrderList([
      ...image_list.map((item, index) => {
        return {
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

  const completeChangeOrder = () => {
    console.log('comp');
    let order_arr: number[] = [];

    const tmp_order_list = orderList
      .sort((a, b) => Number(a.number) - Number(b.number))
      .map((item, index) => {
        order_arr.push(index);
        return {
          ...item,
          number: `${index + 1}`,
        };
      });
    // setOrderList(state => {
    //   return state
    //     .sort((a, b) => Number(a.number) - Number(b.number))
    //     .map((item, index) => {
    //       order_arr.push(index);
    //       return {
    //         ...item,
    //         number: `${index + 1}`,
    //       };
    //     });
    // });

    console.log(tmp_order_list, order_arr);
  };

  return (
    <>
      <ModalDefault
        bottom={false}
        white={false}
        visible={modal_upload.data.visible}
        onClose={modal_upload.closeModalUpload}
      >
        <ModalUploadBox>
          <ModalTitle title={modal_upload.data.title} onClose={modal_upload.closeModalUpload} />
          <ModalUploadContents>
            <ImageBox
              type={modal_upload.data.type}
              imageList={modal_upload.data.image_list[curNum] ? [modal_upload.data.image_list[curNum]] : []}
              slide={false}
            />
            <UtilBox justifyContent='flex-end'>
              <ButtonFileInput title='이미지 업로드' multiple={true} onChange={uploadImages} />
            </UtilBox>
            <OrderList
              data={orderList}
              type='image'
              onClick={(idx: number) => setCurNum(idx)}
              onChange={setImageOrder}
              onComplete={completeChangeOrder}
              onDeleteList={(idx: number) =>
                modal_confirm.openModalConfirm(`${idx + 1}번 이미지를 삭제하시겠습니까?`, 'delete_list', idx)
              }
            />
          </ModalUploadContents>
          <UtilBox>
            <Button variant='contained' color='orange'>
              이미지 등록
            </Button>
          </UtilBox>
        </ModalUploadBox>
      </ModalDefault>
    </>
  );
}

export default ModalUpload;
