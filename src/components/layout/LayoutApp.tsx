import AppHeader from '../common/AppHeader';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface LayoutAppProps {
  children: React.ReactNode;
}

const WrapBox = styled(Box)(({ theme }) => ({
  width: '62rem',
  padding: '1rem 1rem 0',
  margin: '0 auto',
}));

const LayoutApp = (props: LayoutAppProps) => {
  const children = props.children;
  return (
    <>
      <AppHeader />
      <WrapBox sx={{ flexGrow: 1 }}>{children}</WrapBox>
    </>
  );
};

export default LayoutApp;
