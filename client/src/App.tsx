import React, { useRef, useState } from 'react';
import axios from 'axios';

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
    <div>
      <input type="file" ref={inputRef} id="fileInput" onChange={handleClick} />
      <button type="button" onClick={handleSubmit}>
        submit
      </button>
      <h1> React here! </h1>
    </div>
  );
};

export default App;
