import { createGlobalStyle } from 'styled-components';

import color from '@/theme/colors';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Yeon+Sung&display=swap');  

  html {
    font-size: 16px;
  }

  body {
    position: relative;
    margin: 0;
    height: 100vh;
    background-color: ${color.DARK_GRAY};
    font-family: 'Yeon Sung';
    color: ${color.WHITE};
  }
  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;
