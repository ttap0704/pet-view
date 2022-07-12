import { Box, styled } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { ModalContext } from '../../provider/ModalProvider';
import { RootState } from '../../store';
import { fetchGetApi } from '../../utils/api';
import { handleLike, saveLikes } from '../../utils/tools';

const ButtonBox = styled(Box)(({ theme }) => ({
  svg: {
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',

    '&.active': {
      color: theme.palette.orange.main,
    },
  },
}));

interface ButtonLikeProps {
  targetId: number;
  category: string;
  categoryId: number;
}

const ButtonLike = (props: ButtonLikeProps) => {
  const uid = useSelector((state: RootState) => state.userReducer.uid);
  const { modal_alert } = useContext(ModalContext);

  const category = props.category;
  const target_id = props.targetId;
  const category_id = props.categoryId;

  const [likes, setLikes] = useState<{ [key: string]: number[] }>({});

  useEffect(() => {
    const session = window.sessionStorage;
    const sesson_likes = session.getItem('likes');
    if (sesson_likes) {
      const sesson_likes_json = JSON.parse(sesson_likes);
      if (sesson_likes_json) {
        setLikes(sesson_likes_json);
      }
    }
  }, []);

  const likeProduct = async () => {
    if (uid > 0) {
      const like_res = await handleLike(uid, category_id, target_id, true);
      if (like_res) {
        const get_res: { [key: string]: number[] } = await fetchGetApi(`/users/${uid}/like-product`);
        modal_alert.openModalAlert('성공적으로 좋아요를 눌렀습니다!');
        saveLikes(get_res);

        const tmp_likes = { ...likes };
        if (tmp_likes[category]) {
          tmp_likes[category] = [...tmp_likes[category], target_id];
        } else {
          tmp_likes[category] = [target_id];
        }

        setLikes({ ...tmp_likes });
      } else {
        modal_alert.openModalAlert('오류로 인해 실패하였습니다.\r\n다시 시도해주세요.');
      }
    } else {
      modal_alert.openModalAlert('로그인 후 눌러주세요!');
    }
  };

  const cancelLikeProduct = async () => {
    if (uid > 0) {
      const like_res = await handleLike(uid, category_id, target_id, false);
      if (like_res) {
        const get_res: { [key: string]: number[] } = await fetchGetApi(`/users/${uid}/like-product`);
        modal_alert.openModalAlert('성공적으로 좋아요를 취소하였습니다.');
        saveLikes(get_res);
        console.log(get_res);

        const tmp_likes = { ...likes };
        if (tmp_likes[category]) {
          const find_idx = tmp_likes[category].findIndex(item => item == target_id);

          if (Number(find_idx) >= 0) {
            tmp_likes[category].splice(find_idx, 1);
          }
        }
        setLikes({ ...tmp_likes });
      } else {
        modal_alert.openModalAlert('오류로 인해 실패하였습니다.\r\n다시 시도해주세요.');
      }
    } else {
      modal_alert.openModalAlert('로그인 후 눌러주세요!');
    }
  };

  return (
    <ButtonBox>
      {likes[category] && likes[category].includes(target_id) ? (
        <AiFillHeart onClick={cancelLikeProduct} className='active' />
      ) : (
        <AiOutlineHeart onClick={likeProduct} />
      )}
    </ButtonBox>
  );
};

export default ButtonLike;
