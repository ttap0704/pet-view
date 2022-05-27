import { useState, createContext, useContext } from 'react';

import ModalConfirm from '../components/modal/ModalConfirm';
import ModalAlert from '../components/modal/ModalAlert';
import ModalNotice from '../components/modal/ModalNotice';
import ModalImageDetail from '../components/modal/ModalImageDetail';

// ========================================================================================
// Type 설정

interface ModalConfirmDataType {
  visible: boolean;
  title: string;
  check_callback: () => void;
  cancel_callback: () => void;
}

interface ModalAlertDataType {
  visible: boolean;
  title: string;
  center: boolean;
  timeout: ReturnType<typeof setTimeout> | undefined;
  callback: () => void;
}

interface ModalNoticeDataType {
  visible: boolean;
  title: string;
  timeout: ReturnType<typeof setTimeout> | undefined;
  callback: () => void;
}

interface ModalUploadDataType {
  visible: boolean;
  title: string;
  type: string;
  image_list: ImageListType[];
  cur_num: number;
  target_idx: number | null;
}

interface ModalEditDataType {
  visible: boolean;
  title: string;
  value: string | number;
  target: string;
  type: 'input' | 'textarea';
  format?: string;
  read_only?: boolean;
  end_adornment?: string;
}

interface ModalImageDetailDataType {
  visible: boolean;
  type: string;
  image_list: ImageListType[];
}

interface ModalControllerType {
  modal_confirm: {
    data: ModalConfirmDataType;
    closeModalConfirm: () => void;
    openModalConfirm: (title: string, check_callback: () => void, cancel_callback?: () => void) => void;
    checkModalConfirm: () => void;
    cancelModalConfirm: () => void;
  };
  modal_alert: {
    data: ModalAlertDataType;
    closeModalAlert: () => void;
    openModalAlert: (title: string, center?: boolean, callback?: () => void) => void;
  };
  modal_notice: {
    data: ModalNoticeDataType;
    closeModalNotice: () => void;
    openModalNotice: (title: string, callback: () => void) => void;
  };
  modal_upload: {
    data: ModalUploadDataType;
    closeModalUpload: () => void;
    openModalUpload: (title: string, type: string, image_list: ImageListType[], target_idx: number) => void;
    setModalUploadImageList: (image_list: ImageListType[]) => void;
    setCurNum: (number: number) => void;
  };
  modal_edit: {
    data: ModalEditDataType;
    closeModalEdit: () => void;
    openModalEdit: (
      title: string,
      value: string,
      target: string,
      type: 'input' | 'textarea',
      read_only?: boolean,
      format?: string,
      end_adornment?: string,
    ) => void;
  };
  modal_image_detail: {
    data: ModalImageDetailDataType;
    closeModalImageDetail: () => void;
    openModalImageDetail: (type: string, image_list: ImageListType[]) => void;
  };
}

// ========================================================================================
// 초기값 설정
export const ModalContext = createContext<ModalControllerType>({
  modal_confirm: {
    data: {
      visible: false,
      title: '',
      check_callback: () => {
        return;
      },
      cancel_callback: () => {
        return;
      },
    },
    closeModalConfirm: () => {
      return;
    },
    openModalConfirm: (title: string, check_callback: () => void, cancel_callback?: () => void) => {
      return;
    },
    checkModalConfirm: () => {
      return;
    },
    cancelModalConfirm: () => {
      return;
    },
  },
  modal_alert: {
    data: {
      visible: false,
      center: false,
      title: '',
      timeout: undefined,
      callback: () => {
        return;
      },
    },
    closeModalAlert: () => {
      return;
    },
    openModalAlert: (title: string, center?: boolean, callback?: () => void) => {
      return;
    },
  },
  modal_notice: {
    data: {
      visible: false,
      title: '',
      timeout: undefined,
      callback: () => {
        return;
      },
    },
    closeModalNotice: () => {
      return;
    },
    openModalNotice: (title: string, callback: () => void) => {
      return;
    },
  },
  modal_upload: {
    data: {
      visible: false,
      title: '',
      type: '',
      image_list: [],
      cur_num: 0,
      target_idx: null,
    },
    closeModalUpload: () => {
      return;
    },
    openModalUpload: (title: string, type: string, image_list: { new: boolean; src: string }[], target_idx: number) => {
      return;
    },
    setModalUploadImageList: (image_list: { new: boolean; src: string }[]) => {
      return;
    },
    setCurNum: (number: number) => {
      return;
    },
  },
  modal_edit: {
    data: {
      visible: false,
      title: '',
      target: '',
      type: 'input',
      value: '',
      format: '',
      read_only: false,
      end_adornment: '',
    },
    closeModalEdit: () => {
      return;
    },
    openModalEdit: (
      title: string,
      value: string,
      target: string,
      type: 'input' | 'textarea',
      read_only?: boolean,
      format?: string,
      end_adornment?: string,
    ) => {
      return;
    },
  },
  modal_image_detail: {
    data: { visible: false, type: '', image_list: [] },
    closeModalImageDetail: () => {
      return;
    },
    openModalImageDetail: (type: string, image_list: ImageListType[]) => {
      return;
    },
  },
});

// ========================================================================================
// Provider 설정

