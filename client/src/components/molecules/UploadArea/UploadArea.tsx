import React, { useState, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
import FileInput from '@/components/atoms/FileInput';
import { setVideo } from '@/store/originalVideo/actions';
import { getName, getVideos } from '@/store/selectors';
import { reset } from '@/store/actionTypes';
import { fetchListStart } from '@/store/video/actions';
import videoAPI from '@/api/video';
import webglController from '@/webgl/webglController';
import Modal from '@/components/molecules/Modal';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledP = styled.p`
  font-size: 14px;
  margin: 0 5px 0 0;
`;

const UploadArea: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const name = useSelector(getName);
  const dispatch = useDispatch();

  const videos = useSelector(getVideos);

  const ref: React.RefObject<HTMLInputElement> = createRef();

  const handleChange = () => {
    const localFile: File = ref.current?.files[0];
    const objectURL = URL.createObjectURL(localFile);
    dispatch(setVideo(localFile, objectURL));

    setVisible(false);
  };

  const handleClick = async () => {
    if (!videos) dispatch(fetchListStart());
    console.log(videos);
  };

  return (
    <StyledDiv>
      {modalVisible && <Modal />}
      <StyledP>{name}</StyledP>
      <Button
        message="불러오기"
        onClick={() => setVisible(!visible)}
        type="default"
        disabled={false}
      />
      {visible && (
        <FileInput
          ref={ref}
          handleChange={handleChange}
          handleClick={handleClick}
        />
      )}
    </StyledDiv>
  );
};

export default UploadArea;
