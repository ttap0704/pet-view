import { Box } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import { fetchGetApi } from '../../../src/utils/api';

const AdminRestaurantInfo = () => {
  const [contents, setContents] = useState('');

  useEffect(() => {
    getNotice();
  }, []);

  const getNotice = async () => {
    const notice = await fetchGetApi(`/super/notice/2`);

    setContents(JSON.parse(notice.contents));
  };
  return (
    <>
      <ContainerRegistrationItem title='공지사항 관리'>
        <Box>{parse(contents)}</Box>
      </ContainerRegistrationItem>
    </>
  );
};

export default AdminRestaurantInfo;
