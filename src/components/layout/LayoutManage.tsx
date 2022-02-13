import ManageSideMenu from '../common/ManageSideMenu';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const LayoutManageBox = styled(Box)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
}));

interface LayoutManageProps {
  children: React.ReactNode;
}

const LayoutManage = (props: LayoutManageProps) => {
  const children = props.children;
  return (
    <LayoutManageBox>
      <ManageSideMenu />
      {children}
    </LayoutManageBox>
  );
};

export default LayoutManage;
