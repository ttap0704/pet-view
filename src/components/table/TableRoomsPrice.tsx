import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Box, { BoxProps } from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { Typography } from '@mui/material';

interface TableRoomPriceProps {
  priceContents: { [key: string]: number };
  seasonContents: PeakSeasonType[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.black.main,
    color: theme.palette.white.main,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.95rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const NoticeTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.gray_2.main,
  width: '100%',
  textAlign: 'right',
  padding: '0.5rem 0 1rem',
  fontSize: '0.85rem',
}));

const TableRoomPrice = (props: TableRoomPriceProps) => {
  const total_price = props.priceContents;
  const season = props.seasonContents;

  useEffect(() => {
    console.log(season);
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'>성수기 기간</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {season.map((item, item_idx) => {
              const start_splited = item.start.split('-');
              const end_splited = item.end.split('-');
              return (
                <StyledTableRow key={`season_row_${item_idx}`}>
                  <StyledTableCell align='center'>
                    {`${Number(start_splited[0])}월 ${Number(start_splited[1])}일`} ~{' '}
                    {`${Number(end_splited[0])}월 ${Number(end_splited[1])}일`}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={1} align='center'>
                비수기
              </StyledTableCell>
              <StyledTableCell colSpan={1} align='center'>
                비수기 주말
              </StyledTableCell>
              <StyledTableCell colSpan={1} align='center'>
                성수기
              </StyledTableCell>
              <StyledTableCell colSpan={1} align='center'>
                성수기 주말
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell align='center'>
                {total_price['normal_price_min'].toLocaleString()}원 ~{' '}
                {total_price['normal_price_max'].toLocaleString()}원
              </StyledTableCell>
              <StyledTableCell align='center'>
                {total_price['normal_weekend_price_min'].toLocaleString()}원 ~{' '}
                {total_price['normal_weekend_price_max'].toLocaleString()}원
              </StyledTableCell>
              <StyledTableCell align='center'>
                {total_price['peak_price_min'].toLocaleString()}원 ~ {total_price['peak_price_max'].toLocaleString()}원
              </StyledTableCell>
              <StyledTableCell align='center'>
                {total_price['peak_weekend_price_min'].toLocaleString()}원 ~{' '}
                {total_price['peak_weekend_price_max'].toLocaleString()}원
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableRoomPrice;
