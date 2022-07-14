import { Box, IconButton, OutlinedInput, styled, Typography } from '@mui/material';
import React, { Fragment, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiChevronDown, HiChevronUp, HiOutlineDotsVertical } from 'react-icons/hi';
import { FiPlusCircle } from 'react-icons/fi';
import { BsPlusCircleFill } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import Button from '../src/components/button/Button';
import UtilBox from '../src/components/common/UtilBox';
import Textarea from '../src/components/textarea/Textarea';
import { setFileToImage, setImageArray, setImageFormData, report_reasons } from '../src/utils/tools';
import { fetchFileApi, fetchPostApi } from '../src/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { ModalContext } from '../src/provider/ModalProvider';
import { fetchGetApi } from '../src/utils/api_back';
import InputOutlined from '../src/components/input/InputOutlined';
import DropdownMenu from '../src/components/common/DropdownMenu';
import ModalRadio from '../src/components/modal/ModalRadio';
import DrawerDefault from '../src/components/drawer/DrawerDefault';
import { startProgress, stopProgress } from '../src/store/slices/progress';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MdPets } from 'react-icons/md';
import InputTemporary from '../src/components/input/InputTemporary';

const DailyContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  position: 'relative',

  '.close_icon': {
    width: '1.5rem',
    height: '1.5rem',
    cursor: 'pointer',
    color: theme.palette.gray_4.main,
  },
}));

const DailyRegistraionBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '60rem',
  height: 'auto',
  borderColor: theme.palette.gray_4.main,
  padding: '1rem',
  margin: '0 auto',

  h3: {
    padding: '0.5rem 0',
  },
}));

const DailyListBox = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '3rem',
  height: 'auto',
  border: '1px solid',
  borderColor: theme.palette.gray_4.main,
  borderRadius: 12,
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  cursor: 'pointer',

  input: {
    cursor: 'text',
  },

  '&.slide': {
    '.contents': {
      maxHeight: 'unset',
      overflow: 'hidden',
      textOverflow: 'unset',
      display: 'block',
    },
  },

  '.contents': {
    width: '100%',
    maxHeight: '3rem',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
}));

const ProfileBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  position: 'relative',

  '& > div': {
    width: '2.5rem',
    height: '2.5rem',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: '50%',
    position: 'relative',
    border: '1px solid',
    borderColor: theme.palette.gray_4.main,
    '.default_profile': {
      '&.daily': {
        width: '1.3rem',
        height: '1.3rem',
      },
      '&.comment': {
        width: '1.1rem',
        height: '1.1rem',
      },

      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },

  '& > span': {
    fontSize: '1.25rem',
  },

  '&.comment': {
    '& > div': {
      width: '2rem',
      height: '2rem',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      borderRadius: '50%',
    },

    '& > span': {
      fontSize: '1rem',
    },
  },
}));

const PhotosContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '6rem',
  padding: '1rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  flexWrap: 'wrap',
  overflow: 'hidden',
  '&.regi': {
    gap: '0.75rem',

    '& > div': {
      border: '1px solid',
      borderColor: theme.palette.gray_3.main,
      overflow: 'visible',
    },
  },

  '&.slide': {
    flexWrap: 'wrap',
    '& > div': {
      height: 'auto',
      '& > img': {
        height: 'auto',
        width: '100%',
      },
      [theme.breakpoints.up('xl')]: {
        width: '49%',
      },
      [theme.breakpoints.down('xl')]: {
        width: '49%',
      },
      [theme.breakpoints.down('xsm')]: {
        width: '99%',
      },
    },
  },

  '& > div': {
    cursor: 'pointer',
    width: '5rem',
    minWidth: '5rem',
    height: '5rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    borderRadius: '12px',

    '& > img': {
      height: '100%',
    },

    '.empty': {
      fontSize: '0.75rem',
      textAlign: 'center',
      color: theme.palette.gray_3.main,
    },

    '& > svg': {
      width: '1.5rem',
      height: '1.5rem',
      position: 'absolute',
      top: '-0.75rem',
      right: '-0.75rem',
      color: theme.palette.orange.main,
      zIndex: 1,
    },
  },

  '& > svg': {
    width: '2.5rem',
    height: '2.5rem',
    color: theme.palette.gray_4.main,
    cursor: 'pointer',
  },
}));

const ProfileButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',

  '&.comment': {
    padding: '4px',
    width: '1.5rem',
    height: '1.5rem',
  },
}));

const CommentContainer = styled(Box)(({ theme }) => ({
  h3: {
    padding: '8px 0',
  },
  '.input_box': {
    display: 'flex',
    gap: '1rem',
  },
}));

const CommentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',

  h4: {
    color: theme.palette.black.main,
    fontWeight: '400 !important',
    fontSize: '0.75rem',
  },

  '.contents': {
    fontSize: '1rem',
  },
}));

const RegistrationDailyButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  width: '4rem',
  height: '4rem',
  zIndex: 1,
  backgroundColor: theme.palette.white.main,
  padding: 0,
  svg: {
    width: '4rem',
    height: '4rem',
    color: theme.palette.orange.main,
  },

  '&.mobile': {
    bottom: '5rem',
    right: '1rem',
  },

  '&.pc': {
    right: '2rem',
    bottom: '1rem',
  },
}));

interface DailyListType extends DailyType {
  slide: boolean;
  photo_list: ImageListType[];
  comment: CommentType[];
}

const Daily = () => {
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const { modal_alert, modal_confirm } = useContext(ModalContext);

  const [contents, setContents] = useState('');
  const [photoList, setPhotoList] = useState<ImageListType[]>([]);
  const [regi, setRegi] = useState(false);
  const [dailyList, setDailyList] = useState<DailyListType[]>([]);
  const [comment, setComment] = useState<{ [key: string]: string }>({});
  const [dropdownElement, setDropdownElement] = useState<null | HTMLElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownContents, setDropdownContents] = useState(['신고하기']);
  const [selectedCommentId, setSelectedCommentId] = useState(0);
  const [targetCommentIdx, setTargetCommentIdx] = useState(0);
  const [targetDailyIdx, setTargetDailyIdx] = useState(0);
  const [radioContents, setRadioContents] = useState<RadioModalContentsDataType>({
    visible: false,
    title: '신고 사유',
    contents: [],
  });
  const [commentObject, setCommentObject] = useState<{ [key: string]: string }>({});

  const cur_page = useRef(1);
  const has_more = useRef(true);
  const daily_list = useRef<DailyListType[]>([]);

  useEffect(() => {
    getDailyList(1);
    setRadioContents({
      ...radioContents,
      contents: [...report_reasons],
    });

    const addDailyContents = () => {
      if (
        window.scrollY + window.innerHeight >= document.body.getBoundingClientRect().height - 20 &&
        has_more.current
      ) {
        has_more.current = false;
        getDailyList(cur_page.current + 1);
      }
    };

    window.addEventListener('scroll', addDailyContents);

    return () => {
      window.removeEventListener('scroll', addDailyContents);
      setDailyList([]);
      clearContents();
    };
  }, []);

  useEffect(() => {
    dispatch(stopProgress());
  }, [dailyList]);

  const getDailyList = async (page: number, reset?: boolean) => {
    cur_page.current = page;
    if (page > 1) {
      dispatch(startProgress());
    }
    const list: DailyType[] = await fetchGetApi(`/daily?page=${cur_page.current}`);
    const tmp_list = reset ? [] : [...daily_list.current];
    for (const item of list) {
      const file_names = item.image_list.map(item => ({ file_name: item.file_name }));
      tmp_list.push({
        ...item,
        slide: false,
        photo_list: await setImageArray(file_names),
        comment: [],
      });
    }

    setDailyList([...tmp_list]);
    daily_list.current = [...tmp_list];
    if (list.length < 5) {
      has_more.current = false;
    } else {
      has_more.current = true;
    }
  };

  const setSlide = async (idx: number) => {
    const tmp_list = [...dailyList];
    const target_id = tmp_list[idx].id;

    await getComments(target_id, idx, true, false);

    tmp_list[idx].slide = !tmp_list[idx].slide;
    setDailyList([...tmp_list]);
  };

  const onClickPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const setPhoto = () => {
    const el = document.getElementById('photos');
    if (el) {
      el.click();
    }
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const cur_files = await setFileToImage(files, []);

      setPhotoList([...photoList, ...cur_files]);
    }
  };

  const deletePhoto = (idx: number) => {
    const tmp_photos = [...photoList];
    tmp_photos.splice(idx, 1);
    setPhotoList([...tmp_photos]);
  };

  const openRegistraionFrom = () => {
    if (!user.uid) {
      modal_alert.openModalAlert('로그인 후 공유가 가능합니다.');
    } else {
      setRegi(true);
    }
  };

  const getComments = async (target_id: number, idx: number, click: boolean, skip: boolean) => {
    const tmp_daily_list = [...dailyList];

    if ((click && tmp_daily_list[idx].comment.length == 0) || !click) {
      let url = `/comment/category/50/target/${target_id}`;
      if (skip) {
        url += `?skip=${tmp_daily_list[idx].comment.length}`;
      }
      const cur_comments = await fetchGetApi(url);

      tmp_daily_list[idx].comment = [...tmp_daily_list[idx].comment, ...cur_comments];

      setDailyList([...tmp_daily_list]);
    }
  };

  const createDaily = async () => {
    const create_data = {
      contents,
      writer_id: user.uid,
    };
    const create_res: DailyType = await fetchPostApi('/daily', create_data);

    if (create_res.writer_id) {
      const images_data: { target_id: number; files: File[] }[] = [{ target_id: create_res.id, files: [] }];
      if (photoList.length > 0) {
        for (const photo of photoList) {
          if (photo.file) {
            images_data[0].files.push(photo.file);
          }
        }

        const upload_images = await setImageFormData(images_data, 'daily');
        const upload_res = await fetchFileApi('/upload/image', upload_images);
      }

      if (create_res || photoList.length == 0) {
        clearContents();
        getDailyList(1, true);
        modal_alert.openModalAlert('일상이 성공적으로 공유되었습니다!', true);
      } else {
        modal_alert.openModalAlert('오류로 인해 공유가 실패되었습니다.\r\n다시 시도해주세요.');
      }
    } else {
      modal_alert.openModalAlert('오류로 인해 공유가 실패되었습니다.\r\n다시 시도해주세요.');
    }
  };

  const handleComment = (value: string, idx: number) => {
    // const tmp_comment_obj = { ...commentObject };
    // tmp_comment_obj[`${idx}`] = value;
    // setCommentObject({ ...tmp_comment_obj });
    const tmp_comment = { ...comment };
    tmp_comment[idx] = value;
    setComment({ ...tmp_comment });
  };

  const clearContents = () => {
    setContents('');
    setRegi(false);
    setPhotoList([]);
  };

  const createComment = async (idx: number) => {
    if (!user.uid) {
      modal_alert.openModalAlert('로그인 후 댓글을 작성해주세요.');
      return;
    }
    if (comment[idx]) {
      const data = {
        comment: comment[idx],
        writer_id: user.uid,
        target_id: dailyList[idx].id,
        category: 50,
      };

      const create_res = await fetchPostApi('/comment', data);
      if (create_res.id) {
        const tmp_comment = { ...comment };
        tmp_comment[idx] = '';
        setComment({ ...tmp_comment });
        getComments(dailyList[idx].id, idx, false, true);
        modal_alert.openModalAlert('댓글이 성공적으로 등록되었습니다!', true);
      } else {
        modal_alert.openModalAlert('오류로 인해 등록이 실패되었습니다.\r\n다시 시도해주세요.');
      }
    } else {
      modal_alert.openModalAlert('댓글을 작성 후 등록해주세요.');
    }
  };

  const openReportModal = (daily_idx: number) => {
    setTargetDailyIdx(daily_idx);
    setRadioContents({ ...radioContents, visible: true });
  };

  const openCommentDropdown = (
    e: React.MouseEvent<HTMLElement>,
    uid: number,
    comment_id: number,
    comment_idx: number,
    daily_idx: number,
  ) => {
    setDropdownElement(e.currentTarget);
    setSelectedCommentId(comment_id);
    setTargetCommentIdx(comment_idx);
    setTargetDailyIdx(daily_idx);
    setDropdownOpen(true);

    const dropdown_contents = ['신고하기'];
    if (user.uid == uid) {
      dropdown_contents.push('삭제하기');
    }
    setDropdownContents([...dropdown_contents]);
  };

  const handleCommentDropdown = (idx: number) => {
    if (idx == 0) {
      setRadioContents({ ...radioContents, visible: true });
    } else if (idx == 1) {
      modal_confirm.openModalConfirm('이 댓글을 삭제하시겠습니까?', async () => {
        const delete_res = await fetchPostApi(`/comment/${selectedCommentId}/delete`, {});

        if (delete_res) {
          const tmp_daily_list = [...dailyList];
          tmp_daily_list[targetDailyIdx].comment.splice(targetCommentIdx, 1);
          setDailyList([...tmp_daily_list]);

          modal_alert.openModalAlert('댓글이 삭제되었습니다.');
        }
      });
    }
  };

  const sendReport = async (data: { label: string; id: number | string }) => {
    const report_data: {
      target_id: number;
      category: number;
      reason: number;
      reporter?: number;
    } = {
      target_id: dropdownOpen ? dailyList[targetDailyIdx].comment[targetCommentIdx].id : dailyList[targetDailyIdx].id,
      category: dropdownOpen ? 60 : 50,
      reason: Number(data.id),
    };
    if (user.uid) {
      report_data['reporter'] = Number(user.uid);
    }

    const send_res = await fetchPostApi(`/report`, report_data);
    if (send_res.id > 0) {
      clearRadioContents();
      clearDropdown();
      modal_alert.openModalAlert('신고가 접수되었습니다.');
    } else {
      modal_alert.openModalAlert('오류로 인해 공유가 실패되었습니다.\r\n다시 시도해주세요.');
    }
  };

  const clearRadioContents = () => {
    setRadioContents({
      ...radioContents,
      visible: false,
    });
  };

  const clearDropdown = () => {
    setDropdownElement(null);
    setDropdownOpen(false);
  };

  return (
    <DailyContainer>
      <RegistrationDailyButton className={user.is_mobile ? 'mobile' : 'pc'} disableRipple onClick={openRegistraionFrom}>
        <BsPlusCircleFill />
      </RegistrationDailyButton>
      <DrawerDefault open={regi} anchor='top' onClose={clearContents}>
        <DailyRegistraionBox>
          <Typography component='h3'>일상 공유하기</Typography>
          <Textarea
            value={contents}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContents(e.target.value)}
            placeholder='공유하고픈 일상을 적어주세요.'
          />
          <PhotosContainer className='regi'>
            {photoList.length > 0 ? (
              photoList.map((image, image_idx) => {
                return (
                  <Box
                    sx={{
                      backgroundImage: `url('${image.src}')`,
                    }}
                    key={`registration_daily_photo_${image_idx}`}
                    onClick={(e: React.MouseEvent) => onClickPhoto(e)}
                  >
                    <AiFillCloseCircle onClick={() => deletePhoto(image_idx)} />
                  </Box>
                );
              })
            ) : (
              <Box>
                <Typography className='empty'>
                  이미지를 <br />
                  등록해주세요.
                </Typography>
              </Box>
            )}

            <FiPlusCircle onClick={setPhoto} />
            <input type='file' onChange={handleFiles} id='photos' name='photos' multiple={true}></input>
          </PhotosContainer>
          <UtilBox justifyContent='center' sx={{ height: 'auto' }}>
            <Button variant='contained' onClick={createDaily}>
              등록하기
            </Button>
          </UtilBox>
        </DailyRegistraionBox>
      </DrawerDefault>
      {/* <InfiniteScroll
        dataLength={dailyList.length}
        next={() => getDailyList(cur_page.current + 1)}
        hasMore={true}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      > */}
      {dailyList.map((daily, daily_idx) => {
        return (
          <DailyListBox key={`daily_list_${daily_idx}`} className={daily.slide ? 'slide' : ''}>
            <ProfileBox onClick={() => setSlide(daily_idx)}>
              <Box
                sx={{ backgroundImage: daily.profile_path ? `url(http://localhost:3080${daily.profile_path})` : '' }}
              >
                {!daily.profile_path ? <MdPets className='default_profile daily' /> : null}
              </Box>
              <Typography component='span'>{daily.nickname}</Typography>
              <ProfileButton>{daily.slide ? <HiChevronUp /> : <HiChevronDown />}</ProfileButton>
            </ProfileBox>
            <Typography className='contents' onClick={() => setSlide(daily_idx)}>
              {daily.contents}
            </Typography>
            {daily.photo_list && daily.photo_list.length > 0 ? (
              <PhotosContainer className={daily.slide ? 'slide' : ''} onClick={() => setSlide(daily_idx)}>
                {daily.photo_list.map((image, image_idx) => {
                  return (
                    <Box
                      key={`daily_${daily_idx}_photo_${image_idx}`}
                      onClick={(e: React.MouseEvent) => onClickPhoto(e)}
                    >
                      <Box component='img' src={`http://localhost:3080/images/daily/${image.src}`} />
                    </Box>
                  );
                })}
              </PhotosContainer>
            ) : null}
            {daily.slide ? (
              <CommentContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '8px' }}>
                  <Button
                    variant='text'
                    color='gray_1'
                    sx={{ fontSize: '0.9rem' }}
                    disableRipple
                    onClick={() => {
                      openReportModal(daily_idx);
                    }}
                  >
                    신고하기
                  </Button>
                </Box>
                <Typography component='h3'>댓글</Typography>
                <Box className='input_box'>
                  <InputTemporary
                    sx={{ curosr: 'text' }}
                    onSubmit={(value: string) => handleComment(value, daily_idx)}
                  />
                  {/* <InputOutlined
                    placeholder=''
                    value={comment[daily_idx] ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleComment(e.target.value, daily_idx)}
                  /> */}
                  <Button variant='contained' color='orange' onClick={() => createComment(daily_idx)}>
                    등록
                  </Button>
                </Box>
                <CommentWrapper>
                  {daily.comment.length == 0 ? (
                    <Typography component='h4'>댓글을 작성해주세요!</Typography>
                  ) : (
                    daily.comment.map((item, item_idx) => {
                      return (
                        <Fragment key={`daily_${daily_idx}_comment_${item_idx}`}>
                          <ProfileBox className='comment'>
                            <Box sx={{ backgroundImage: `url(http://localhost:3080${item.profile_path})` }}>
                              {!item.profile_path ? <MdPets className='default_profile comment' /> : null}
                            </Box>
                            <Typography component='span'>{item.nickname}</Typography>
                            <ProfileButton
                              className='comment'
                              onClick={(e: React.MouseEvent<HTMLElement>) => {
                                openCommentDropdown(e, item.writer_id, item.id, item_idx, daily_idx);
                              }}
                            >
                              <HiOutlineDotsVertical />
                            </ProfileButton>
                          </ProfileBox>
                          <Typography className='contents'>{item.comment}</Typography>
                        </Fragment>
                      );
                    })
                  )}
                </CommentWrapper>
              </CommentContainer>
            ) : null}
          </DailyListBox>
        );
      })}
      {/* </InfiniteScroll> */}

      <DropdownMenu
        open={dropdownOpen}
        anchorEl={dropdownElement}
        onClose={() => setDropdownOpen(false)}
        onClick={handleCommentDropdown}
        items={dropdownContents}
      />
      <ModalRadio
        visible={radioContents.visible}
        title={radioContents.title}
        contents={radioContents.contents}
        onClose={() => setRadioContents({ ...radioContents, visible: false })}
        onCompleteUpdate={sendReport}
        buttonTitle='접수'
        useConfirm={false}
      />
    </DailyContainer>
  );
};

export default Daily;
