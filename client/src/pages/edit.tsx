import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import TimeLine from '@/components/organisms/TimeLine';
import Header from '@/components/organisms/Header';
import Tools from '@/components/organisms/Tools';
import VideoContainer from '@/components/organisms/VideoContainer';
import Loading from '@/components/atoms/Loading';
import { fetchListStart } from '@/store/video/actions';
import { getMessage, getVideos } from '@/store/selectors';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
`;

const BottomDiv = styled.div``;

const EditPage: React.FC = () => {
  const message = useSelector(getMessage);
  const videos = useSelector(getVideos);
  const dispatch = useDispatch();
  const [isEdit, setEdit] = useState('');

  useEffect(() => {
    if (!videos) dispatch(fetchListStart());
  }, [videos]);

  return (
    <StyledDiv>
      {message && <Loading message={message} />}
      <Header />
      <VideoContainer isEdit={isEdit} />
      <BottomDiv>
        <Tools setEdit={setEdit} isEdit={isEdit} />
        <TimeLine />
      </BottomDiv>
    </StyledDiv>
  );
};

export default React.memo(EditPage);
