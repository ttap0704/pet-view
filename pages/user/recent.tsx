import { GetServerSidePropsContext } from 'next';

import React from 'react';
import { fetchGetApi } from '../../src/utils/api';
import { setImageArray } from '../../src/utils/tools';

import LayoutUserProducts from '../../src/components/layout/LayoutUserProducts';

const UserRecent = (props: { list: UserProductType[]; style: { [key: string]: string } }) => {
  return <LayoutUserProducts list={props.list} title='최근 본 게시물' />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;

  let recent_data: UserProductType[] = [];
  if (query.accommodation) {
    const accom_data: UserProductType[] = await fetchGetApi(`/accommodation?recent=${query.accommodation.toString()}`);
    recent_data = [...recent_data, ...accom_data];
  }
  if (query.restaurant) {
    const rest_data: UserProductType[] = await fetchGetApi(`/restaurant?recent=${query.restaurant.toString()}`);
    recent_data = [...recent_data, ...rest_data];
  }

  const list: UserProductType[] = [];
  for await (const item of recent_data) {
    let image_list: ImageListType[] = [];
    if (item.accommodation_images) {
      image_list = await setImageArray(item.accommodation_images);
    } else if (item.restaurant_images) {
      image_list = await setImageArray(item.restaurant_images);
    }
    list.push({
      ...item,
      image_list,
    });
  }

  return {
    props: {
      list: list,
    },
  };
}

export default UserRecent;
