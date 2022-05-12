import { Box, styled } from '@mui/material';

const HomeContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
}));

const HomeContents = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  padding: '1rem 0',
}));
const HomeTitle = styled('h2')(({ theme }) => ({}));

const Home = () => {
  return (
    <HomeContainer>
      <HomeContents>
        <HomeTitle>여기는 소개, 이거는 지워야됨</HomeTitle>
      </HomeContents>
      <HomeContents>
        <HomeTitle>오늘의 숙박업소</HomeTitle>
      </HomeContents>
      <HomeContents>
        <HomeTitle>오늘의 음식점</HomeTitle>
      </HomeContents>
    </HomeContainer>
  );
};

export default Home;
