import Box, { BoxProps } from '@mui/material/Box';

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { fetchGetApi } from '../../../src/utils/api';
import Link from 'next/link';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20rem',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.white.main,
}));

const MapCategory = styled('ul')(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: 3,
  borderRadius: '5px',
  border: '1px solid #909090',
  boxShadow: '0 1px 1px rgba(0, 0, 0, 0.4)',
  background: '#fff',
  overflow: 'hidden',

  li: {
    float: 'left',
    width: '50px',
    borderRight: '1px solid #acacac',
    padding: '6px 0',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '0.9rem',

    '&.on': {
      background: '#eee',

      '.category_bg': {
        backgroundPositionX: '-43px',
      },
    },

    '&:hover': {
      backgroundColor: '#ffe6e6',
    },

    '&:last-child': {
      marginRight: 0,
      borderRight: 0,
    },

    '.category_bg': {
      display: 'block',
      margin: '0 auto',
      width: '27px',
      height: '28px',
      background: 'url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png) no-repeat',
      backgroundPositionX: '-6.5px',
      '&.bank': {
        backgroundPositionY: 0,
      },
      '&.mart': {
        backgroundPositionY: '-36px',
      },
      '&.pharmacy': {
        backgroundPositionY: '-72px',
      },
      '&.oil': {
        backgroundPositionY: '-108px',
      },
      '&.cafe': {
        backgroundPositionY: '-144px',
      },
      '&.store': {
        backgroundPositionY: '-180px',
      },
    },
  },
}));

const KakaoMap = (props: { address: string; label: string }) => {
  const address = props.address;
  const label = props.label;

  const [markContents, setMarkContents] = useState({
    x: 0,
    y: 0,
  });
  const [mapCategoryContents, setMapCategoryContents] = useState([
    {
      label: '은행',
      id: 'BK9',
      key: 'banl',
      clicked: false,
    },
    {
      label: '마트',
      id: 'MT1',
      key: 'mart',
      clicked: false,
    },
    {
      label: '약국',
      id: 'PM9',
      key: 'pharmacy',
      clicked: false,
    },
    {
      label: '주유소',
      id: 'OL7',
      key: 'oil',
      clicked: false,
    },
    {
      label: '카페',
      id: 'CE7',
      key: 'cafe',
      clicked: false,
    },
    {
      label: '편의점',
      id: 'CS2',
      key: 'store',
      clicked: false,
    },
  ]);

  useEffect(() => {
    if (address.length > 0) {
      setKakaoMap();
    }
  }, [address]);

  const setKakaoMap = async () => {
    const { kakao } = window as any;
    if (kakao) {
      kakao.maps.load(() => {
        let placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
          contentNode = document.createElement('div'),
          markers: any[] = [],
          currCategory = '';

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result: any, status: any) {
          const result_x = Number(result[0].x);
          const result_y = Number(result[0].y);

          const container = document.getElementById('kakao_map');
          const options = {
            center: new kakao.maps.LatLng(result_y, result_x),
            level: 5,
          };
          const map = new kakao.maps.Map(container, options);

          contentNode.className = 'placeinfo_wrap';

          addEventHandle(contentNode, 'mousedown', () => {
            kakao.maps.event.preventMap;
          });
          addEventHandle(contentNode, 'touchstart', () => {
            kakao.maps.event.preventMap;
          });

          placeOverlay.setContent(contentNode);

          function addEventHandle(target: any, type: any, callback: any) {
            if (target.addEventListener) {
              target.addEventListener(type, callback);
            } else {
              target.attachEvent('on' + type, callback);
            }
          }

          const markerPosition = new kakao.maps.LatLng(result_y, result_x);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
          setMarkContents({
            x: result_x,
            y: result_y,
          });

          kakao.maps.event.addListener(marker, 'click', function () {
            const mark = document.getElementById('kakao_mark');
            if (mark) {
              mark.click();
            }
          });

          function removeMarker() {
            for (let i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
            }
            markers = [];
          }
        });
      });
    }
  };

  return (
    <>
      <StyledBox id='kakao_map'>
        <Link href={`https://map.kakao.com/link/map/${label},${markContents.y},${markContents.x}`} passHref={true}>
          <a target='_blank' id='kakao_mark' style={{ display: 'none' }}>
            TO LINK
          </a>
        </Link>
        <div id='map' style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>
      </StyledBox>
    </>
  );
};

export default KakaoMap;
