import UtilBox from '../../../src/components/common/UtilBox';
import { Box, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import { useEffect, useState } from 'react';
import { fetchGetApi } from '../../../src/utils/api';
import { setMonthKorDropdownItems } from '../../../src/utils/tools';
import NoticeLayout from '../../../src/components/layout/LayoutNotice';

const MainTitle = styled('h3')(({ theme }) => ({}));

const ChartBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20rem',
}));

const DropdownBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
}));

const AdminNoticeIndex = () => {
  const user = useSelector((state: RootState) => state.userReducer);

  return <NoticeLayout target={'2, 4'} parent='/admin' />;
};

export default AdminNoticeIndex;
