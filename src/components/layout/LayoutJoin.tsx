import { Box, Divider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { HiChevronDown, HiChevronUp, HiOutlineDotsVertical } from 'react-icons/hi';

import InputOutlined from '../input/InputOutlined';
import Button from '../button/Button';

import { fetchPostApi } from '../../utils/api';
import { setYearContents } from '../../utils/tools';

import { ModalContext } from '../../provider/ModalProvider';
import DropdownMenu from '../common/DropdownMenu';

interface JoinContentsType {
  value: string;
  status: boolean;
  placeholder: string;
  title: string;
  type: string;
}

const DropdownButton = styled(Button)(({ theme }) => ({
  borderRadius: '2rem',
  minHeight: '2.5rem',

  svg: {
    position: 'absolute',
    top: '50%',
    right: '1rem',
    transform: 'translateY(-50%)',
  },
}));

const JoinWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '350px',
  margin: '2rem auto 0 !important',
  height: 'auto',
  padding: '1rem',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
}));

const LoginBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}));

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: 0,
  height: '2.5rem',
  fontSize: '1rem',

  '&:hover': {
    backgroundColor: 'unset',
  },

  '&.Mui-selected': {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.orange.main,
  },

  '&.Mui-selected:hover': {
    color: theme.palette.white.main,
    backgroundColor: theme.palette.orange.main,
  },
}));

