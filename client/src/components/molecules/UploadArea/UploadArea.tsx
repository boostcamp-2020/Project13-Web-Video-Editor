import React, { useState, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
import FileInput from '@/components/atoms/FileInput';
import { setVideo, loadMetadata } from '@/store/originalVideo/actions';
import { RootState } from '@/store/reducer';
import video from '@/video';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledP = styled.p`
  font-size: 14px;
  margin: 0 5px 0 0;
`;

interface Props {
  handleClick: Function;
}

const UploadArea: React.FC<Props> = ({ handleClick }) => {
  const [visible, setVisible] = useState(false);

  const name = useSelector((state: RootState) => state.originalVideo.name);
  const dispatch = useDispatch();

  const ref: React.RefObject<HTMLInputElement> = createRef();

  const handleChange = () => {
    const localFile: File = ref.current?.files[0];
    if (localFile) {
      const objectURL = URL.createObjectURL(localFile);
      dispatch(setVideo(localFile, objectURL));

      video.setSrc(objectURL); // FIXME: move this to saga
      video.addEventListener(
        'loadedmetadata',
        ({ target }: Event) => {
          dispatch(loadMetadata((target as HTMLVideoElement).duration));
        },
        { once: true }
      );

      handleClick({ target: ref.current });
    }

    setVisible(false);
  };

  return (
    <StyledDiv>
      <StyledP>{name}</StyledP>
      <Button
        message="불러오기"
        onClick={() => setVisible(!visible)}
        type="default"
      />
      {visible && <FileInput ref={ref} handleChange={handleChange} />}
    </StyledDiv>
  );
};

export default UploadArea;
