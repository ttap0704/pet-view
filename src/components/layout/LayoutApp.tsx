import AppHeader from '../common/AppHeader';
import MobileBottomNavigation from '../common/MobileBottomNavigation';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

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
}));

const LayoutApp = (props: LayoutAppProps) => {
  const children = props.children;
  return (
    <>
      <AppHeader />
      <ChildrenBox>{children}</ChildrenBox>
      <MobileBottomNavigation />
    </>
  );
};

export default LayoutApp;
