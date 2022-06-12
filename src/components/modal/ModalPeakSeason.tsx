import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModalContext } from '../../provider/ModalProvider';

import ContainerModalContents from '../container/ContainerModalContents';
import ModalDefault from './ModalDefault';
import LabelModal from '../label/LabelModal';
import UtilBox from '../common/UtilBox';
import Button from '../button/Button';
import FormPeakSeason from '../form/FormPeakSeason';

interface ModalPeakSeasonProps {
  visible: boolean;
  data: string[][];
  mode: string;
  onClose: () => void;
  onUpdateSeason: (data: { start: string; end: string }[]) => void;
}

const ModalPeakSeasonContentsBox = styled(Box)(({ theme }) => ({
  fontSize: '0.9rem',
  width: '60rem',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '2rem',
  gap: '1rem',
}));

function ModalPeakSeason(props: ModalPeakSeasonProps) {
  const { modal_confirm } = useContext(ModalContext);

  const visible = props.visible;
  const season_data = props.data;
  const mode = props.mode;
  const onUpdateSeason = props.onUpdateSeason;
  const onClose = props.onClose;

  const [peakSeason, setPeakSeason] = useState<string[][]>([]);

  useEffect(() => {
    if (visible) {
      setPeakSeason([...season_data]);
    } else {
      setPeakSeason([]);
    }
  }, [visible]);

  const onChangePeakSeason = (parent_idx: number, children_idx: number, date: string) => {
    const tmp_season = [...peakSeason];
    tmp_season[parent_idx][children_idx] = date;
    setPeakSeason([...tmp_season]);
  };

  const deleteSeason = (parent_idx: number) => {
    const tmp_season = [...peakSeason];
    tmp_season.splice(parent_idx, 1);
    setPeakSeason([...tmp_season]);
  };

  const confirmUpdate = () => {
    modal_confirm.openModalConfirm('성수기 기간을 변경하시겠습니까?', () => {
      const update_data: { start: string; end: string }[] = [];
      for (const x of peakSeason) {
        update_data.push({ start: x[0], end: x[1] });
      }
      onUpdateSeason(update_data);
    });
  };

  return (
    <>
      <ModalDefault bottom={false} white={false} visible={visible} onClose={onClose}>
        <ContainerModalContents>
          <LabelModal title={`성수기 기간${mode == 'edit' ? ' 변경' : ''}`} onClose={onClose} />
          {mode == 'read' ? null : (
            <UtilBox justifyContent='flex-end' sx={{ paddingRight: '2rem' }}>
              <Button variant='contained' color='blue' onClick={() => setPeakSeason([...peakSeason, []])}>
                기간 추가
              </Button>
            </UtilBox>
          )}
          <ModalPeakSeasonContentsBox>
            <FormPeakSeason data={peakSeason} onDateChange={onChangePeakSeason} onDelete={deleteSeason} mode={mode} />
          </ModalPeakSeasonContentsBox>
          {mode == 'read' ? null : (
            <UtilBox>
              <Button variant='contained' color='orange' onClick={confirmUpdate}>
                수정
              </Button>
            </UtilBox>
          )}
        </ContainerModalContents>
      </ModalDefault>
    </>
  );
}

export default ModalPeakSeason;
