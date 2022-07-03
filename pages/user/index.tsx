import { Box, FormHelperText, styled, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../src/components/button/Button';
import { RootState } from '../../src/store';
import { MdPets } from 'react-icons/md';
import { fetchPostApi } from '../../src/utils/api';
import { ModalContext } from '../../src/provider/ModalProvider';
import { setUserNickname } from '../../src/store/slices/user';

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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
    padding: '1.5rem 0',

    '&:read-only': {
      backgroundColor: theme.palette.gray_6.main,
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
  const { modal_alert } = useContext(ModalContext);

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

      setUserContents([...tmp_contents]);
    }
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
    console.log(nick_reg.test(value));
    if (idx == 1 && !nick_reg.test(value)) {
      error = true;
    }

    tmp_contents[idx].value = value;
    tmp_contents[idx].error = error;

    setUserContents([...tmp_contents]);
  };

  const updateUserInfo = async () => {
    const update_data = {
      nickname: userContents[1].value,
    };

    const update_res = await fetchPostApi(`/users/${user.uid}/info`, update_data);
    if (update_res.affected == 1) {
      modal_alert.openModalAlert('정보가 수정되었습니다.');

      dispatch(setUserNickname({ nickname: update_data.nickname }));
    } else {
      modal_alert.openModalAlert('오류로 인해 수정이 실패되었습니다.\r\n다시 시도해주세요.');
    }
  };

  return (
    <UserWrap>
      <ProfileBox>
        <MdPets />
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
        disabled={!updated}
        onClick={updateUserInfo}
      >
        저장
      </Button>
    </UserWrap>
  );
};

export default UserIndex;
