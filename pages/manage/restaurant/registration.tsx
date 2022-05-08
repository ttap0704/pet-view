import React from 'react';

import { Box } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

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
import FormServiceInfo from '../../../src/components/form/FormServiceInfo';
import Textarea from '../../../src/components/textarea/Textarea';
import ChevronDivder from '../../../src/components/common/ChevronDivder';
import InputOutlined from '../../../src/components/input/InputOutlined';
import ListEntireMenu from '../../../src/components/list/ListEntireMenu';

import ModalUpload from '../../../src/components/modal/ModalUpload';

import validation from '../../../src/utils/validation';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';

const ManageRestaurantRegistration = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const router = useRouter();
  const { modal_upload, modal_confirm, modal_alert, modal_notice } = useContext(ModalContext);

  const [serviceInfo, setServiceInfo] = useState<ServiceInfoType>({
    contact: '',
    site: '',
    kakao_chat: '',
    open: '',
    close: '',
    last_order: '',
  });
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

  const setPreviewImages = () => {
    setExposureImages([...modal_upload.data.image_list]);
    modal_upload.closeModalUpload();
  };

  const handleExposureMenuInput = (e: React.ChangeEvent<HTMLInputElement>, type: string, idx: number) => {
    const cur_value = e.target.value.replace(/[\,]/gi, '');
    const value = cur_value;
    console.log(value);
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

  const addEntireMenu = (idx: number) => {
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

  const deleteEntireMenu = (idx: number, children_idx: number | undefined) => {
    const tmp_entire_menu = [...entireMenu];
    if (children_idx == undefined) {
      tmp_entire_menu.splice(idx, 1);
    } else if (children_idx != undefined) {
      tmp_entire_menu[idx].menu.splice(children_idx, 1);
    }
    setEntireMenu([...tmp_entire_menu]);
  };

  const deleteExposureMemu = (idx: number) => {
    const tmp_exposure_menu = [...exposureMenu];
    tmp_exposure_menu.splice(idx, 1);
    setExposureMenu([...tmp_exposure_menu]);
  };

  const updateInfo = (key: ServiceContents, value: string) => {
    const tmp_info = { ...serviceInfo };
    tmp_info[key] = value;
    setServiceInfo({ ...tmp_info });
  };

  const handleEntireMenuInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
    idx: number,
    children: string | undefined,
    children_idx: number | undefined,
  ) => {
    const cur_value = e.target.value.replace(/[\,]/gi, '');
    const value = cur_value;
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

  const validateCreateData = () => {
    let alert_message = '';

    const entire_menu_vali = validation.entire_menu(entireMenu);
    if (!entire_menu_vali.pass) {
      alert_message = entire_menu_vali.message;
    }
    const exposure_menu_vali = validation.exposure_menu(exposureMenu);
    if (!exposure_menu_vali.pass) {
      alert_message = exposure_menu_vali.message;
    }
    const introduction_vali = validation.label(introduction);
    if (!introduction_vali) {
      alert_message = '1자 이상의 음식점 소개를 입력해주세요.';
    }
    const address_vali = validation.address(address);
    if (!address_vali) {
      alert_message = '올바른 주소를 등록해주세요.';
    }
    const service_info_vali = validation.restaurant_time(serviceInfo);
    if (!service_info_vali) {
      alert_message = '[ 오픈 시간, 마감 시간, 마지막 주문 시간]은\r\n필수 입력사항입니다.';
    }
    let service_info_time_vali = true;
    for (const [key, val] of Object.entries(serviceInfo)) {
      if (['open', 'close', 'last_order'].includes(key)) {
        const service_time_vali = validation.time(val);

        if (!service_time_vali) {
          service_info_time_vali = false;
          break;
        }
      }
    }
    if (!service_info_time_vali) {
      alert_message = '[ 오픈 시간, 마감 시간, 마지막 주문 시간]은\r\n[ HH:MM ]형식으로 입력해주세요.';
    }
    const service_info_concact_vali = validation.number(serviceInfo.contact);
    if (!service_info_concact_vali && serviceInfo.contact.length > 0) {
      alert_message = '문의 전화번호는 숫자로만 입력해주세요.';
    }
    const title_vali = validation.label(restaurantLabel);
    if (!title_vali) {
      alert_message = '음식점 이름을 입력해주세요.';
    }
    const exposure_image_vali = validation.image_list(exposureImages);
    if (!exposure_image_vali) {
      alert_message = '1개 이상의 대표이미지를 등록해주세요.';
    }

    return { pass: alert_message.length == 0, message: alert_message };
  };

  const createRestaurant = async () => {
    const validate = validateCreateData();
    if (!validate.pass) {
      modal_alert.openModalAlert(validate.message, true);
      return;
    }

    const tmp_exposure_menu = exposureMenu.map((menu, menu_idx) => {
      return {
        label: menu.label,
        price: Number(menu.price),
        comment: menu.comment,
        seq: menu_idx,
      };
    });

    const tmp_entire_menu = entireMenu.map((category, category_idx) => {
      return {
        category: category.category,
        seq: category_idx,
        menu: [
          ...category.menu.map((menu, menu_idx) => {
            return {
              label: menu.label,
              price: Number(menu.price),
              seq: menu_idx,
            };
          }),
        ],
      };
    });

    const tmp_address: { [key: string]: string | null } = {};
    for (const [key, val] of Object.entries(address)) {
      tmp_address[key] = val.length > 0 ? val : null;
    }

    const tmp_service_info: { [key: string]: string | null } = {};
    for (const [key, val] of Object.entries(serviceInfo)) {
      tmp_service_info[key] = val.length > 0 ? val : null;
    }

    const restaurant_data = {
      ...tmp_address,
      ...tmp_service_info,
      label: restaurantLabel,
      introduction,
      manager: 1,
      exposureMenu: tmp_exposure_menu,
      entireMenu: tmp_entire_menu,
    };
    const restaurant: RestaurantType = await fetchPostApi(`/manager/${user.uid}/restaurant`, restaurant_data);
    const restaurant_id = restaurant.restaurant_id;

    let exposure_images = [];
    for (const item of exposureImages) {
      if (item.file) exposure_images.push(item.file);
    }

    const exposure_menu_images_payload = [];
    for (const menu of exposureMenu) {
      const res_menu = restaurant.exposure_menu.find(item => item.label == menu.label);
      let menu_images = [];
      if (menu.image_list && menu.image_list.length > 0 && menu.image_list[0].file)
        menu_images.push(menu.image_list[0].file);

      if (res_menu) {
        exposure_menu_images_payload.push({ target_id: res_menu.id, files: menu_images });
      }
    }

    const exposure_image_data = await setImageFormData(
      [{ target_id: restaurant_id, files: exposure_images }],
      'restaurant',
    );
    const exposure_menu_image_data = await setImageFormData(
      exposure_menu_images_payload,
      'exposure_menu',
      restaurant_id,
    );

    const upload_exposure_response = await fetchFileApi('/upload/image', exposure_image_data);
    const upload_exposure_menu_response = await fetchFileApi('/upload/image', exposure_menu_image_data);

    if (upload_exposure_response.length > 0 && upload_exposure_menu_response.length > 0) {
      modal_notice.openModalNotice('음식점이 성공적으로 등록되었습니다.\r\n관리 페이지로 이동합니다.', () => {
        router.push(`/manage/restaurant/info`);
      });
    }
  };

  return (
    <>
      <ContainerRegistrationItem title='대표이미지 등록'>
        <ImageBox slide={true} type='restaurant' imageList={exposureImages} count={true} />
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            console.log(e);
            setRestaurantLabel(e.target.value);
          }}
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
      <ContainerRegistrationItem title='음식점 추가 정보'>
        <FormServiceInfo data={serviceInfo} onChangeInfo={updateInfo} type='retaurant' />
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
              onDelete={() => deleteExposureMemu(menu_idx)}
              menuIdx={menu_idx}
              contents={menu}
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
          onAddMenu={addEntireMenu}
          onDeleteMenu={deleteEntireMenu}
          mode='add'
          type='category'
        />
        <UtilBox justifyContent='flex-end' sx={{ marginTop: '1rem' }}>
          <Button color='blue' variant='contained' onClick={addCategory}>
            카테고리 추가
          </Button>
        </UtilBox>
      </ContainerRegistrationItem>
      <UtilBox>
        <Button
          color='orange'
          variant='contained'
          onClick={() => modal_confirm.openModalConfirm(`음식점을 등록하시겠습니까?`, createRestaurant)}
        >
          음식점 등록
        </Button>
      </UtilBox>

      <ModalUpload onUpload={setPreviewImages} />
    </>
  );
};

export default ManageRestaurantRegistration;
