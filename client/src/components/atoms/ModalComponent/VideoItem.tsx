import React from 'react';
import styled from 'styled-components';

import { Video } from '@/store/video/actions';
import color from '@/theme/colors';
import { parseDateString } from '@/utils/time';

const StyledModalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${color.BORDER};
  font-size: 13px;
  ${({ isChecked }) =>
    `background-color: ${
      isChecked ? `${color.DARK_PURPLE}` : `${color.MODAL}`
    };`}

  &:hover {
    background-color: ${color.BORDER};
  }
`;

const StyledDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 0 1rem;
`;

const Image = styled.img`
  width: 2.5rem;
  height: 2rem;
`;
const NameDiv = styled.div`
  width: 70%;
  margin-left: 1rem;
`;

const Name = styled.p`
  white-space: nowrap;
`;

const Timestamp = styled.p`
  font-size: 12px;
  white-space: nowrap;
`;

interface Props {
  video: Video;
  selected: Video;
  handleCheck: Function;
}

const VideoItem: React.FC<Props> = ({ video, handleCheck, selected }) => {
  return (
    <StyledModalRow
      onClick={() => handleCheck(video)}
      isChecked={selected === video}
    >
      <StyledDiv>
        <Image src="https://user-images.githubusercontent.com/49153756/99666210-03b80600-2aae-11eb-95b9-f61f52694708.png" />
        <NameDiv>
          <Name>{video.name}</Name>
        </NameDiv>
        <Timestamp>{parseDateString(new Date(), video.updatedAt)}</Timestamp>
      </StyledDiv>
    </StyledModalRow>
  );
};

export default React.memo(VideoItem);
