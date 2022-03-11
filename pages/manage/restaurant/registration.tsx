import React from 'react';

import { Box } from '@mui/material';
import { useState, useContext, useEffect } from 'react';

import { ModalContext } from '../../../src/provider/ModalProvider';
import { setFileArray, setFileToImage, setImageFormData } from '../../../src/utils/tools';
import { fetchFileApi, fetchPostApi } from '../../../src/utils/api';

import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';
import ImageBox from '../../../src/components/image/ImageBox';
import Button from '../../../src/components/button/Button';
import ButtonUpload from '../../../src/components/button/ButtonUpload';
import UtilBox from '../../../src/components/common/UtilBox';
import FormPostcode from '../../../src/components/form/FormPostcode';
import FormExposureMenu from '../../../src/components/form/FormExposureMenu';
import Textarea from '../../../src/components/textarea/Textarea';
import ChevronDivder from '../../../src/components/common/ChevronDivder';
import InputOutlined from '../../../src/components/input/InputOutlined';
import ListEntireMenu from '../../../src/components/list/ListEntireMenu';

import ModalUpload from '../../../src/components/modal/ModalUpload';

const ManageRestaurantRegistration = () => {
  const { modal_upload, modal_confirm } = useContext(ModalContext);

  const [exposureImages, setExposureImages] = useState<ImageListType[]>([]);
  const [address, setAddress] = useState<FinalPostcodeDataType>({
    zonecode: '',
    sido: '',
    sigungu: '',
    bname: '',
    road_address: '',
    building_name: '',
    detail_address: '',
  });

  const [restaurantLabel, setRestaurantLabel] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [exposureMenuClickIdx, setExposureMenuClickIdx] = useState(0);
  const [exposureMenu, setExposureMenu] = useState<AddExposureMenuContentsType[]>([
    {
      label: '',
      price: '',
      comment: '',
      image_list: [],
    },
  ]);

  const [entireMenu, setEntireMenu] = useState([
    {
      category: '',
      menu: [{ label: '', price: '' }],
    },
  ]);

  const setPrevieImages = () => {
    setExposureImages([...modal_upload.data.image_list]);
    modal_upload.closeModalUpload();
  };

  const handleExposureMenuInput = (e: React.ChangeEvent<HTMLInputElement>, type: string, idx: number) => {
    const value = e.target.value;
    setExposureMenu(state => {
      return [
        ...state.map((menu, menu_idx) => {
          if (menu_idx == idx) {
            return {
              ...menu,
              [`${type}`]: value,
            };
          } else {
            return menu;
          }
        }),
      ];
    });
  };

  const addExposureMenu = () => {
    setExposureMenu([
      ...exposureMenu,
      {
        label: '',
        price: '',
        comment: '',
        image_list: [],
      },
    ]);
  };

  const addCategory = () => {
    setEntireMenu([
      ...entireMenu,
      {
        category: '',
        menu: [{ label: '', price: '' }],
      },
    ]);
  };

  const addMenu = (idx: number) => {
    console.log(idx);
    setEntireMenu(state => {
      return [
        ...state.map((item, item_idx) => {
          if (idx == item_idx) {
            return {
              ...item,
              menu: [
                ...item.menu,
                {
                  label: '',
                  price: '',
                },
              ],
            };
          } else {
            return item;
          }
        }),
      ];
    });
  };

  const deleteMenu = (idx: number, children_idx: number | undefined) => {
    const tmp_entire_menu = [...entireMenu];
    if (children_idx == undefined) {
      tmp_entire_menu.splice(idx, 1);
    } else if (children_idx != undefined) {
      tmp_entire_menu[idx].menu.splice(children_idx, 1);
    }
    setEntireMenu([...tmp_entire_menu]);
  };

  const handleEntireMenuInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    idx: number,
    children: string | undefined,
    children_idx: number | undefined,
  ) => {
    const value = e.target.value;
    const tmp_entire_menu = [
      ...entireMenu.map((item, item_idx) => {
        if (idx == item_idx) {
          if (!children && !children_idx) {
            return {
              ...item,
              category: value,
            };
          } else {
            return {
              ...item,
              menu: [
                ...item.menu.map((menu, menu_idx) => {
                  if (children_idx == menu_idx) {
                    return {
                      ...menu,
                      [`${children}`]: value,
                    };
                  } else {
                    return menu;
                  }
                }),
              ],
            };
          }
        } else {
          return item;
        }
      }),
    ];
    setEntireMenu(tmp_entire_menu);
  };

  const setExposureMenuImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp_image_list = await setFileToImage(e.target.files, [2]);
    console.log(exposureMenuClickIdx);

    setExposureMenu(state => {
      return [
        ...state.map((menu, menu_idx) => {
          if (menu_idx == exposureMenuClickIdx) {
            return {
              ...menu,
              image_list: tmp_image_list,
            };
          } else {
            return menu;
          }
        }),
      ];
    });
  };

  const createAccommodation = async () => {
    // const rooms_data = [
    //   ...rooms.map((room, room_idx) => {
    //     return {
    //       label: room.label,
    //       price: room.price,
    //       standard_num: room.standard_num,
    //       maximum_num: room.maximum_num,
    //       seq: room_idx,
    //     };
    //   }),
    // ];

    const accom_data = {
      ...address,
      label: restaurantLabel,
      introduction,
      manager: 1,
      // rooms: [...rooms_data],
    };
    const accommodation: CreateAccommodationResponse = await fetchPostApi(`/manager/1/accommodation`, accom_data);
    const accommodation_id = accommodation.accommodation_id;

    let exposure_images = [];
    for (const item of exposureImages) {
      if (item.file) exposure_images.push(item.file);
    }

    // let rooms_payload = [];
    // for (const room of rooms) {
    //   const res_room = accommodation.rooms.find(room_item => room_item.label == room.label);
    //   let room_images = [];
    //   for (const room_item of room.image_list) {
    //     if (room_item.file) room_images.push(room_item.file);
    //   }
    //   if (res_room) {
    //     rooms_payload.push({ target_id: res_room.id, files: room_images });
    //   }
    // }

    const exposure_image_data = await setImageFormData(
      [{ target_id: accommodation_id, files: exposure_images }],
      'accommodation',
    );
    // const rooms_image_data = await setImageFormData(rooms_payload, 'rooms', accommodation_id);

    // const upload_exposure_response = await fetchFileApi('/upload/image', exposure_image_data);
    // const upload_rooms_response = await fetchFileApi('/upload/image', rooms_image_data);
  };

  return (
    <>
      <ContainerRegistrationItem title='대표이미지 등록'>
        <ImageBox slide={true} type='restaurant' imageList={exposureImages} />
        <UtilBox justifyContent='flex-start' sx={{ marginTop: '1rem' }}>
          <ButtonUpload
            title='대표이미지 등록'
            onClick={() => modal_upload.openModalUpload('대표 이미지 업로드', 'restaurant', exposureImages, 0)}
          />
        </UtilBox>
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='음식점 이름'>
        <InputOutlined
          placeholder='음식점명을 작성해주세요..'
          value={restaurantLabel}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRestaurantLabel(e.target.value)}
        />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='주소 등록'>
        <FormPostcode
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddress({ ...address, detail_address: e.target.value })
          }
          onChangeAddress={data => setAddress({ ...address, ...data })}
          address={address}
        />
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='음식점 소개'>
        <Textarea
          placeholder='음식점에 대해 자유롭게 작성해주세요.'
          value={introduction}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIntroduction(e.target.value)}
        />
      </ContainerRegistrationItem>
      <ChevronDivder />
      <ContainerRegistrationItem title='대표메뉴 등록'>
        {exposureMenu.map((menu, menu_idx) => {
          return (
            <FormExposureMenu
              onInputClick={() => setExposureMenuClickIdx(menu_idx)}
              onChangeImage={(e: React.ChangeEvent<HTMLInputElement>) => setExposureMenuImage(e)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>, type: string) =>
                handleExposureMenuInput(e, type, menu_idx)
              }
              key={`add_menu_form_${menu_idx}`}
              imageList={menu.image_list}
            />
          );
        })}
        <UtilBox justifyContent='flex-end' sx={{ marginTop: '1rem' }}>
          <Button color='blue' variant='contained' onClick={addExposureMenu}>
            대표메뉴 추가
          </Button>
        </UtilBox>
      </ContainerRegistrationItem>
      <ContainerRegistrationItem title='전체메뉴 등록'>
        <ListEntireMenu
          entireMenu={entireMenu}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
            type: string,
            idx: number,
            children_type?: string,
            children_idx?: number,
          ) => handleEntireMenuInput(e, type, idx, children_type, children_idx)}
          onAddMenu={addMenu}
          onDeleteMenu={deleteMenu}
        />
        <UtilBox justifyContent='flex-end' sx={{ marginTop: '1rem' }}>
          <Button color='blue' onClick={addCategory}>
            카테고리 추가
          </Button>
        </UtilBox>
      </ContainerRegistrationItem>

      <ModalUpload onUpload={setPrevieImages} />
    </>
  );
};

export default ManageRestaurantRegistration;
