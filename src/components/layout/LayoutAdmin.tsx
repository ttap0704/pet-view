import AdminSideMenu from '../common/AdminSideMenu';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser } from '../../store/slices/user';

const excepted_path = [
  '/admin/join',
  '/admin/login',
  '/admin/join/success',
  '/admin/join/certification/[id]',
  '/super/login',
];

interface LayoutAdminProps {
  children: React.ReactNode;
}

const LayoutAdminBox = styled(Box)(({ theme }) => ({
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

const LayoutAdmin = (props: LayoutAdminProps) => {
  const router = useRouter();
  const children = props.children;

  return (
    <LayoutAdminBox>
      {excepted_path.includes(router.pathname) ? null : <AdminSideMenu />}
      <LayoutChildrenWarp path={router.pathname}>
        <LayoutChildrenBox>{children}</LayoutChildrenBox>
      </LayoutChildrenWarp>
    </LayoutAdminBox>
  );
};

export default LayoutAdmin;
