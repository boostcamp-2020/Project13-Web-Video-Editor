import React, { useState } from 'react';
import styled from 'styled-components';
import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillPlayFill,
  BsFillPauseFill,
} from 'react-icons/bs';

import webglController from '@/webgl/webglController';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import UploadArea from '@/components/molecules/UploadArea';
import size from '@/theme/sizes';
import video from '@/video';

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

interface button {
  onClick: () => void;
  message: string;
  type: 'default' | 'transparent';
  children: React.ReactChild;
}

const getVideoToolsData = (
  backwardVideo: () => void,
  playPauseVideo: () => void,
  forwardVideo: () => void,
  play: boolean
): button[] => [
  {
    onClick: backwardVideo,
    message: 'Backward Video',
    type: 'transparent',
    children: <BsFillSkipStartFill size={size.ICON_SIZE} />,
  },
  {
    onClick: playPauseVideo,
    message: 'Play Pause Video',
    type: 'transparent',
    children: play ? (
      <BsFillPlayFill size={size.ICON_SIZE} />
    ) : (
      <BsFillPauseFill size={size.ICON_SIZE} />
    ),
  },
  {
    onClick: forwardVideo,
    message: 'Forward Video',
    type: 'transparent',
    children: <BsFillSkipEndFill size={size.ICON_SIZE} />,
  },
];

const getEditToolsData = (
  rotateLeft90Degree: () => void,
  rotateRight90Degree: () => void,
  reverseUpsideDown: () => void,
  reverseSideToSide: () => void,
  enlarge: () => void,
  reduce: () => void
): button[] => [
  {
    onClick: rotateLeft90Degree,
    message: "Left 90'",
    type: 'transparent',
    children: null,
  },
  {
    onClick: rotateRight90Degree,
    message: "Right 90'",
    type: 'transparent',
    children: null,
  },
  {
    onClick: reverseUpsideDown,
    message: 'Up to Down',
    type: 'transparent',
    children: null,
  },
  {
    onClick: reverseSideToSide,
    message: 'Side to Side',
    type: 'transparent',
    children: null,
  },
  { onClick: enlarge, message: 'enlarge', type: 'transparent', children: null },
  { onClick: reduce, message: 'reduce', type: 'transparent', children: null },
];

const EditTool = styled(ButtonGroup)``;
const VideoTool = styled(ButtonGroup)``;

const Tools: React.FC = () => {
  const [play, setPlay] = useState(true); // Fix 스토어로 등록

  const backwardVideo = () => video.setCurrentTime(video.getCurrentTime() - 10);
  const forwardVideo = () => video.setCurrentTime(video.getCurrentTime() + 10);

  const playPauseVideo = () => {
    video[play ? 'play' : 'pause']();

    setPlay(!play);
  };

  document.onkeydown = event => {
    switch (event.code) {
      case 'ArrowLeft':
        backwardVideo();
        break;
      case 'Space':
        playPauseVideo();
        break;
      case 'ArrowRight':
        forwardVideo();
        break;
      default:
        break;
    }
  };

  const rotateLeft90Degree = () => webglController.rotateLeft90Degree();
  const rotateRight90Degree = () => webglController.rotateRight90Degree();
  const reverseUpsideDown = () => webglController.reverseUpsideDown();
  const reverseSideToSide = () => webglController.reverseSideToSide();
  const enlarge = () => webglController.enlarge();
  const reduce = () => webglController.reduce();

  return (
    <StyledDiv>
      <VideoTool
        buttonData={getVideoToolsData(
          backwardVideo,
          playPauseVideo,
          forwardVideo,
          play
        )}
      />
      <EditTool
        buttonData={getEditToolsData(
          rotateLeft90Degree,
          rotateRight90Degree,
          reverseUpsideDown,
          reverseSideToSide,
          enlarge,
          reduce
        )}
      />
      <UploadArea />
    </StyledDiv>
  );
};

export default Tools;
