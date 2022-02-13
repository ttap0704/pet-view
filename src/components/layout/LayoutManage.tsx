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

const LayoutChildrenBox = styled(Box)(({ theme }) => ({
  width: '85vw',
  height: '100vh',
}));

const LayoutManage = (props: LayoutManageProps) => {
  const children = props.children;
  return (
    <LayoutManageBox>
      <ManageSideMenu />
      <LayoutChildrenBox>{children}</LayoutChildrenBox>
    </LayoutManageBox>
  );
};

export default LayoutManage;
