import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import { IconButton, Box, Checkbox } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { TableContext } from '../../../src/provider/TableProvider';
import Button from '../button/Button';
import UtilBox from '../common/UtilBox';
import Dropdown from '../dropdown/Dropdown';

interface TableProps {
  contents: ChildrenDataType;
}

const TablePaginationBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const TablePaginationLabel = styled(Box)(({ theme }) => ({
  width: '4rem',
  textAlign: 'center',
}));

const CustomTable = (props: TableProps) => {
  const TableController = useContext(TableContext);
  const children_contents = props.contents;

  useEffect(() => {
    TableController.setTableContents(children_contents);
  }, [children_contents.table_items]);

  return (
    <>
      <UtilBox justifyContent='flex-end'>
        <Dropdown
          items={TableController.data.edit_items}
          onClick={(idx: number) => TableController.setClickedDropdownIndex(idx)}
          buttonDisabled={TableController.data.button_disabled}
        />
      </UtilBox>
      <TableContainer component={Paper}>
        <Table aria-label='custom table'>
          <TableHead>
            <TableRow>
              {TableController.data.header.map((data, index) => {
                return (
                  <TableCell align={data.center ? 'center' : 'left'} key={`custom_table_header_${index}`}>
                    {data.label == 'check' ? '' : data.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {TableController.data.table_items.map((data, index) => {
              return (
                <TableRow
                  key={`body_row_${index}`}
                  onClick={() => TableController.setChecked(index, 'click')}
                  sx={{ cursor: 'pointer' }}
                >
                  {TableController.data.header.map((cell, index2) => {
                    let contents: React.ReactNode | string = '';
                    if (cell.type) {
                      if (cell.type == 'button') {
                        contents = (
                          <Button
                            variant='outlined'
                            color='blue'
                            sx={{ margin: '0 auto', fontSize: '0.875rem' }}
                            onClick={() => TableController.setClickedButtonIndex(index, cell.key)}
                          >
                            확인
                          </Button>
                        );
                      } else if (cell.type == 'checkbox') {
                        contents = (
                          <Checkbox
                            checked={data.checked}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              TableController.setChecked(index, 'change', e)
                            }
                          />
                        );
                      }
                    } else {
                      contents = data[cell.key];
                    }
                    return (
                      <TableCell align={cell.center ? 'center' : 'left'} key={`body_row_${index}_cell_${index2}`}>
                        {contents}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={TableController.data.footer_colspan}>
                <TablePaginationBox>
                  <IconButton
                    disabled={TableController.data.left}
                    onClick={() => TableController.clickDirection('left')}
                  >
                    <HiChevronLeft />
                  </IconButton>
                  <TablePaginationLabel>{`${TableController.data.per_page} / ${Math.ceil(
                    TableController.data.rows_length / 5,
                  )}`}</TablePaginationLabel>
                  <IconButton
                    disabled={TableController.data.right}
                    onClick={() => TableController.clickDirection('right')}
                  >
                    <HiChevronRight />
                  </IconButton>
                </TablePaginationBox>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};
export default CustomTable;
