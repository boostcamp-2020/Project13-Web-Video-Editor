import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { getVideos } from '@/store/selectors';
import { Video } from '@/store/video/actions';
import color from '@/theme/colors';

import Props from './props';
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

const VideoList: React.FC<Props<Video>> = ({
  state: selected,
  setState: setSelected,
}) => {
  const videos = useSelector(getVideos);
  const handleCheck = video => setSelected(video);

  return (
    <StyledDiv>
      <Header>Video List</Header>
      <List>
        {videos?.map(video => (
          <VideoItem
            key={uuidv4()}
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
