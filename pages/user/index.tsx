import { Box, FormHelperText, styled, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../src/components/button/Button';
import { RootState } from '../../src/store';
import { MdPets } from 'react-icons/md';
import { fetchFileApi, fetchPostApi } from '../../src/utils/api';
import { ModalContext } from '../../src/provider/ModalProvider';
import { setUserNickname, setUserProfilePath } from '../../src/store/slices/user';
import ButtonFileInput from '../../src/components/button/ButtonFileInput';
import { readFile, setImageFormData } from '../../src/utils/tools';
import { fetchGetApi } from '../../src/utils/api_back';
import LoadingDot from '../../src/components/common/LoadingDot';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

const UserWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',

  [theme.breakpoints.up('lg')]: {
    maxWidth: '350px',
  },
  [theme.breakpoints.between('md', 'lg')]: {
    maxWidth: '325px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '275px',
  },
}));

const ProfileBox = styled(Box)(({ theme }) => ({
  width: '7rem',
  height: '7rem',
  borderRadius: '50%',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  display: 'flex',
  alignItems: 'flex-end',
  overflow: 'hidden',
  cursor: 'pointer',
  marginBottom: '2rem',
  position: 'relative',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',

  svg: {
    position: 'absolute',
    left: '50%',
    top: 'calc(50% - 1rem)',
    transform: 'translate(-50%, -50%)',
    width: '3rem',
    height: '3rem',
    color: theme.palette.gray_4.main,
  },

  '& > div': {
    width: '100%',
    height: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.white.main,
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  marginBottom: '2rem',
}));

const UserTextField = styled(TextField)(({ theme }) => ({
  '.MuiInputBase-input': {
    padding: '1.5rem 0 1.5rem 0.5rem',

    '&:read-only': {
      backgroundColor: theme.palette.gray_6.main,
      color: theme.palette.gray_3.main,
    },
  },
  '.MuiInputBase-fullWidth': {
    borderColor: theme.palette.gray_4.main,
  },
  '.Mui-focused': {
    '&:hover': {
      '&::before': { borderWidth: '1px' },
    },
    '&::after': { borderWidth: '1px' },
  },
}));

const UserIndex = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const { modal_alert } = useContext(ModalContext);

  const [loading, setLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<File | null>(null);
  const [currentProfilePath, setCurrentProfilePath] = useState('');
  const [originProfilePath, setOriginProfilePath] = useState('');
  const [updated, setUpdated] = useState(false);
  const [userContents, setUserContents] = useState([
    { label: '이메일', value: '', readonly: true, error: false, error_text: '' },
    {
      label: '닉네임',
      value: '',
      readonly: false,
      error: false,
      error_text: '영어 대소문자, 숫자, 한글만 입력해주세요.',
    },
    { label: '휴대폰 번호', value: '', readonly: false, error: false, error_text: '' },
  ]);

  useEffect(() => {
    if (user.uid) {
      const tmp_contents = [...userContents];

      tmp_contents[0].value = user.login_id;
      tmp_contents[1].value = user.nickname;
      tmp_contents[2].value = user.phone ?? '';

      setOriginProfilePath(user.profile_path ?? '');
      setCurrentProfilePath(user.profile_path ?? '');

      setUserContents([...tmp_contents]);
    }

    return () => {
      setOriginProfilePath('');
      setCurrentProfilePath('');
      setCurrentProfile(null);
    };
  }, [user]);

  useEffect(() => {
    checkUpdate();
  }, [userContents]);

  const checkUpdate = () => {
    let idx = 0;
    let updated = false;

    for (const check_item of userContents) {
      if (idx == 1 && check_item.value != user.nickname) {
        updated = true;
        break;
      }
      idx++;
    }

    setUpdated(updated);
  };

  const handleContents = (value: string, idx: number) => {
    const tmp_contents = [...userContents];
    const nick_reg = /([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣])/g;
    let error = false;
    if (idx == 1 && !nick_reg.test(value)) {
      error = true;
    }

    tmp_contents[idx].value = value;
    tmp_contents[idx].error = error;

    setUserContents([...tmp_contents]);
  };

  const updateUserInfo = async () => {
    setLoading(true);
    let update_status = false;

    if (updated) {
      const check_nickname = await fetchGetApi(`/users/${userContents[1].value}`);
      if (check_nickname) {
        modal_alert.openModalAlert('중복된 닉네임이 있습니다.\r\n다른 닉네임을 사용해주세요!');
        setLoading(false);
        return;
      }

      const update_data = {
        nickname: userContents[1].value,
      };
      const update_res = await fetchPostApi(`/users/${user.uid}/info`, update_data);
      if (update_res.affected == 1) {
        update_status = true;
        dispatch(setUserNickname({ nickname: update_data.nickname }));
      }
    }

    if (currentProfile) {
      await fetchPostApi(`/images/profile/${user.uid}/delete`, {});
      const upload_data = await setImageFormData([{ target_id: Number(user.uid), files: [currentProfile] }], 'profile');
      const upload_res = await fetchFileApi('/upload/image', upload_data);

      if (upload_res.length > 0) {
        update_status = true;
        const target_path = Math.floor(Number(user.uid) / 50) * 50;
        const path = `http://localhost:3080/images/profile/${target_path}/${upload_res[0].file_name}`;
        dispatch(setUserProfilePath({ profile_path: path }));
        setCurrentProfilePath(path);
        setOriginProfilePath(path);
        setCurrentProfile(null);
      }
    }

    if (update_status) {
      modal_alert.openModalAlert('정보가 수정되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.\r\n다시 시도해주세요.');
    }
    setLoading(false);
  };

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const cur_image = await readFile(file);

      setCurrentProfilePath(cur_image);
      setCurrentProfile(file);
    }
    setLoading(false);
  };

  const openFileInput = () => {
    const button_el = document.getElementById('profile_file_button');

    if (button_el && button_el.children[0]) {
      (button_el.children[0] as HTMLElement).click();
    }
  };

  return (
    <>
      <UserWrap>
        <ProfileBox onClick={openFileInput} sx={{ backgroundImage: `url(${currentProfilePath})` }}>
          {currentProfilePath.length == 0 ? <MdPets /> : null}
          <Box>편집</Box>
        </ProfileBox>
        <InfoBox>
          {userContents.map((content, content_idx) => {
            return (
              <UserTextField
                key={`user_content_${content_idx}`}
                variant='standard'
                label={content.label}
                focused
                color='gray_4'
                fullWidth
                value={content.value}
                error={content.error}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleContents(e.target.value, content_idx)}
                InputProps={{
                  readOnly: content.readonly,
                }}
                aria-describedby={`user_content_${content_idx}`}
              />
            );
          })}
        </InfoBox>
        <Button
          className='fill'
          color='orange'
          variant='contained'
          disableRipple
          disabled={!(updated || originProfilePath != currentProfilePath)}
          onClick={updateUserInfo}
        >
          저장
        </Button>
        <ButtonFileInput
          sx={{ opacity: 0, position: 'absolute', top: '-50000000', left: '-5000000' }}
          buttonId='profile_file_button'
          title=''
          onChange={onChangeImage}
          multiple={false}
          id='profile_file_input'
        />
      </UserWrap>
      {loading ? <LoadingDot className='app' /> : null}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { headers } = context.req;

  if (typeof query.uid == 'string' && Number(query.uid) > 0) {
    return {
      props: {
        test: 'hi',
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }
}

export default UserIndex;
