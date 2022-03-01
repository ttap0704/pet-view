import Table from '../../../src/components/table/Table';

const ManageAccommodationInfo = () => {
  return (
    <div>
      <Table
        header={[{ label: 'test', center: true }]}
        footerColspan={1}
        rowsLength={10}
        changePerPage={(page: number) => console.log(page)}
      >
        <span>hihi</span>
      </Table>
    </div>
  );
};

export default ManageAccommodationInfo;
