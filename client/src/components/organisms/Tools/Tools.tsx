import React, { useState } from 'react';
import styled from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillPlayFill,
  BsFillPauseFill,
} from 'react-icons/bs';
import { RiScissorsLine } from 'react-icons/ri';
import webglController from '@/webgl/webglController';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import UploadArea from '@/components/molecules/UploadArea';
import size from '@/theme/sizes';
import video from '@/video';
import {
  play as playAction,
  pause,
  moveTo,
} from '@/store/currentVideo/actions';
import { getStartEnd } from '@/store/selectors';

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
    message: '',
    type: 'transparent',
    children: <BsFillSkipStartFill size={size.BIG_ICON_SIZE} />,
  },
  {
    onClick: playPauseVideo,
    message: '',
    type: 'transparent',
    children: play ? (
      <BsFillPlayFill size={size.BIG_ICON_SIZE} />
    ) : (
      <BsFillPauseFill size={size.BIG_ICON_SIZE} />
    ),
  },
  {
    onClick: forwardVideo,
    message: '',
    type: 'transparent',
    children: <BsFillSkipEndFill size={size.BIG_ICON_SIZE} />,
  },
];

const getEditToolsData = (
  rotateLeft90Degree: () => void,
  rotateRight90Degree: () => void,
  reverseUpsideDown: () => void,
  reverseSideToSide: () => void,
  enlarge: () => void,
  reduce: () => void,
  crop: () => void
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
  {
    onClick: crop,
    message: 'crop',
    type: 'transparent',
    children: <RiScissorsLine size={size.ICON_SIZE} />,
  },
];

const EditTool = styled(ButtonGroup)``;
const VideoTool = styled(ButtonGroup)``;

const Tools: React.FC = () => {
  const [play, setPlay] = useState(true); // Fix 스토어로 등록
  const dispatch = useDispatch();

  const { start, end } = useSelector(getStartEnd, shallowEqual);

  const backwardVideo = () => {
    const dstTime = Math.max(video.get('currentTime') - 10, start);

    video.setCurrentTime(dstTime);
    dispatch(moveTo(dstTime));
  };

  const forwardVideo = () => {
    const dstTime = Math.min(video.get('currentTime') + 10, end);

    video.setCurrentTime(dstTime);
    dispatch(moveTo(dstTime));
  };

  const playPauseVideo = () => {
    if (play) {
      video.play();
      dispatch(playAction());
    } else {
      video.pause();
      dispatch(pause());
    }

    setPlay(!play);
  };

  document.onkeydown = (event: KeyboardEvent) => {
    (document.activeElement as HTMLButtonElement).blur();

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
  const crop = () => {
    // crop
  };

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
          reduce,
          crop
        )}
      />
      <UploadArea />
    </StyledDiv>
  );
};

export default Tools;
