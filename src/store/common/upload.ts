
import {
  createAction
  , ActionType
  , createReducer
} from 'typesafe-actions';

interface UploadReducer {
  upload_files: File[],
  upload_modal_visible: Boolean,
  title: string,
  target: string,
  target_idx: undefined | number,
  multiple: Boolean,
  image_type: string,
}

interface Settings {
  visible: Boolean,
  title: string,
  target: string,
  target_idx?: number,
  multiple: Boolean,
  image_type: string,
}

interface Files {
  files: File[]
}

const initialState: UploadReducer = {
  upload_files: [],
  upload_modal_visible: false,
  title: "",
  target: "",
  target_idx: undefined,
  multiple: false,
  image_type: "",
}



export const RESET_FILES = "uploadReducer/RESET_FILES";
export const PUSH_FILES = "uploadReducer/PUSH_FILES";
export const SET_UPLOAD_MODAL_VISIBLE = "uploadReducer/SET_UPLOAD_MODAL_VISIBLE"
export const SET_UPLOAD_MODAL_TITLE = "uploadReducer/SET_UPLOAD_MODAL_TITLE"

export const resetFiles = createAction(RESET_FILES)();
export const pushFiles = createAction(PUSH_FILES)<Files>();
export const setUploadModalVisible = createAction(SET_UPLOAD_MODAL_VISIBLE)<Settings>();

export const actions = { resetFiles, pushFiles, setUploadModalVisible };
type UploadReducerActions = ActionType<typeof actions>;

const uploadReducer = createReducer<UploadReducer, UploadReducerActions>(initialState, {
  [RESET_FILES]: () => ({
    upload_files: [],
    upload_modal_visible: false,
    title: "",
    target: "",
    target_idx: undefined,
    multiple: false,
    image_type: ""
  }),
  [PUSH_FILES]: (state, action) => {
    return ({
      ...state,
      upload_files: [...action.payload.files],
    })
  },
  [SET_UPLOAD_MODAL_VISIBLE]: (state, action) => {
    console.log(action.payload)
    return ({
      ...state,
      upload_modal_visible: action.payload.visible,
      title: action.payload.title,
      target: action.payload.target,
      target_idx: action.payload.target_idx != null && !isNaN(action.payload.target_idx)
        ? action.payload.target_idx : undefined,
      multiple: action.payload.multiple,
      image_type: action.payload.image_type
    })
  },
})

export default uploadReducer;