const LayoutJoin = (props: any) => {
  const router = useRouter();

  const [dropdownElement, setDropdownElement] = useState<null | HTMLElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownContents, setDropdownContents] = useState(['????????????']);
  const [birthYear, setBirthYear] = useState(0);
  const [male, setMale] = useState<null | string>(null);
  const { modal_alert, modal_notice } = useContext(ModalContext);
  const [isPlatform, setIsPlatform] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [certStatus, setCertStatus] = useState(true);
  const [certificationData, setCertificationData] = useState({
    b_no: '',
    p_nm: '',
    start_dt: '',
    b_nm: '',
    b_sector: '',
    b_type: '',
  });
  const [joinInfo, setJoinInfo] = useState([
    {
      value: '',
      status: true,
      placeholder: '???????????? ??????????????????.',
      title: '?????????',
      type: 'text',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '??????????????? ??????????????????.',
      title: '????????????',
      type: 'password',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '??????????????? ??????????????????.',
      title: '???????????? ??????',
      type: 'password',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '???????????? ??????????????????.',
      title: '?????????',
      type: 'text',
      disabled: false,
      visible: true,
    },
  ]);

  const [certificationInfo, setCertificationInfo] = useState([
    {
      value: '',
      status: true,
      placeholder: '???????????????????????? ??????????????????.',
      title: '?????????????????????',
      type: 'text',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '???????????? ??????????????????.',
      title: '?????????',
      type: 'text',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '??????????????? ??????????????????.',
      title: '????????????',
      type: 'text',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '???????????? ??????????????????.',
      title: '?????????',
      type: 'text',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '???????????? ??????????????????.',
      title: '??????',
      type: 'text',
      disabled: false,
      visible: true,
    },
    {
      value: '',
      status: true,
      placeholder: '???????????? ??????????????????.',
      title: '??????',
      type: 'text',
      disabled: false,
      visible: true,
    },
  ]);

  useEffect(() => {
    const years = setYearContents();
    setDropdownContents([...years]);
    if (router.pathname.includes('admin')) {
      setCertStatus(false);
      setIsAdmin(true);
    } else {
      if (
        (router.query.kakao && router.query.kakao == 'true') ||
        (router.query.naver && router.query.naver == 'true')
      ) {
        setIsPlatform(true);

        const tmp_join_info = [...joinInfo];

        tmp_join_info[0].value = `${router.query.login_id}`;
        tmp_join_info[0].disabled = true;
        tmp_join_info[1].visible = false;
        tmp_join_info[2].visible = false;
        tmp_join_info[3].value = `${router.query.nickname}`;

        setJoinInfo([...tmp_join_info]);
      }
    }
  }, []);

  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const tmp_info = certStatus ? [...joinInfo] : [...certificationInfo];
    tmp_info[idx].value = e.target.value;
    if (certStatus) {
      setJoinInfo([...tmp_info]);
    } else {
      setCertificationInfo([...tmp_info]);
    }
  };

  const joinUser = async () => {
    const join_data: {
      login_id: string;
      password?: string;
      password_check?: string;
      nickname: string;
      kakao: number;
      naver: number;
      male: number | null;
      birth_year: number;
    } = {
      login_id: joinInfo[0].value,
      password: joinInfo[1].value,
      password_check: joinInfo[2].value,
      nickname: joinInfo[3].value,
      kakao: 0,
      naver: 0,
      male: Number(male),
      birth_year: birthYear,
    };

    if (!isPlatform) {
      if (
        join_data.login_id.length == 0 ||
        join_data.password == undefined ||
        join_data.password.length == 0 ||
        join_data.password_check == undefined ||
        join_data.password_check.length == 0 ||
        join_data.nickname.length == 0 ||
        join_data.male == null ||
        join_data.birth_year == 0
      ) {
        modal_alert.openModalAlert('?????? ????????? ??????????????????.', true);
        return;
      } else if (join_data.password_check != undefined && join_data.password != join_data.password_check) {
        modal_alert.openModalAlert('??????????????? ???????????? ????????????.', true);
        return;
      }
    } else {
      if (
        join_data.login_id.length == 0 ||
        join_data.nickname.length == 0 ||
        join_data.male == null ||
        join_data.birth_year == 0
      ) {
        modal_alert.openModalAlert('?????? ????????? ??????????????????.', true);
        return;
      } else if (join_data.password_check != undefined && join_data.password != join_data.password_check) {
        modal_alert.openModalAlert('??????????????? ???????????? ????????????.', true);
        return;
      }
    }

    delete join_data.password_check;
    if (isPlatform) {
      delete join_data.password;
      if (router.query.kakao == 'true') {
        join_data.kakao = 1;
      } else if (router.query.naver == 'true') {
        join_data.naver = 1;
      }
    }

    const payload = isAdmin ? { join_data, business_data: certificationData } : join_data;
    const url = isAdmin ? '/admin/join' : '/users/join';
    let success_url = '';
    if (isPlatform) {
      success_url = '/login';
    } else {
      if (isAdmin) {
        success_url = '/admin/join/success';
      } else {
        success_url = '/join/success';
      }
    }

    const create_res = await fetchPostApi(url, payload);

    if (create_res.pass) {
      modal_notice.openModalNotice('??????????????? ?????????????????????.', () => {
        router.push(success_url);
      });
    } else {
      let message = '';
      if (create_res.message == 'Duplicate Email') {
        message = '????????? ???????????? ????????????.\r\n??????????????????.';
      } else if (create_res.message == 'Not Target') {
        message = '???????????? ?????? ????????? ????????????\r\n??????????????? ???????????????.';
      } else {
        message = '????????? ????????? ????????????.\r\n??????????????????.';
      }
      modal_alert.openModalAlert(`${message}`, true);
    }
  };

  const certUser = async () => {
    const cert_data = {
      b_no: certificationInfo[0].value,
      p_nm: certificationInfo[1].value,
      start_dt: certificationInfo[2].value,
      b_nm: certificationInfo[3].value,
      b_sector: certificationInfo[4].value,
      b_type: certificationInfo[5].value,
      p_nm2: '',
      corp_no: '',
    };

    const cert_res = await fetchPostApi('/business/certification', cert_data);

    if (cert_res.pass) {
      modal_alert.openModalAlert('????????? ?????????????????????', true, () => {
        setCertStatus(true);
        clearCerttificationInfo();
        setCertificationData({ ...cert_data });
      });
    } else {
      if (cert_res.message == 'Not Target') {
        modal_alert.openModalAlert('???????????? ?????? ????????? ????????????\r\n??????????????? ???????????????.', true);
      } else if (cert_res.message == 'Already Join') {
        modal_alert.openModalAlert('?????? ????????? ??????????????????.', true);
      } else {
        modal_alert.openModalAlert('????????? ?????????????????????.\r\n?????? ??????????????????.', true);
      }
    }
  };

  const clearCerttificationInfo = () => {
    setCertificationInfo([
      {
        value: '',
        status: true,
        placeholder: '???????????????????????? ??????????????????.',
        title: '?????????????????????',
        type: 'text',
        disabled: false,
        visible: true,
      },
      {
        value: '',
        status: true,
        placeholder: '???????????? ??????????????????.',
        title: '?????????',
        type: 'text',
        disabled: false,
        visible: true,
      },
      {
        value: '',
        status: true,
        placeholder: '??????????????? ??????????????????.',
        title: '????????????',
        type: 'text',
        disabled: false,
        visible: true,
      },
      {
        value: '',
        status: true,
        placeholder: '???????????? ??????????????????.',
        title: '?????????',
        type: 'text',
        disabled: false,
        visible: true,
      },
      {
        value: '',
        status: true,
        placeholder: '???????????? ??????????????????.',
        title: '??????',
        type: 'text',
        disabled: false,
        visible: true,
      },
      {
        value: '',
        status: true,
        placeholder: '???????????? ??????????????????.',
        title: '??????',
        type: 'text',
        disabled: false,
        visible: true,
      },
    ]);
  };

  const handleChange = (event: React.MouseEvent<HTMLElement>, new_male: string) => {
    setMale(new_male);
  };

  const openCommentDropdown = (e: React.MouseEvent<HTMLElement>) => {
    setDropdownElement(e.currentTarget);
    setDropdownOpen(true);
  };

  const handleDropdown = (idx: number) => {
    const birth = Number(dropdownContents[idx].replace('???', ''));
    setBirthYear(birth);
    setDropdownOpen(false);
  };

  return (
    <JoinWrap>
      <Typography variant='h4'>{certStatus ? '????????????' : '????????? ??????'}</Typography>
      <Divider sx={{ width: '50%', margin: '0.5rem auto' }} />
      <LoginBox>
        {(certStatus ? joinInfo : certificationInfo).map((info, index) => {
          return info.visible ? (
            <Box key={`join_contents_${index}`}>
              <Typography>{info.title}</Typography>
              <InputOutlined
                type={info.type}
                value={info.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLoginInput(e, index)}
                placeholder={info.placeholder}
                disabled={info.disabled}
              />
            </Box>
          ) : null;
        })}

        <Box>
          <Typography>??????</Typography>
          <ToggleButtonGroup fullWidth color='orange' value={male} exclusive onChange={handleChange}>
            <CustomToggleButton value='1' disableRipple>
              ??????
            </CustomToggleButton>
            <CustomToggleButton value='2' disableRipple>
              ??????
            </CustomToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography>????????????</Typography>
          <DropdownButton
            disableRipple
            color='gray_1'
            className='fill'
            variant='outlined'
            onClick={openCommentDropdown}
            endIcon={<HiChevronDown />}
          >
            {birthYear == 0 ? '??????' : birthYear + '???'}
          </DropdownButton>
          <DropdownMenu
            open={dropdownOpen}
            anchorEl={dropdownElement}
            onClose={() => setDropdownOpen(false)}
            onClick={handleDropdown}
            items={dropdownContents}
          />
        </Box>

        <Button
          variant='contained'
          color='orange'
          sx={{ marginTop: '0.5rem' }}
          onClick={certStatus ? joinUser : certUser}
        >
          {certStatus ? '????????????' : '??????'}
        </Button>
      </LoginBox>
    </JoinWrap>
  );
};

export default LayoutJoin;
