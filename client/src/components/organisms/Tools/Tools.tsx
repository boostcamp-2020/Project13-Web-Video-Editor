import React, { useState, useReducer } from 'react';
import styled from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillPlayFill,
  BsFillPauseFill,
  BsAspectRatio,
} from 'react-icons/bs';
import { RiScissorsLine } from 'react-icons/ri';
import { MdScreenRotation } from 'react-icons/md';

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
import { cropStart, cropCancel, cropConfirm } from '@/store/actionTypes';

import reducer, { initialData, ButtonData, ButtonDataAction } from './reducer';

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem;
  height: 10rem;
`;

const StyledEditToolDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditTool = styled(ButtonGroup)`
  width: 20rem;
`;
const SubEditTool = styled(ButtonGroup)`
  width: 25rem;
`;
const VideoTool = styled(ButtonGroup)``;

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

const getEditToolData = (
  rotateReverse: () => void,
  ratio: () => void,
  crop: () => void
): button[] => [
  {
    onClick: rotateReverse,
    message: '회전 / 반전',
    type: 'transparent',
    children: <MdScreenRotation size={size.ICON_SIZE} />,
  },
  {
    onClick: ratio,
    message: '비율',
    type: 'transparent',
    children: <BsAspectRatio size={size.ICON_SIZE} />,
  },
  {
    onClick: crop,
    message: '자르기',
    type: 'transparent',
    children: <RiScissorsLine size={size.ICON_SIZE} />,
  },
];

const getSubEditToolsData = (buttonData: ButtonData): button[] =>
  [...Array(buttonData.onClicks?.length)].map((_, idx) => ({
    onClick: buttonData.onClicks[idx],
    message: buttonData.messages[idx],
    type: buttonData.type,
    children: buttonData.childrens[idx],
  }));

const Tools: React.FC = () => {
  const [play, setPlay] = useState(true); // Fix 스토어로 등록
  const dispatch = useDispatch();
  const [toolType, setToolType] = useState(null);
  const [buttonData, dispatchButtonData] = useReducer(reducer, initialData);

  const { start, end } = useSelector(getStartEnd, shallowEqual);

  const backwardVideo = () => {
    const dstTime = Math.max(video.getCurrentTime() - 10, start);

    video.setCurrentTime(dstTime);
    dispatch(moveTo(dstTime));
  };

  const forwardVideo = () => {
    const dstTime = Math.min(video.getCurrentTime() + 10, end);

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

  const handleRotateLeft90Degree = () => webglController.rotateLeft90Degree();
  const handleRotateRight90Degree = () => webglController.rotateRight90Degree();
  const handleReverseUpsideDown = () => webglController.reverseUpsideDown();
  const handleReverseSideToSide = () => webglController.reverseSideToSide();
  const rotateReverseMethods = [
    handleRotateLeft90Degree,
    handleRotateRight90Degree,
    handleReverseUpsideDown,
    handleReverseSideToSide,
  ];

  const handleRotateReverse = () => {
    if (toolType === 'videoEffect') {
      setToolType(null);
      dispatchButtonData({ type: null });
    } else {
      setToolType('videoEffect');
      dispatchButtonData({
        type: 'videoEffect',
        payload: rotateReverseMethods,
      });
    }
  };

  const handleRatioEnlarge = () => webglController.enlarge();
  const handleRatioReduce = () => webglController.reduce();
  const ratioMethods = [handleRatioEnlarge, handleRatioReduce];

  const handleRatio = () => {
    if (toolType === 'ratio') {
      setToolType(null);
      dispatchButtonData({ type: null });
    } else {
      setToolType('ratio');
      dispatchButtonData({ type: 'ratio', payload: ratioMethods });
    }
  };

  const handleCropInsert = () => webglController.enlarge();
  const handleCropConfirm = () => {
    dispatch(cropConfirm());
    setToolType(null);
    dispatchButtonData({ type: null });
    dispatch(cropCancel());
  };
  const handleCropCancel = () => {
    setToolType(null);
    dispatchButtonData({ type: null });
    dispatch(cropCancel());
  };
  const cropMethods = [handleCropInsert, handleCropConfirm, handleCropCancel];

  const handleCrop = () => {
    if (toolType === 'crop') {
      dispatch(cropCancel());
      setToolType(null);
      dispatchButtonData({ type: null });
    } else {
      dispatch(cropStart());
      setToolType('crop');
      dispatchButtonData({ type: 'crop', payload: cropMethods });
    }
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
      <StyledEditToolDiv>
        <SubEditTool buttonData={getSubEditToolsData(buttonData)} />
        <EditTool
          buttonData={getEditToolData(
            handleRotateReverse,
            handleRatio,
            handleCrop
          )}
        />
      </StyledEditToolDiv>
      <UploadArea />
    </StyledDiv>
  );
};

export default Tools;
