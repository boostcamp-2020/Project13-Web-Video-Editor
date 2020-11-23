import React, { useState, createRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from '@/components/atoms/Button';
import FileInput from '@/components/atoms/FileInput';
import { FileInfo, startUpload, load } from '@/store/originalVideo/actions';

const StyledDiv = styled.div`
  display: flex;
  position: relative;
`;

const StyledP = styled.p`
  font-size: 14px;
  margin-right: 5px;
`;

interface Props {
  startUpload: Function;
  load: Function; // FIXME
  handleClick: Function;
}

const initialFile = { name: undefined };

const $video = document.createElement('video');

const UploadArea: React.FC<Props> = ({ startUpload, load, handleClick }) => {
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState(initialFile);
  const ref: React.RefObject<HTMLInputElement> = createRef();

  const handleChange = () => {
    const localFile: File = ref.current?.files[0];
    if (localFile) {
      setFile(localFile);
      startUpload();
      handleClick({ target: ref.current });

      const fileInfo: FileInfo = {
        name: localFile.name,
        extension: localFile.type.split('/')[1],
        length: 0,
      };

      $video.ondurationchange = () => {
        URL.revokeObjectURL($video.src);
        fileInfo.length = $video.duration;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          load(reader.result, fileInfo);
        });
        reader.readAsArrayBuffer(localFile);
      };
      $video.src = URL.createObjectURL(localFile);
    } else setFile(initialFile);
    if (visible) setVisible(false);
  };

  return (
    <StyledDiv>
      <StyledP>{file.name}</StyledP>
      <Button
        message="불러오기"
        onClick={() => setVisible(!visible)}
        type="default"
      />
      {visible && <FileInput ref={ref} handleChange={handleChange} />}
    </StyledDiv>
  );
};

export default connect(null, { startUpload, load })(UploadArea);
