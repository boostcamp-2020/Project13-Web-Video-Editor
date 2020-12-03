import React from 'react';
import styled from 'styled-components';

import { Video } from '@/store/video/actions';
import color from '@/theme/colors';
import { parseDateString } from '@/utils/time';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid ${color.BORDER};
  ${({ isChecked }) =>
    `background-color: ${
      isChecked ? `${color.DARK_PURPLE}` : `${color.MODAL}`
    };`}

  &:hover {
    background-color: ${color.BORDER};
  }
`;

const Image = styled.img`
  width: 2.5rem;
  height: 2rem;
`;

const Name = styled.p``;

const Timestamp = styled.p``;

interface Props {
  video: Video;
  selected: Video;
  handleCheck: Function;
}

const VideoItem: React.FC<Props> = ({ video, handleCheck, selected }) => {
  return (
    <StyledDiv
      onClick={() => handleCheck(video)}
      isChecked={selected === video}
    >
      <Image src="https://user-images.githubusercontent.com/49153756/99666210-03b80600-2aae-11eb-95b9-f61f52694708.png" />
      <Name>{video.name}</Name>
      <Timestamp>{parseDateString(new Date(), video.updatedAt)}</Timestamp>
    </StyledDiv>
  );
};

export default VideoItem;
