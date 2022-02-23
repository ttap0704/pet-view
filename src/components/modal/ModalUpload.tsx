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

const ModalUploadBox = styled(Box)(({ theme }) => ({
  width: '50rem',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.orange.main,
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
  const { modal_upload } = useContext(ModalContext);

  const [orderList, setOrderList] = useState<{ label: string; number: number }[]>([]);
  const [curNum, setCurNum] = useState(0);

  useEffect(() => {
    if (!modal_upload.data.visible) setOrderList([]);
  }, [modal_upload.data.visible]);

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image_list = await setFileToImage(e.target.files);
    console.log(image_list);
    if (image_list && image_list.length > 0) {
      modal_upload.setModalUploadImageList(image_list);
      setOrderList([
        ...image_list.map((item, index) => {
          return {
            label: `이미지 ${index + 1}번`,
            number: index + 1,
          };
        }),
      ]);
    }
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
            <OrderList data={orderList} type='image' onClick={(idx: number) => setCurNum(idx)} />
          </ModalUploadContents>
        </ModalUploadBox>
      </ModalDefault>
    </>
  );
}

export default ModalUpload;
