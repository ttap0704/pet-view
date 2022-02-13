import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const MenuBox = styled(Box)(({ theme }) => ({
  width: '15vw',
  height: '100vh'
}));

const ManageSideMenu = () => {
  return <MenuBox>ManageSideMenu</MenuBox>;
};

export default ManageSideMenu;
