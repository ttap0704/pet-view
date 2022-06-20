import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';

import { MdAttachEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

import InputOutlined from '../input/InputOutlined';
import Button from '../button/Button';
import UtilBox from '../common/UtilBox';

import { fetchGetApi, fetchPostApi } from '../../utils/api';

import { ModalContext } from '../../provider/ModalProvider';

interface JoinContentsType {
  value: string;
  status: boolean;
  placeholder: string;
  title: string;
  type: string;
}

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

const LayoutJoin = () => {
  const router = useRouter();

  const { modal_alert, modal_notice } = useContext(ModalContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [certStatus, setCertStatus] = useState(false);
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
      placeholder: '이메일을 입력해주세요.',
      title: '이메일',
      type: 'text',
    },
    {
      value: '',
      status: true,
      placeholder: '비밀번호를 입력해주세요.',
      title: '비밀번호',
      type: 'password',
    },
    {
      value: '',
      status: true,
      placeholder: '비밀번호를 입력해주세요.',
      title: '비밀번호 확인',
      type: 'password',
    },
    {
      value: '',
      status: true,
      placeholder: '이름을 입력해주세요.',
      title: '이름',
      type: 'text',
    },
    {
      value: '',
      status: true,
      placeholder: '닉네임을 입력해주세요.',
      title: '닉네임',
      type: 'text',
    },
  ]);

  const [certificationInfo, setCertificationInfo] = useState([
    {
      value: '',
      status: true,
      placeholder: '사업자등록번호를 입력해주세요.',
      title: '사업자등록번호',
      type: 'text',
    },
    { value: '', status: true, placeholder: '대표자를 입력해주세요.', title: '대표자', type: 'text' },
    { value: '', status: true, placeholder: '개업일자를 입력해주세요.', title: '개업일자', type: 'text' },
    { value: '', status: true, placeholder: '상호명을 입력해주세요.', title: '상호명', type: 'text' },
    { value: '', status: true, placeholder: '업태명을 입력해주세요.', title: '업태', type: 'text' },
    { value: '', status: true, placeholder: '종목명을 입력해주세요.', title: '종목', type: 'text' },
  ]);

  useEffect(() => {
    if (!router.pathname.includes('admin')) {
      setCertStatus(true);
    } else {
      setIsAdmin(true);
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
      password: string;
      password_check?: string;
      name: string;
      nickname: string;
    } = {
      login_id: joinInfo[0].value,
      password: joinInfo[1].value,
      password_check: joinInfo[2].value,
      name: joinInfo[3].value,
      nickname: joinInfo[4].value,
    };

    if (
      join_data.login_id.length == 0 ||
      join_data.password.length == 0 ||
      join_data.password_check == undefined ||
      join_data.password_check.length == 0 ||
      join_data.name.length == 0 ||
      join_data.nickname.length == 0
    ) {
      modal_alert.openModalAlert('모든 정보를 입력해주세요.', true);
      return;
    } else if (join_data.password_check != undefined && join_data.password != join_data.password_check) {
      modal_alert.openModalAlert('비밀번호가 일치하지 않습니다.', true);
      return;
    }

    delete join_data.password_check;

    const payload = isAdmin ? { join_data, business_data: certificationData } : join_data;
    const url = isAdmin ? '/admin/join' : '/users/join';
    const success_url = isAdmin ? '/admin/join/success' : '/join/success';

    const create_res = await fetchPostApi(url, payload);

    if (create_res.pass) {
      modal_notice.openModalNotice('회원가입이 완료되었습니다.', () => {
        router.push(success_url);
      });
    } else {
      let message = '';
      if (create_res.message == 'Duplicate Email') {
        message = '중복된 이메일이 있습니다.\r\n확인해주세요.';
      } else if (create_res.message == 'Not Target') {
        message = '숙박업소 또는 음식점 운영자만\r\n회원가입이 가능합니다.';
      } else {
        message = '중복된 닉네임 있습니다.\r\n확인해주세요.';
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
      modal_alert.openModalAlert('인증에 성공하였습니다', true, () => {
        setCertStatus(true);
        clearCerttificationInfo();
        setCertificationData({ ...cert_data });
      });
    } else {
      if (cert_res.message == 'Not Target') {
        modal_alert.openModalAlert('숙박업소 또는 음식점 운영자만\r\n회원가입이 가능합니다.', true);
      } else if (cert_res.message == 'Already Join') {
        modal_alert.openModalAlert('이미 등록된 사업자입니다.', true);
      } else {
        modal_alert.openModalAlert('인증에 실패하였습니다.\r\n다시 시도해주세요.', true);
      }
    }
  };

  const clearCerttificationInfo = () => {
    setCertificationInfo([
      {
        value: '',
        status: true,
        placeholder: '사업자등록번호를 입력해주세요.',
        title: '사업자등록번호',
        type: 'text',
      },
      { value: '', status: true, placeholder: '대표자를 입력해주세요.', title: '대표자', type: 'text' },
      { value: '', status: true, placeholder: '개업일자를 입력해주세요.', title: '개업일자', type: 'text' },
      { value: '', status: true, placeholder: '상호명을 입력해주세요.', title: '상호명', type: 'text' },
      { value: '', status: true, placeholder: '업태명을 입력해주세요.', title: '업태', type: 'text' },
      { value: '', status: true, placeholder: '종목명을 입력해주세요.', title: '종목', type: 'text' },
    ]);
  };

  return (
    <JoinWrap>
      <Typography variant='h4'>{certStatus ? '회원가입' : '사업자 인증'}</Typography>
      <Divider sx={{ width: '50%', margin: '0.5rem auto' }} />
      <LoginBox>
        {(certStatus ? joinInfo : certificationInfo).map((info, index) => {
          return (
            <Box key={`join_contents_${index}`}>
              <Typography>{info.title}</Typography>
              <InputOutlined
                type={info.type}
                value={info.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLoginInput(e, index)}
                placeholder={info.placeholder}
              />
            </Box>
          );
        })}
        <Button
          variant='contained'
          color='orange'
          sx={{ marginTop: '0.5rem' }}
          onClick={certStatus ? joinUser : certUser}
        >
          {certStatus ? '회원가입' : '인증'}
        </Button>
      </LoginBox>
    </JoinWrap>
  );
};

export default LayoutJoin;
