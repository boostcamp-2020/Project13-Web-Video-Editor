import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '@/store/reducer';
import WebglController from '@/webgl/webglController';

interface Props {
  videoBuffer: ArrayBuffer;
}

const Video: React.FC<Props> = ({ videoBuffer }) => {
  let webglController;
  if (videoBuffer) {
    webglController = new WebglController(URL.createObjectURL(new Blob([videoBuffer], { type: 'video/mp4' })));
    webglController.main();
  }

  const rotateLeft90Degree = () => {
    webglController.rotateLeft90Degree();
  };

  const rotateRight90Degree = () => {
    webglController.rotateRight90Degree();
  };

  const reverseUpsideDown = () => {
    webglController.reverseUpsideDown();
  };

  const reverseSideToSide = () => {
    webglController.reverseSideToSide();
  };

  const enlarge = () => {
    webglController.enlarge();
  };

  const reduce = () => {
    webglController.reduce();
  };

  return (
    <>
      <video
        controls
        src={
          videoBuffer &&
          URL.createObjectURL(new Blob([videoBuffer], { type: 'video/mp4' }))
        }
        style={{ display: "none" }}
      />
      <button onClick={rotateLeft90Degree}>Left 90'</button>
      <button onClick={rotateRight90Degree}>Right 90'</button>
      <button onClick={reverseUpsideDown}>Up to Down</button>
      <button onClick={reverseSideToSide}>Side to Side</button>
      <button onClick={enlarge}>enlarge</button>
      <button onClick={reduce}>reduce</button>
    </>
  );
};

export default connect((state: RootState) => ({
  videoBuffer: state.originalVideo.video,
}))(Video);
