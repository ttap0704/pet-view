import { Box, styled } from '@mui/material';

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

function LoadingDot() {
  return (
    <Box className='snippet'>
      <LoadingContainer className='stage'>
        <Box className='dot-flashing'></Box>
      </LoadingContainer>
    </Box>
  );
}

export default LoadingDot;
