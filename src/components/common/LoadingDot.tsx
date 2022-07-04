import { Box, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const LoadingWrap = styled(Box)(({ theme }) => ({
  '&.app': {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.075)',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '1',

  '.dot-flashing': {
    position: 'relative',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: theme.palette.orange.main,
    color: theme.palette.orange.main,
    animation: 'dotFlashing 1s infinite linear alternate',
    animationDelay: '0.5s',
  },

  '.dot-flashing::before, .dot-flashing::after': {
    content: '""',
    display: 'inline-block',
    position: 'absolute',
    top: '0',
  },

  '.dot-flashing::before': {
    left: '-1.5rem',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: theme.palette.orange.main,
    color: theme.palette.orange.main,
    animation: 'dotFlashing 1s infinite alternate',
    animationDelay: '0s',
  },

  '.dot-flashing::after': {
    left: '1.5rem',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    backgroundColor: theme.palette.orange.main,
    color: theme.palette.orange.main,
    animation: 'dotFlashing 1s infinite alternate',
    animationDelay: '1s',
  },

  '@keyframes dotFlashing': {
    '0%, 50%': {
      backgroundColor: theme.palette.orange.main,
    },
    '50%, 100%': {
      backgroundColor: theme.palette.white.main,
    },
  },
}));

interface LoadingDotProps {
  className?: string;
}

function LoadingDot(props: LoadingDotProps) {
  const user = useSelector((state: RootState) => state.userReducer);
  const class_name = props.className;

  return (
    <LoadingWrap className={`snippet ${class_name ? `${class_name}` : ''}`}>
      <LoadingContainer className='stage'>
        <Box className='dot-flashing'></Box>
      </LoadingContainer>
    </LoadingWrap>
  );
}

export default LoadingDot;
