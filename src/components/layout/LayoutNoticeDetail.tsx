import UtilBox from '../../../src/components/common/UtilBox';
import { Box, Divider, styled } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { fetchGetApi } from '../../../src/utils/api';
import { getDate } from '../../../src/utils/tools';
import { useRouter } from 'next/router';
import { ModalContext } from '../../provider/ModalProvider';
import parse from 'html-react-parser';
import 'react-quill/dist/quill.snow.css';

const TitleBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '7rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '0.5rem',
}));

const NoticeDivider = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '1px',
  backgroundColor: theme.palette.gray_4.main,
}));

const MainTitle = styled('h1')(({ theme }) => ({}));
const DateTitle = styled('h3')(({ theme }) => ({
  color: theme.palette.gray_3.main,
}));

const LayoutNoticeDetailBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '60rem',
  height: '100%',
}));

const LayoutNoticeDetail = () => {
  const router = useRouter();
  const { modal_alert } = useContext(ModalContext);
  const [notice, setNotice] = useState<NoticeType | null>(null);

  useEffect(() => {
    return () => {
      setNotice(null);
    };
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.id) {
      getNotice(`${router.query.id}`);
    }
  }, [router.isReady]);

  const getNotice = async (id: string) => {
    const tmp_notice: NoticeType = await fetchGetApi(`/notice/${id}`);
    tmp_notice.created_at = getDate(tmp_notice.created_at);
    try {
      tmp_notice.contents = JSON.parse(tmp_notice.contents);
    } catch (err) {
      tmp_notice.contents = tmp_notice.contents;
    }

    setNotice({ ...tmp_notice });
  };

  return (
    <LayoutNoticeDetailBox>
      {notice ? (
        <>
          <TitleBox>
            <MainTitle>{notice.title}</MainTitle>
            <DateTitle>{getDate(notice.created_at)}</DateTitle>
          </TitleBox>
          <NoticeDivider />
          <Box
            className='ql-editor'
            sx={{ paddingTop: '1rem !important', paddingX: '0 !important', overflow: 'hidden' }}
          >
            {parse(notice.contents)}
          </Box>
        </>
      ) : null}
    </LayoutNoticeDetailBox>
  );
};

export default LayoutNoticeDetail;
