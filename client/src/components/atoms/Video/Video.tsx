import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '@/store/reducer';

interface Props {
  videoBuffer: ArrayBuffer;
}

const Video: React.FC<Props> = ({ videoBuffer }) => {
  return (
    <video
      controls
      src={
        videoBuffer &&
        URL.createObjectURL(new Blob([videoBuffer], { type: 'video/mp4' }))
      }
    />
  );
};

export default connect((state: RootState) => ({
  videoBuffer: state.originalVideo.video,
}))(Video);
