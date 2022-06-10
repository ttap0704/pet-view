import { GetServerSideProps } from 'next';
import { useEffect, useState, useContext } from 'react';

import { fetchGetApi, fetchDeleteApi, fetchFileApi, fetchPostApi } from '../../../src/utils/api';
import { getDate, setImageArray, setImageFormData } from '../../../src/utils/tools';
import { restaurant_exposure_menu } from '../../../src/utils/admin_items';

import ModalEdit from '../../../src/components/modal/ModalEdit';
import ModalUpload from '../../../src/components/modal/ModalUpload';
import ModalUpdateExposureMenu from '../../../src/components/modal/ModalUpdateExposureMenuImage';
import Table from '../../../src/components/table/Table';
import { TableContext } from '../../../src/provider/TableProvider';
import { ModalContext } from '../../../src/provider/ModalProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store';

interface UpdateExposureMenuImageContentsType {
  visible: boolean;
  origin_image_list: ImageListType[];
}

const AdminRestaurantExposureMenu = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const { data } = useContext(TableContext);
  const { modal_confirm, modal_edit, modal_alert, modal_upload, modal_image_detail } = useContext(ModalContext);

  const [firstUpdate, setFirstUpdate] = useState(false);
  const [infoContents, setInfoContents] = useState<ChildrenDataType>(restaurant_exposure_menu);
  const [updateExposureMenuImageContents, setUpdateExposureMenuImageContents] =
    useState<UpdateExposureMenuImageContentsType>({ visible: false, origin_image_list: [] });

  useEffect(() => {
    if (firstUpdate) {
      getTableItems();
    }
  }, [data.per_page]);

  useEffect(() => {
    if (user.uid > 0) {
      getTableItems();
      setFirstUpdate(true);
    }
  }, [user]);

  useEffect(() => {
    const target_idx = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);
    if (target && target_idx != null && target_idx >= 0) {
      if ([0, 1, 3].includes(target_idx)) {
        setModalEdit();
      } else if (target_idx == 2) {
        setUploadModal();
      } else if (target_idx == 4) {
        modal_confirm.openModalConfirm(`정말 [${target.label}] 메뉴를 삭제하시겠습니까?`, () =>
          deleteExposureMenu(target.restaurant_id, target.id),
        );
      }
    }
  }, [data.clicked_dropdown_idx]);

  useEffect(() => {
    if (data.clicked_row_button_idx != null && data.clicked_row_button_idx >= 0 && data.clicked_row_button_key) {
      if (data.clicked_row_button_key == 'comment') {
        modal_edit.openModalEdit(
          '설명',
          data.table_items[data.clicked_row_button_idx][data.clicked_row_button_key],
          '',
          'input',
          true,
        );
      } else if (data.clicked_row_button_key == 'image') {
        setImageDetail(data.clicked_row_button_idx);
      }
    }
  }, [data.clicked_row_button_idx, data.clicked_row_button_key]);

  const updateExposureMenuImage = async (list: ImageListType[]) => {
    const target = data.table_items.find(item => item.checked);
    if (target && list[0].file) {
      const update_data = [
        {
          target_id: Number(target.id),
          files: [list[0].file],
        },
      ];

      const exposure_menu_image_data = await setImageFormData(update_data, 'exposure_menu', target.restaurant_id);
      const delete_res = await fetchPostApi(`/images/exposure_menu/${target.id}/delete`, {});

      const update_res = await fetchFileApi('/upload/image', exposure_menu_image_data);
      if (update_res.length > 0) {
        modal_alert.openModalAlert('메뉴 이미지 수정이 완료되었습니다.');
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
      getTableItems();
      clearUpdateExposureMenuContenst();
    }
  };

  const clearUpdateExposureMenuContenst = () => {
    setUpdateExposureMenuImageContents({ visible: false, origin_image_list: [] });
  };

  const setImageDetail = async (idx: number) => {
    if (!data.table_items[idx].image) {
      modal_alert.openModalAlert('등록된 이미지가 없습니다.');
      return;
    }
    const image_list = await setImageArray([{ file_name: data.table_items[idx].image.file_name }]);
    modal_image_detail.openModalImageDetail('exposure_menu', image_list);
  };

  const deleteExposureMenu = async (restaurant_id: number, id: number) => {
    const delete_res = await fetchPostApi(
      `/admin/${user.uid}/restaurant/${restaurant_id}/exposure_menu/${id}/delete`,
      {},
    );
    if (delete_res.affected == 1) {
      modal_alert.openModalAlert('삭제가 완료되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 삭제가 실패되었습니다.');
    }
    getTableItems();
  };

  const setUploadModal = async () => {
    const target = data.table_items.find(item => item.checked);
    if (target) {
      let image_list: ImageListType[] = [];
      if (target.image) {
        image_list = await setImageArray([{ file_name: target.image.file_name }]);
      }
      setUpdateExposureMenuImageContents({ visible: true, origin_image_list: image_list });
    }
  };

  const updateExposureImages = async () => {
    const target_idx = modal_upload.data.target_idx;
    const type = modal_upload.data.type;

    if (target_idx != null && target_idx >= 0) {
      if (type == 'exposure_menu') {
        let exposure_images = [];

        const delete_res = await fetchDeleteApi(`/images/exposure_menu/${target_idx}/delete`);

        for (const item of modal_upload.data.image_list) {
          if (item.file) exposure_images.push(item.file);
        }

        const exposure_image_data = await setImageFormData(
          [{ target_id: target_idx, files: exposure_images }],
          'exposure_menu',
        );

        const upload_res = await fetchFileApi('/upload/image', exposure_image_data);

        if (upload_res.length > 0) {
          modal_alert.openModalAlert('대표 이미지 수정이 완료되었습니다.');
        } else {
          modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
        }
        getTableItems();
        modal_upload.closeModalUpload();
      }
    }
  };

  const setModalEdit = () => {
    const index = data.clicked_dropdown_idx;
    const target = data.table_items.find(item => item.checked);

    let value = '';
    let title = '';
    let target_string = '';
    let type: 'input' | 'textarea' = 'input';

    if (target) {
      switch (index) {
        case 0:
          value = target.label;
          title = '메뉴명 수정';
          target_string = 'label';
          break;
        case 1:
          value = target.price.replace(' 원', '');
          title = '가격 수정';
          target_string = 'price';
          break;
        case 3:
          value = target.comment;
          title = '설명 수정';
          target_string = 'comment';
          break;
      }

      modal_edit.openModalEdit(title, value, target_string, type);
    }
  };

  const editContents = async (value: string | number) => {
    const target = data.table_items.find(item => item.checked);
    const target_string = modal_edit.data.target;

    if (target) {
      let url = `/admin/${user.uid}/restaurant/${target.restaurant_id}/exposure_menu/${target.id}/info`;
      const cur_value = target_string == 'price' ? Number(`${value}`.replace(/[,]/gi, '')) : value;

      const update_res = await fetchPostApi(url, { [target_string]: cur_value });

      if (update_res.affected == 1) {
        modal_alert.openModalAlert('수정이 완료되었습니다.');
        getTableItems();
      } else {
        modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.');
      }
    }
  };

  const getTableItems = async () => {
    const accommodation: ExposureMenuListType = await fetchGetApi(
      `/admin/${user.uid}/restaurant/exposure_menu?page=${data.per_page}`,
    );

    const count = accommodation.count;
    const rows = accommodation.rows;

    let tmp_table_items = [];
    for (let x of rows) {
      tmp_table_items.push({
        id: x.id,
        label: x.label,
        price: Number(x.price).toLocaleString() + ' 원',
        comment: x.comment,
        restaurant_id: x.restaurant_id,
        restaurant_label: x.restaurant_label,
        image: x.exposure_menu_image,
        checked: false,
      });
    }

    setInfoContents({
      ...infoContents,
      table_items: tmp_table_items,
      rows_length: count,
    });
  };

  return (
    <>
      <Table contents={infoContents} />
      <ModalUpload onUpload={updateExposureImages} />
      <ModalEdit onChange={(value: string | number) => editContents(value)} />
      <ModalUpdateExposureMenu
        visible={updateExposureMenuImageContents.visible}
        origin={updateExposureMenuImageContents.origin_image_list}
        onCompleteChange={updateExposureMenuImage}
        onClose={clearUpdateExposureMenuContenst}
      />
    </>
  );
};

export default AdminRestaurantExposureMenu;
