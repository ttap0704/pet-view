import { GetStaticProps } from 'next';

import { useEffect, useState, Fragment } from 'react';
import { fetchGetApi } from '../../src/utils/api';
import { setImageArray } from '../../src/utils/tools';
import ImageBox from '../../src/components/image/ImageBox';
import ListLabel from '../../src/components/common/ListLabel';

interface AccommodationList {
  accommodation_images: { file_name: string }[];
  bname: string;
  id: number;
  label: string;
  sigungu: string;
}

const AccommodationIndex = (props: { list: AccommodationList[]; style: { [key: string]: string } }) => {
  const tmp = ['1_0_1643158040156.jpeg', '1_0_1644277795931.jpeg', '1_1_1643158040157.jpeg'];
  const [list, setList] = useState<AccommodationList[]>([]);
  useEffect(() => {
    setList([...props.list]);
  }, []);

  return (
    <div>
      {list.map((item, index) => {
        return (
          <Fragment key={`accommodation_list_${index}`}>
            <ImageBox imageList={setImageArray(item.accommodation_images)} type='accommodation' slide={true} />
            <ListLabel title={item.label} subtitle={item.bname} />
          </Fragment>
        );
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data: AccommodationList = await fetchGetApi(`/accommodation`);

  return {
    props: {
      list: data,
    },
  };
};

export default AccommodationIndex;
