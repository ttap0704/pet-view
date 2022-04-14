import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabsProps {
  contents: string[];
  elements: React.ReactElement[];
}

const CustomTabs = styled(Tabs)(({ theme }) => ({
  '.MuiTabs-scroller': {
    '.MuiTabs-flexContainer': {
      '.MuiButtonBase-root': {
        '&.Mui-selected': {
          color: theme.palette.orange.main,
        },
      },
    },
    '.MuiTabs-indicator': {
      backgroundColor: theme.palette.orange.main,
    },
  },
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ paddingTop: '1rem' }}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs(props: TabsProps) {
  const contents = props.contents;
  const elements = props.elements;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <CustomTabs value={value} onChange={handleChange}>
          {contents.map((item, item_idx) => {
            return <Tab label={item} {...a11yProps(item_idx)} key={`tabs_contents_${item_idx}`} disableRipple />;
          })}
        </CustomTabs>
      </Box>
      {elements.map((element, element_idx) => {
        return (
          <TabPanel value={value} index={element_idx} key={`tabs_elements_${element_idx}`}>
            {element}
          </TabPanel>
        );
      })}
    </Box>
  );
}

export default BasicTabs;
