import UtilBox from '../../../src/components/common/UtilBox';
import { Box, IconButton, Pagination, Stack, styled, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import { useEffect, useState } from 'react';
import { fetchGetApi } from '../../../src/utils/api';
import { getDate, setMonthKorDropdownItems } from '../../../src/utils/tools';
import { HiChevronRight } from 'react-icons/hi';
import cookies from 'next-cookies';
import { useRouter } from 'next/router';

interface NoticeLayoutProps {
  target: string;
  parent: string;
}

const MainTitle = styled('h3')(({ theme }) => ({}));

const NoticeLayoutBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
}));

const NoticeListContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  borderTop: '1px solid',
  borderBottom: '1px solid',
  borderColor: theme.palette.gray_4.main,
}));

const NoticeList = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '7rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',

  '&:not(:last-of-type)': {
    borderBottom: '1px solid',
    borderColor: theme.palette.gray_4.main,
  },

  '& > div': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    width: '80%',
    'h3, h4': {
      fontWeight: '500 !important',
    },

    h3: {
      overflow: 'hidden',
      width: '100%',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    h4: {
      color: theme.palette.gray_3.main,

      span: {
        fotSize: '1rem',
        color: theme.palette.orange.main,
        marginLeft: '.25rem',
      },
    },
  },
}));

const NoticeLayout = (props: NoticeLayoutProps) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userReducer);
  const [max, setMax] = useState(0);
  const [noticeList, setNoticeList] = useState<NoticeType[]>([]);
  const [page, setPage] = useState(1);

  const target = props.target;
  const parent = props.parent;

  useEffect(() => {
    return () => {
      setNoticeList([]);
    };
  }, []);

  useEffect(() => {
    if (target.length > 0) {
      getNoticeList();
    }
  }, [target, page]);

  const getNoticeList = async () => {
    const list = await fetchGetApi(`/notice?target=${target}&page=${page}`);

    const count = list.count;
    const rows: NoticeType[] = list.rows;
    const before_one_week = new Date().setTime(new Date().getTime() - 1000 * 60 * 60 * 24 * 3);
    for (const item of rows) {
      item.created_at = getDate(item.created_at);
      item.title = `[${setTarget(item.target)}] ${item.title}`;

      if (new Date(item.created_at).getTime() >= before_one_week) {
        item.new = true;
      }
    }

    setMax(Math.ceil(count / 10));
    setNoticeList([...rows]);
  };

  const moveDetail = (notice: NoticeType) => {
    router.push(`${parent}/notice/${notice.id}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const setTarget = (cur_target: number) => {
    if ([3, 4].includes(cur_target)) {
      return '이벤트';
    } else {
      return '공지사항';
    }
  };

  return (
    <NoticeLayoutBox>
      <UtilBox justifyContent='flex-start'>
        <MainTitle>공지사항 및 이벤트</MainTitle>
      </UtilBox>
      <NoticeListContainer>
        {noticeList.length > 0
          ? noticeList.map((notice, notice_idx) => {
              return (
                <NoticeList key={`notice_list_${notice_idx}`} onClick={() => moveDetail(notice)}>
                  <Box>
                    <Typography component='h3'>{notice.title}</Typography>
                    <Typography component='h4'>
                      {notice.created_at}
                      {notice.new ? <Typography component='span'>new</Typography> : null}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => moveDetail(notice)}>
                    <HiChevronRight />
                  </IconButton>
                </NoticeList>
              );
            })
          : null}
      </NoticeListContainer>
      <UtilBox>
        <Stack spacing={2}>
          <Pagination color='primary' count={max} onChange={handlePageChange} />
        </Stack>
      </UtilBox>
    </NoticeLayoutBox>
  );
};

export default NoticeLayout;
