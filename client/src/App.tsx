import React from 'react';

import EditPage from '@/pages/Edit';
import GlobalStyle from '@/theme/globalStyle';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <EditPage />
    </>
  );
};

export default App;
