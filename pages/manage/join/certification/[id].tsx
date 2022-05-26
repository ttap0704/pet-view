import { Box, Divider, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { fetchPostApi } from '../../../../src/utils/api';

import InputOutlined from '../../../../src/components/input/InputOutlined';
import Button from '../../../../src/components/button/Button';
import { ModalContext } from '../../../../src/provider/ModalProvider';

const SuccessWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  margin: '2rem auto 0 !important',
  height: 'auto',
  padding: '1rem',
  borderRadius: 6,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
}));

const CertificationBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  padding: '1rem 2rem',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
  fontSize: '0.95rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  borderRadius: 6,
}));

const JoinSuccess = () => {
  const router = useRouter();
  const { modal_alert, modal_notice } = useContext(ModalContext);

  const [certNum, setCertNum] = useState('');
  const [curId, setCurId] = useState(0);

  useEffect(() => {
    if (router.query && router.query.id) {
      setCurId(Number(router.query.id));
    }
  }, []);

  const certUser = async () => {
    const cert_res = await fetchPostApi(`/join-certification`, { id: curId, cert_num: certNum });

    if (cert_res.pass) {
      modal_alert.openModalAlert('인증에 성공하였습니다.', true, () => {
        router.push('/manage/login');
      });
    } else {
      if (cert_res.message == 'Wrong Number') {
        modal_alert.openModalAlert('인증번호가 맞지 않습니다.\r\n다시 입력해주세요.', true);
      } else {
        modal_alert.openModalAlert('잘못된 접근입니다', true);
        window.close();
      }
    }
  };

  return (
    <SuccessWrap>
      <Typography variant='h4'>[어디어디] 이메일 인증</Typography>
      <Divider sx={{ width: '50%', margin: '0.5rem auto' }} />
      <CertificationBox>
        <InputOutlined
          placeholder='인증번호 (숫자만 입력해주세요.)'
          value={certNum}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCertNum(e.target.value)}
          max={6}
        />
        <Button variant='contained' color='orange' className='fill' onClick={certUser}>
          인증
        </Button>
      </CertificationBox>
    </SuccessWrap>
  );
};

export default JoinSuccess;
