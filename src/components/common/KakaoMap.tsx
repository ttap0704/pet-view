import Box, { BoxProps } from '@mui/material/Box';

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20rem',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.white.main,
}));

const KakaoMap = () => {
  useEffect(() => {
    const script_tag = document.createElement('script');
    script_tag.type = 'text/javascript';
    script_tag.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}`;
    document.head.appendChild(script_tag);

    let i = 0;
    while (i < 100) {
      const { kakao } = window as any;
      if (kakao) {
        console.log(kakao);

        kakao.maps.load(() => {
          const container = document.getElementById('kakao_map');
          const options = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          new kakao.maps.Map(container, options);
        });

        i = 100;
      }
      i++;
    }

    return () => {
      document.head.removeChild(script_tag);
    };
  }, []);

  return (
    <>
      <StyledBox id='kakao_map'></StyledBox>
    </>
  );
};

export default KakaoMap;
