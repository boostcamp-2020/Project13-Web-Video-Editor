import React from 'react';
import { Provider } from 'react-redux';

import store from '@/store';
import Thumbnail from '@/components/atoms/Thumbnail';
import GlobalStyle from '@/theme/globalStyle';
import Header from '@/components/organisms/Header';
import Tools from '@/components/organisms/Tools';
import VideoContainer from '@/components/organisms/VideoContainer';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Header />
      <VideoContainer />
      <Tools />
      <Thumbnail />
    </Provider>
  );
};

export default App;
