import React from 'react';
import { connect } from 'react-redux';

import { RootState } from '@/store/reducer';
import WebglControler from '@/webgl/webglControler';

interface Props {
  videoBuffer: ArrayBuffer;
}

const Video: React.FC<Props> = ({ videoBuffer }) => {
  let webglControler;
  if (videoBuffer) {
    webglControler = new WebglControler(URL.createObjectURL(new Blob([videoBuffer], { type: 'video/mp4' })));
    webglControler.main();
  }

  const rotateLeft90Degree = () => {
    webglControler.rotateLeft90Degree();
  };

  const rotateRight90Degree = () => {
    webglControler.rotateRight90Degree();
  };

  const reverseUpsideDown = () => {
    webglControler.reverseUpsideDown();
  };

  const reverseSideToSide = () => {
    webglControler.reverseSideToSide();
  };

  const enlarge = () => {
    webglControler.enlarge();
  };

  const reduce = () => {
    webglControler.reduce();
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
