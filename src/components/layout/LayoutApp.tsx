import AppHeader from '../common/AppHeader';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface LayoutAppProps {
  children: React.ReactNode;
}

const ChildrenBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '62rem',
  padding: '1rem 1rem 0',
  margin: '0 auto',
  height: 'auto',
}));

const LayoutApp = (props: LayoutAppProps) => {
  const children = props.children;
  return (
    <>
      <AppHeader />
      <ChildrenBox>{children}</ChildrenBox>
    </>
  );
};

export default LayoutApp;
