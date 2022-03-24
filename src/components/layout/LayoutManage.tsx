import ManageSideMenu from '../common/ManageSideMenu';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface LayoutManageProps {
  children: React.ReactNode;
}

const LayoutManageBox = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
}));

const LayoutChildrenWarp = styled(Box)(({ theme }) => ({
  width: '80vw',
  height: '100vh',
  padding: '2rem 2rem 5rem',
  overflowY: 'auto',
}));

const LayoutChildrenBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '70rem',
  height: '100%',
  margin: '0 auto',
}));

const LayoutManage = (props: LayoutManageProps) => {
  const children = props.children;
  return (
    <LayoutManageBox>
      <ManageSideMenu />
      <LayoutChildrenWarp>
        <LayoutChildrenBox>{children}</LayoutChildrenBox>
      </LayoutChildrenWarp>
      Î
    </LayoutManageBox>
  );
};

export default LayoutManage;
