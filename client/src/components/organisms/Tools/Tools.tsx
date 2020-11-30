import React, { useState } from 'react';
import styled from 'styled-components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillPlayFill,
  BsFillPauseFill,
  BsAspectRatio,
  BsTerminal,
  BsCheck,
  BsX,
} from 'react-icons/bs';
import { RiScissorsLine } from 'react-icons/ri';
import { AiOutlineRotateLeft,AiOutlineFullscreenExit,AiOutlineFullscreen} from 'react-icons/ai'
import { MdRotateLeft, MdRotateRight } from 'react-icons/md';
import { CgMergeHorizontal, CgMergeVertical} from 'react-icons/cg';
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

interface ButtonData {
  onClicks: (() => void)[];
  messages: string[];
  type: string;
  childrens: any[]
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
  crop: () => void,
): button[] => [
  {
    onClick: rotateReverse,
    message: '회전 / 반전',
    type: 'transparent',
    children: <AiOutlineRotateLeft size={size.ICON_SIZE} />,
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

const getSubEditToolsData = (buttonData: ButtonData): button[] => {
  const buttons = [];

  if (!buttonData.onClicks) {
    return [];
  }

  for (let i = 0; i < buttonData.onClicks.length; i += 1) {
    buttons.push({
      onClick: buttonData.onClicks[i],
      message: buttonData.messages[i],
      type: buttonData.type,
      children: buttonData.childrens[i],
    })
  }

  return buttons;
};

const Tools: React.FC = () => {
  const [play, setPlay] = useState(true); // Fix 스토어로 등록
  const dispatch = useDispatch();
  const [toolType, setToolType] = useState(null);
  const [buttonData, setButtonData] = useState({
    onClicks: null,
    messages: null,
    type: null,
    childrens: null,
  });

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

  const rotateLeft90Degree = () => webglController.rotateLeft90Degree();
  const rotateRight90Degree = () => webglController.rotateRight90Degree();
  const reverseUpsideDown = () => webglController.reverseUpsideDown();
  const reverseSideToSide = () => webglController.reverseSideToSide();
  const rotateReverseMethods = [rotateLeft90Degree, rotateRight90Degree, reverseUpsideDown, reverseSideToSide];
  const rotateReverseMessages= ['왼쪽', '오른쪽', '상하 반전', '좌우 반전'];
  const rorateReverseChildrens = [
    <MdRotateLeft size={size.ICON_SIZE} />,
    <MdRotateRight size={size.ICON_SIZE} />,
    <CgMergeHorizontal size={size.ICON_SIZE} />,
    <CgMergeVertical size={size.ICON_SIZE} />
  ]
  
  const rotateReverse = () => {
    if (toolType === 'videoEffect') {
      setToolType(null);
      setButtonData({
        onClicks: null,
        messages: null,
        type: null,
        childrens: null,
      });
    } else {
      setToolType('videoEffect');
      setButtonData({
        onClicks: rotateReverseMethods,
        messages: rotateReverseMessages,
        type: 'transparent',
        childrens : rorateReverseChildrens,
      })
    }
  }
  
  const ratioEnlarge = () => webglController.enlarge();
  const ratioReduce = () => webglController.reduce();
  const ratioMethods = [ratioEnlarge, ratioReduce];
  const ratioMessages= ['확대', '축소'];
  const ratioChildrens = [
    <AiOutlineFullscreen size={size.ICON_SIZE} />,
    <AiOutlineFullscreenExit size={size.ICON_SIZE} />,
  ]

  const ratio = () => {
    if (toolType === 'ratio') {
      setToolType(null);
      setButtonData({
        onClicks: null,
        messages: null,
        type: null,
        childrens: null,
      });
    } else {
      setToolType('ratio');
      setButtonData({
        onClicks: ratioMethods,
        messages: ratioMessages,
        type: 'transparent',
        childrens : ratioChildrens,
      })
    }
  }
  
  const cropInsert = () => webglController.enlarge();
  const cropConfirm = () => webglController.reduce();
  const cropCancle = () => webglController.reduce();
  const cropMethods = [cropInsert, cropConfirm, cropCancle];
  const cropMessages= ['직접입력', '확인', '취소'];
  const cropChildrens = [
    <BsTerminal size={size.ICON_SIZE} />,
    <BsCheck size={size.ICON_SIZE} />,
    <BsX size={size.ICON_SIZE} />,
  ]

  const crop = () => {
    if (toolType === 'crop') {
      setToolType(null);
      setButtonData({
        onClicks: null,
        messages: null,
        type: null,
        childrens: null,
      });
    } else {
      setToolType('crop');
      setButtonData({
        onClicks: cropMethods,
        messages: cropMessages,
        type: 'transparent',
        childrens : cropChildrens,
      })
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
        <SubEditTool buttonData={getSubEditToolsData(buttonData)}/>
        <EditTool buttonData={getEditToolData(
          rotateReverse,
          ratio,
          crop
        )}/>
      </StyledEditToolDiv>
      <UploadArea />
    </StyledDiv>
  );
};

export default Tools;
