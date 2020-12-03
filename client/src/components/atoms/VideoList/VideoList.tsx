import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { fetchListStart } from '@/store/video/actions';
import { getVideos } from '@/store/selectors';
import color from '@/theme/colors';
import VideoItem from './VideoItem';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${color.MODAL};
  border-radius: 12px 12px 0 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${color.BORDER};
  padding: 10px;
`;

const List = styled.div`
  height: 50vh;
  overflow-y: auto;
`;

const VideoList: React.FC = () => {
  const [selected, setSelected] = useState(null);
  const videos = useSelector(getVideos);
  const dispatch = useDispatch();

  const handleCheck = video => setSelected(video);

  useEffect(() => {
    if (!videos) dispatch(fetchListStart());
  }, [videos]);

  return (
    <StyledDiv>
      <Header>Video List</Header>
      <List>
        {videos?.map(video => (
          <VideoItem
            key={video.name}
            video={video}
            handleCheck={handleCheck}
            selected={selected}
          />
        ))}
      </List>
    </StyledDiv>
  );
};

export default VideoList;
