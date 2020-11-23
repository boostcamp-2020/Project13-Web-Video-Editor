import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';

import store from '@/store';
import Button from '@/components/atoms/Button';
import Thumbnail from '@/components/atoms/Thumbnail';
import GlobalStyle from '@/theme/globalStyle';
import Header from '@/components/organisms/Header';
import Tools from '@/components/organisms/Tools';
import VideoContainer from '@/components/organisms/VideoContainer';

const App: React.FC = () => {
  const inputRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleClick = ({ target }) => {
    setVideoFile(target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('video', videoFile);
    const instance = axios.create({
      baseURL: 'http://localhost:3000',
    });

    try {
      await instance.post('/video', formData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Provider store={store}>
      <GlobalStyle />
      <Header />
      <VideoContainer />
      <Tools handleClick={handleClick} />
      <Button message="Submit" onClick={handleSubmit} type="default" />
      <Thumbnail />
    </Provider>
  );
};

export default App;
