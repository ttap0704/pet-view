import Box, { BoxProps } from '@mui/material/Box';

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { fetchGetApi } from '../../../src/utils/api';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20rem',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.white.main,
}));

const KakaoMap = (props: { address: string; label: string }) => {
  const address = props.address;
  const label = props.label;

  const [kakaoContents, setKakaoContents] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (address.length > 0) {
      setKakaoMap();
    }
  }, [address]);

  const setKakaoMap = async () => {
    const { kakao } = window as any;
    if (kakao) {
      kakao.maps.load(() => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result: any, status: any) {
          const result_x = Number(result[0].x);
          const result_y = Number(result[0].y);
          console.log(result);

          setKakaoContents({
            x: result_x,
            y: result_y,
          });

          const container = document.getElementById('kakao_map');
          const options = {
            center: new kakao.maps.LatLng(result_y, result_x),
            level: 3,
          };
          const map = new kakao.maps.Map(container, options);
          const markerPosition = new kakao.maps.LatLng(result_y, result_x);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          kakao.maps.event.addListener(marker, 'click', function () {
            window.open(`https://map.kakao.com/link/map/${label},${kakaoContents.y},${kakaoContents.x}`, '_blank');
          });
        });
      });
    }
  };

  return (
    <>
      <StyledBox id='kakao_map'></StyledBox>
    </>
  );
};

export default KakaoMap;
