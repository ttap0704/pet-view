import { Box, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  padding: '1rem 2rem',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
  fontSize: '0.95rem',
  borderRadius: 6,
}));

const LayoutJoinSuccess = () => {
  return (
    <SuccessWrap>
      <Typography variant='h4'>회원가입 성공</Typography>
      <Divider sx={{ width: '50%', margin: '0.5rem auto' }} />
      <CertificationBox>
        가입해주신 이메일로 <b>인증번호</b>와 <b>인증 링크</b>가 발송되었습니다.
        <br />
        <br />
        인증이 완료되면 정상적으로 서비스를 사용하실 수 있습니다.
      </CertificationBox>
    </SuccessWrap>
  );
};

export default LayoutJoinSuccess;
