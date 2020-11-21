import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '@/store/reducer';

const StyledVideo = styled.video`
  display: none;
`;

interface Props {
  videoBuffer: ArrayBuffer;
}

const Video: React.FC<Props> = ({ videoBuffer }) => {
  return (
    <>
      <StyledVideo
        controls
        src={
          videoBuffer &&
          URL.createObjectURL(new Blob([videoBuffer], { type: 'video/mp4' }))
        }
      />
    </>
  );
};

export default connect((state: RootState) => ({
  videoBuffer: state.originalVideo.video,
}))(Video);