function ModalProvider(props: { children: React.ReactNode }) {
  const children = props.children;

  // modalController 객체 안에 넣으면
  // 실시간 렌더 x
  // useState 사용 바람

  const [modalConfirmData, setModalConfirmData] = useState<ModalConfirmDataType>({
    visible: false,
    title: '',
    check_callback: () => {
      return;
    },
    cancel_callback: () => {
      return;
    },
  });

  const [modalAlertData, setModalAlertData] = useState<ModalAlertDataType>({
    visible: false,
    center: false,
    title: '',
    timeout: undefined,
    callback: () => {
      return;
    },
  });

  const [modalNoticeData, setModalNoticeData] = useState<ModalNoticeDataType>({
    visible: false,
    title: '',
    timeout: undefined,
    callback: () => {
      return;
    },
  });

  const [modalUploadData, setModalUploadData] = useState<ModalUploadDataType>({
    visible: false,
    title: '',
    type: '',
    image_list: [],
    cur_num: 0,
    target_idx: null,
  });

  const [modalEditData, setModalEditData] = useState<ModalEditDataType>({
    visible: false,
    title: '',
    target: '',
    value: '',
    type: 'input',
    format: '',
    read_only: false,
    end_adornment: '',
  });

  const [modalImageDetailData, setModalImageDetailData] = useState<ModalImageDetailDataType>({
    visible: false,
    type: '',
    image_list: [],
  });

  // 모달 컨트롤러
  const modalController: ModalControllerType = {
    modal_confirm: {
      data: modalConfirmData,
      closeModalConfirm: () => {
        setModalConfirmData({
          visible: false,
          title: '',
          check_callback: () => {
            return;
          },
          cancel_callback: () => {
            return;
          },
        });
      },
      openModalConfirm: (title: string, check_callback: () => void, cancel_callback?: () => void) => {
        setModalConfirmData(state => {
          return {
            ...state,
            visible: true,
            title: title,
            check_callback,
            cancel_callback: cancel_callback
              ? cancel_callback
              : () => {
                  return;
                },
          };
        });
      },
      checkModalConfirm: () => {
        modalController.modal_confirm.data.check_callback();

        setModalConfirmData(state => {
          return {
            ...state,
            visible: false,
            title: '',
            callback: () => {
              return;
            },
          };
        });
      },
      cancelModalConfirm: () => {
        modalController.modal_confirm.data.cancel_callback();

        setModalConfirmData(state => {
          return {
            ...state,
            visible: false,
            title: '',
            callback: () => {
              return;
            },
          };
        });
      },
    },
    modal_alert: {
      data: modalAlertData,
      closeModalAlert: () => {
        if (modalAlertData.timeout != undefined) {
          clearTimeout(modalAlertData.timeout);
          modalAlertData.callback();
        }
        setModalAlertData({
          visible: false,
          center: false,
          title: '',
          timeout: undefined,
          callback: () => {
            return;
          },
        });
      },
      openModalAlert: (title: string, center?: boolean, callback?: () => void) => {
        setModalAlertData(state => {
          return {
            visible: true,
            title: title,
            center: center ? center : false,
            timeout: setTimeout(() => {
              modalController.modal_alert.closeModalAlert();
              if (callback) callback();
            }, 2000),
            callback: () => {
              callback ? callback() : false;
            },
          };
        });
      },
    },
    modal_notice: {
      data: modalNoticeData,
      closeModalNotice: () => {
        if (modalNoticeData.timeout != undefined) {
          clearTimeout(modalNoticeData.timeout);
          modalNoticeData.callback();
        }
        setModalNoticeData({
          visible: false,
          title: '',
          timeout: undefined,
          callback: () => {
            return;
          },
        });
      },
      openModalNotice: (title: string, callback: () => void) => {
        setModalNoticeData(state => {
          return {
            visible: true,
            title: title,
            timeout: setTimeout(() => {
              modalController.modal_notice.closeModalNotice();
              callback();
            }, 2000),
            callback: () => {
              callback ? callback() : false;
            },
          };
        });
      },
    },
    modal_upload: {
      data: modalUploadData,
      closeModalUpload: () => {
        setModalUploadData({ visible: false, title: '', type: '', image_list: [], cur_num: 0, target_idx: null });
      },
      openModalUpload: (title: string, type: string, image_list: ImageListType[], target_idx: number) => {
        setModalUploadData(state => {
          return {
            ...state,
            visible: true,
            title: title,
            type: type,
            image_list: [...image_list],
            target_idx,
          };
        });
        return;
      },
      setModalUploadImageList: (image_list: ImageListType[]) => {
        setModalUploadData(state => {
          return {
            ...state,
            image_list: [...image_list],
          };
        });
        return;
      },
      setCurNum: (number: number) => {
        setModalUploadData(state => {
          return {
            ...state,
            cur_num: number,
          };
        });
        return;
      },
    },
    modal_edit: {
      data: modalEditData,
      closeModalEdit: () => {
        setModalEditData({
          visible: false,
          title: '',
          target: '',
          value: '',
          type: 'input',
          format: '',
          end_adornment: '',
        });
      },
      openModalEdit: (
        title: string,
        value: string,
        target: string,
        type: 'input' | 'textarea',
        read_only?: boolean,
        format?: string,
        end_adornment?: string,
      ) => {
        setModalEditData(state => {
          return {
            visible: true,
            title: title,
            value: value,
            target: target,
            type: type,
            read_only: read_only ? read_only : false,
            format: format ? format : '',
            end_adornment: end_adornment ? end_adornment : '',
          };
        });
      },
    },
    modal_image_detail: {
      data: modalImageDetailData,
      closeModalImageDetail: () => {
        setModalImageDetailData({ visible: false, type: '', image_list: [] });
      },
      openModalImageDetail: (type: string, image_list: ImageListType[]) => {
        setModalImageDetailData(state => {
          return {
            ...state,
            visible: true,
            type: type,
            image_list: image_list,
          };
        });
        return;
      },
    },
  };

  return (
    <>
      <ModalContext.Provider value={modalController}>
        {children}
        <ModalConfirm />
        <ModalNotice />
        <ModalAlert />
        <ModalImageDetail />
      </ModalContext.Provider>
    </>
  );
}

export default ModalProvider;
