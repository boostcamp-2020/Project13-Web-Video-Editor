import React, { useState, useReducer } from 'react';
import styled, { keyframes } from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import webglController from '@/webgl/webglController';
import ButtonGroup from '@/components/molecules/ButtonGroup';
import UploadArea from '@/components/molecules/UploadArea';
import video from '@/video';
import {
  play as playAction,
  pause,
  moveTo,
} from '@/store/currentVideo/actions';
import { getStartEnd } from '@/store/selectors';
import { cropStart, cropCancel, cropConfirm } from '@/store/actionTypes';

import reducer, { initialData, ButtonDataAction } from './reducer';
import {
  getEditToolData,
  getSubEditToolsData,
  getVideoToolsData,
} from './buttonData';

const UP = 'up';
const DOWN = 'down';

const StyledDiv = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem;
`;

const slide = keyframes`
  from {
    transform: translate(0, 50px);
    opacity: 0;
  }
  to {
    transform: translate(0, 0);
    opacity: 1;
  }
`;

const StyledEditToolDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditTool = styled(ButtonGroup)`
  width: 20rem;
`;

const WrapperDiv = styled.div`
  width: 25rem;
  display: flex;
  justify-content: center;
  animation: ${slide} 0.5s -0.1s ease-out;
`;

const SubEditTool = styled(ButtonGroup)`
  width: 100%;
`;

const VideoTool = styled(ButtonGroup)``;

interface props {
  setEdit: Function;
}

const Tools: React.FC<props> = ({ setEdit }) => {
  const [play, setPlay] = useState(true); // Fix 스토어로 등록
  const dispatch = useDispatch();
  const [toolType, setToolType] = useState(null);
  const [buttonData, dispatchButtonData] = useReducer(reducer, initialData);

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

  const closeSubtool = () => {
    setEdit(DOWN);
    setToolType(null);
    dispatchButtonData({ type: null });
  };

  const openSubtool = (
    type: 'videoEffect' | 'ratio' | 'crop',
    payload: (() => void)[]
  ) => {
    setEdit(UP);
    setToolType(type);
    dispatchButtonData({ type, payload });
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

  const handleRatioEnlarge = () => webglController.enlarge();
  const handleRatioReduce = () => webglController.reduce();
  const ratioMethods = [handleRatioEnlarge, handleRatioReduce];

  const handleCropInsert = () => null;
  const handleCropConfirm = () => {
    dispatch(cropConfirm());
    closeSubtool();
    dispatch(cropCancel());
  };
  const handleCropCancel = () => {
    closeSubtool();
    dispatch(cropCancel());
  };
  const cropMethods = [handleCropInsert, handleCropConfirm, handleCropCancel];

  const handleRotateReverse = () =>
    toolType === 'videoEffect'
      ? closeSubtool()
      : openSubtool('videoEffect', rotateReverseMethods);

  const handleRatio = () =>
    toolType === 'ratio' ? closeSubtool() : openSubtool('ratio', ratioMethods);

  const handleCrop = () => {
    if (toolType === 'crop') {
      dispatch(cropCancel());
      closeSubtool();
    } else {
      openSubtool('crop', cropMethods);
      dispatch(cropStart());
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
        {toolType && (
          <WrapperDiv>
            <SubEditTool buttonData={getSubEditToolsData(buttonData)} />
          </WrapperDiv>
        )}
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
