import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },

    '.MuiList-root': {
      maxHeight: '13rem',
    },
  },
}));

interface DropdownMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  items: string[];
  onClick: (idx: number) => void;
}

const DropdownMenu = (props: DropdownMenuProps) => {
  const open = props.open;
  const anchorEl = props.anchorEl;
  const onClose = props.onClose;
  const items = props.items;
  const onClick = props.onClick;

  return (
    <StyledMenu
      id='demo-customized-menu'
      MenuListProps={{
        'aria-labelledby': 'demo-customized-button',
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      key={'test'}
    >
      {items.map((data, index) => {
        return (
          <MenuItem onClick={() => onClick(index)} disableRipple key={`dropdown_item_${data}_${index}`}>
            {data}
          </MenuItem>
        );
      })}
    </StyledMenu>
  );
};

export default DropdownMenu;
