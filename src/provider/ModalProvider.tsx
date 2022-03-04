import { useState, createContext, useContext } from 'react';

import ModalConfirm from '../components/modal/ModalConfirm';
import ModalAlert from '../components/modal/ModalAlert';
import ModalNotice from '../components/modal/ModalNotice';

// ========================================================================================
// Type 설정

interface ModalConfirmDataType {
  visible: boolean;
  title: string;
  callback: () => void;
}

interface ModalAlertDataType {
  visible: boolean;
  title: string;
  timeout: ReturnType<typeof setTimeout> | undefined;
}

interface ModalNoticeDataType {
  visible: boolean;
  title: string;
  timeout: ReturnType<typeof setTimeout> | undefined;
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
}

interface ModalControllerType {
  modal_confirm: {
    data: ModalConfirmDataType;
    closeModalConfirm: () => void;
    openModalConfirm: (title: string, callback: () => void) => void;
    checkModalConfirm: () => void;
  };
  modal_alert: {
    data: ModalAlertDataType;
    closeModalAlert: () => void;
    openModalAlert: (title: string) => void;
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
    ) => void;
  };
}

// ========================================================================================
// 초기값 설정
export const ModalContext = createContext<ModalControllerType>({
  modal_confirm: {
    data: {
      visible: false,
      title: '',
      callback: () => {
        return;
      },
    },
    closeModalConfirm: () => {
      return;
    },
    openModalConfirm: (title: string, callback: () => void) => {
      return;
    },
    checkModalConfirm: () => {
      return;
    },
  },
  modal_alert: {
    data: {
      visible: false,
      title: '',
      timeout: undefined,
    },
    closeModalAlert: () => {
      return;
    },
    openModalAlert: (title: string) => {
      return;
    },
  },
  modal_notice: {
    data: {
      visible: false,
      title: '',
      timeout: undefined,
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
    ) => {
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
    callback: () => {
      return;
    },
  });

  const [modalAlertData, setModalAlertData] = useState<ModalAlertDataType>({
    visible: false,
    title: '',
    timeout: undefined,
  });

  const [modalNoticeData, setModalNoticeData] = useState<ModalNoticeDataType>({
    visible: false,
    title: '',
    timeout: undefined,
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
  });

  // 모달 컨트롤러
  const modalController: ModalControllerType = {
    modal_confirm: {
      data: modalConfirmData,
      closeModalConfirm: () => {
        setModalConfirmData({
          visible: false,
          title: '',
          callback: () => {
            return;
          },
        });
      },
      openModalConfirm: (title: string, callback: () => void) => {
        setModalConfirmData(state => {
          return {
            ...state,
            visible: true,
            title: title,
            callback,
          };
        });
      },
      checkModalConfirm: () => {
        modalController.modal_confirm.data.callback();

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
        setModalAlertData({ visible: false, title: '', timeout: undefined });
        if (modalAlertData.timeout != undefined) {
          clearTimeout(modalAlertData.timeout);
        }
      },
      openModalAlert: (title: string) => {
        setModalAlertData(state => {
          return {
            visible: true,
            title: title,
            timeout: setTimeout(() => {
              modalController.modal_alert.closeModalAlert();
            }, 2000),
          };
        });
      },
    },
    modal_notice: {
      data: modalNoticeData,
      closeModalNotice: () => {
        setModalNoticeData({ visible: false, title: '', timeout: undefined });
        if (modalNoticeData.timeout != undefined) {
          clearTimeout(modalNoticeData.timeout);
        }
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
        });
      },
      openModalEdit: (
        title: string,
        value: string,
        target: string,
        type: 'input' | 'textarea',
        read_only?: boolean,
        format?: string,
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
          };
        });
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
      </ModalContext.Provider>
    </>
  );
}

export default ModalProvider;
