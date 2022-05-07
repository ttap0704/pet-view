import ManageSideMenu from '../common/ManageSideMenu';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/user';

const excepted_path = ['/manage/join', '/manage/login'];

interface LayoutManageProps {
  children: React.ReactNode;
}

const LayoutManageBox = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
}));

interface WarpProps {
  path: string;
}
const LayoutChildrenWarp = styled(Box)<WarpProps>(props => {
  let width = '';

  if (excepted_path.includes(props.path)) {
    width = '100vw';
  } else {
    width = '80vw';
  }
  return {
    width,
    height: '100vh',
    padding: '2rem 2rem 5rem',
    overflowY: 'auto',
  };
});

const LayoutChildrenBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '70rem',
  margin: '0 auto',
}));

const LayoutManage = (props: LayoutManageProps) => {
  const user = useSelector((state: RootState) => state.userReducer);
  const router = useRouter();
  const dispatch = useDispatch();

  const children = props.children;

  useEffect(() => {
    if (!excepted_path.includes(router.pathname) && !user.uid) {
      const user = sessionStorage.getItem('user');
      if (user) {
        const session: UserType = JSON.parse(user);
        dispatch(setUser(session));
      } else {
        router.push('/manage/login');
      }
    }
  }, []);

  return (
    <LayoutManageBox>
      {excepted_path.includes(router.pathname) ? null : <ManageSideMenu />}
      <LayoutChildrenWarp path={router.pathname}>
        <LayoutChildrenBox>{children}</LayoutChildrenBox>
      </LayoutChildrenWarp>
    </LayoutManageBox>
  );
};

export default LayoutManage;
