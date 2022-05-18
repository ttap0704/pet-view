import UtilBox from '../../src/components/common/UtilBox';
import Dropdown from '../../src/components/dropdown/Dropdown';
import ChartLine from '../../src/components/chart/ChartLine';

const ManageIndex = () => {
  const handleDropdown = (idx: number) => {
    console.log(idx);
  };

  return (
    <>
      <UtilBox justifyContent='flex-end'>
        <Dropdown
          items={['2022년 5월']}
          onClick={handleDropdown}
          buttonDisabled={false}
          title='2022년 5월'
          variant='outlined'
        />
      </UtilBox>
      <ChartLine />
    </>
  );
};

export default ManageIndex;
