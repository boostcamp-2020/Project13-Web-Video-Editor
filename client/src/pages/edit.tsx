import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import TimeLine from '@/components/organisms/TimeLine';
import Header from '@/components/organisms/Header';
import Tools from '@/components/organisms/Tools';
import VideoContainer from '@/components/organisms/VideoContainer';
import Loading from '@/components/atoms/Loading';
import { getMessage } from '@/store/selectors';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
`;

const BottomDiv = styled.div``;

const EditPage: React.FC = () => {
  const message = useSelector(getMessage);
  const [isEdit, setEdit] = useState('');

  return (
    <StyledDiv>
      {/* message && <Loading message={message} /> */}
      <Header />
      <VideoContainer isEdit={isEdit} />
      <BottomDiv>
        <Tools setEdit={setEdit} isEdit={isEdit} />
        <TimeLine />
      </BottomDiv>
    </StyledDiv>
  );
};

export default React.memo(EditPage);
