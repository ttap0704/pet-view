import { Box, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ProgressBarWrapper = styled(Box)(({ theme }) => ({
  '&.progress': {
    width: '100vw',
    height: '4px',
    background: '#eaeaea',
    position: 'fixed',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    borderRadius: '4px',
    bottom: 0,
  },

  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    width: '25%',
    height: '100%',
    background: theme.palette.orange.main,
    animation: '1s progressIndeterminate infinite',
  },

  '@keyframes progressIndeterminate': {
    from: {
      width: '0',
      marginLeft: '0',
      marginRight: '100%',
    },
    '50%': {
      width: '100%',
      marginLeft: '0',
      marginRight: '0',
    },
    to: {
      width: '0',
      marginLeft: '100%',
      marginRight: '0',
    },
  },
}));

const ProgressBar = () => {
  const user = useSelector((state: RootState) => state.userReducer);

  return <ProgressBarWrapper className='progress progress--indeterminate' />;
};

export default ProgressBar;
