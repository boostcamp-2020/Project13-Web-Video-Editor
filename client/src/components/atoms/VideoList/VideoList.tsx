import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { getVideos } from '@/store/selectors';
import color from '@/theme/colors';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid ${color.BORDER};
  background-color: ${color.BLACK};
`;

const VideoItem = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${color.BORDER};
  background-color: ${color.BLACK};
`;

const VideoList: React.FC = () => {
  const videos = useSelector(getVideos);

  return (
    <StyledDiv>
      {videos.map(video => (
        <VideoItem />
      ))}
    </StyledDiv>
  );
};

export default VideoList;
