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

const MapWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
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

    '&.on': {
      background: '#eee',

      '.category_bg': {
        backgroundPositionX: '-46px',
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
    {
      label: '은행',
      id: 'BK9',
      key: 'bank',
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
        var placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 }),
          contentNode = document.createElement('div'),
          markers: any[] = [],
          currCategory = '';

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result: any, status: any) {
          const result_x = Number(result[0].x);
          const result_y = Number(result[0].y);
          console.log(result);

          const container = document.getElementById('kakao_map');
          const options = {
            center: new kakao.maps.LatLng(result_y, result_x),
            level: 4,
          };
          const map = new kakao.maps.Map(container, options);
          const ps = new kakao.maps.services.Places(map);

          kakao.maps.event.addListener(map, 'idle', searchPlaces);
          contentNode.className = 'placeinfo_wrap';

          addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
          addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

          placeOverlay.setContent(contentNode);

          addCategoryClickEvent();

          // 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
          function addEventHandle(target: any, type: any, callback: any) {
            if (target.addEventListener) {
              target.addEventListener(type, callback);
            } else {
              target.attachEvent('on' + type, callback);
            }
          }

          function addCategoryClickEvent() {
            var category: any = document.getElementById('category'),
              children: any = category?.children;

            if (children) {
              for (var i = 0; i < children.length; i++) {
                children[i].onclick = onClickCategory(children[i]);
              }
            }
          }

          function onClickCategory(el: Element) {
            var id = el.id,
              className = el.className;

            placeOverlay.setMap(null);

            if (className === 'on') {
              currCategory = '';
              changeCategoryClass();
              removeMarker();
            } else {
              currCategory = id;
              changeCategoryClass(el);
              searchPlaces();
            }
          }

          function changeCategoryClass(el?: Element) {
            var category: any = document.getElementById('category'),
              children = category.children,
              i;

            for (i = 0; i < children.length; i++) {
              children[i].className = '';
            }

            if (el) {
              el.className = 'on';
            }
          }

          const markerPosition = new kakao.maps.LatLng(result_y, result_x);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          kakao.maps.event.addListener(marker, 'click', function () {
            window.open(`https://map.kakao.com/link/map/${label},${result_y},${result_x}`, '_blank');
          });

          function searchPlaces() {
            if (!currCategory) {
              return;
            }

            placeOverlay.setMap(null);

            removeMarker();

            ps.categorySearch(currCategory, placesSearchCB, { useMapBounds: true });
          }

          function removeMarker() {
            for (var i = 0; i < markers.length; i++) {
              markers[i].setMap(null);
            }
            markers = [];
          }

          function placesSearchCB(data: any, status: any, pagination: any) {
            if (status === kakao.maps.services.Status.OK) {
              displayPlaces(data);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
              // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
            } else if (status === kakao.maps.services.Status.ERROR) {
              // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
            }
          }

          function displayPlaces(places: any) {
            var order = document.getElementById(currCategory)?.getAttribute('data-order');

            for (var i = 0; i < places.length; i++) {
              var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

              (function (marker, place) {
                kakao.maps.event.addListener(marker, 'click', function () {
                  displayPlaceInfo(place);
                });
              })(marker, places[i]);
            }
          }

          function addMarker(position: any, order: any) {
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
              imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
              imgOptions = {
                spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
                spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                offset: new kakao.maps.Point(11, 28), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
              },
              markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
              marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage,
              });

            marker.setMap(map); // 지도 위에 마커를 표출합니다
            markers.push(marker); // 배열에 생성된 마커를 추가합니다

            return marker;
          }

          function displayPlaceInfo(place: any) {
            var content =
              '<div class="placeinfo">' +
              '   <a class="title" href="' +
              place.place_url +
              '" target="_blank" title="' +
              place.place_name +
              '">' +
              place.place_name +
              '</a>';

            if (place.road_address_name) {
              content +=
                '    <span title="' +
                place.road_address_name +
                '">' +
                place.road_address_name +
                '</span>' +
                '  <span class="jibun" title="' +
                place.address_name +
                '">(지번 : ' +
                place.address_name +
                ')</span>';
            } else {
              content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
            }

            content += '    <span class="tel">' + place.phone + '</span>' + '</div>' + '<div class="after"></div>';

            contentNode.innerHTML = content;
            placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
            placeOverlay.setMap(map);
          }
        });
      });
    }
  };

  const handleCategory = (idx: number) => {
    const tmp_contents = [...mapCategoryContents];
    tmp_contents.map((item, item_idx) => {
      if (item_idx == idx) {
        return {
          ...item,
          clicked: true,
        };
      } else {
        return {
          ...item,
          clicked: false,
        };
      }
    });
    setMapCategoryContents([...tmp_contents]);
  };

  return (
    <>
      <StyledBox id='kakao_map'>
        <div id='map' style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}></div>
        <MapCategory id='category'>
          {mapCategoryContents.map((content, content_idx) => {
            return (
              <li
                id={content.id}
                key={`category_${content_idx}`}
                onClick={() => handleCategory(content_idx)}
                data-order={`${content_idx}`}
              >
                <span className={`category_bg ${content.key}`}></span>
                {content.label}
              </li>
            );
          })}
        </MapCategory>
      </StyledBox>
    </>
  );
};

export default KakaoMap;
