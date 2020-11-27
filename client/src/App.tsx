import React from 'react';
import { useSelector } from 'react-redux';

import TimeLine from '@/components/organisms/TimeLine';
import GlobalStyle from '@/theme/globalStyle';
import Header from '@/components/organisms/Header';
import Tools from '@/components/organisms/Tools';
import VideoContainer from '@/components/organisms/VideoContainer';
import Loading from '@/components/atoms/Loading';
import { getMessage } from '@/store/selectors';

const App: React.FC = () => {
  const message = useSelector(getMessage);

  return (
    <>
      <GlobalStyle />
      {message && <Loading message={message} />}
      <Header />
      <VideoContainer />
      <Tools />
      <TimeLine />
    </>
  );
};

export default App;
