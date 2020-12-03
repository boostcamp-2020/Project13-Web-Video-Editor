import React, { useState, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
import FileInput from '@/components/molecules/FileInput';
import { setVideo } from '@/store/originalVideo/actions';
import { getName } from '@/store/selectors';

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

  const name = useSelector(getName);
  const dispatch = useDispatch();

  const ref: React.RefObject<HTMLInputElement> = createRef();

  const handleChange = () => {
    const localFile: File = ref.current?.files[0];
    const objectURL = URL.createObjectURL(localFile);
    dispatch(setVideo(localFile, objectURL));

    setVisible(false);
  };

  return (
    <StyledDiv>
      <StyledP>{name}</StyledP>
      <Button
        message="불러오기"
        onClick={() => setVisible(!visible)}
        type="default"
        disabled={false}
      />
      {visible && <FileInput ref={ref} handleChange={handleChange} />}
    </StyledDiv>
  );
};

export default UploadArea;
