import { useEffect, useState, useContext } from 'react';

import Editor from '../../../src/components/common/Editor';
import ContainerRegistrationItem from '../../../src/components/container/ContainerRegistrationItem';

const AdminRestaurantInfo = () => {
  return (
    <>
      <ContainerRegistrationItem title='공지사항 작성'>
        <Editor />
      </ContainerRegistrationItem>
    </>
  );
};

export default AdminRestaurantInfo;
