import AppHeader from '../common/AppHeader';
import MobileBottomNavigation from '../common/MobileBottomNavigation';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LoadingDot from '../common/LoadingDot';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { GetServerSidePropsContext } from 'next';

interface LayoutAppProps {
  children: React.ReactNode;
}

const ChildrenBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '62rem',
  padding: '1rem 1rem 3rem',
  margin: '0 auto',
  height: 'auto',
  position: 'relative',

  '&.mobile': {
    padding: '1rem 1rem 5rem',
  },
}));

const LayoutApp = (props: LayoutAppProps) => {
  const user = useSelector((state: RootState) => state.userReducer);
  const router = useRouter();
  const children = props.children;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    router.events.on('routeChangeStart', () => {
      setLoading(true);
    });
    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    console.log(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <AppHeader />
      <ChildrenBox className={user.is_mobile ? 'mobile' : 'pc'}>{children}</ChildrenBox>
      {user.is_mobile ? <MobileBottomNavigation /> : null}
      {loading ? <LoadingDot /> : null}
    </>
  );
};

export default LayoutApp;
