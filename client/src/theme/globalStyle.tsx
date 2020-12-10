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
  input[type=range] {
  -webkit-appearance: none;
  cursor: pointer;
  color: ${color.PURPLE};
  background: ${color.LIGHT_PURPLE};
  height: 0.5rem;
  border-radius: 5px;
}

input[type=range]:focus {
  outline: none; 
}
input[type=range]::-webkit-slider-thumb { 
  -webkit-appearance: none; 
  background: ${color.WHITE}; 
  cursor: pointer; 
  border: none; 
  height: 0.8rem; width: 0.8rem; 
  border-radius: 40%; 
}

input[type=range]::-webkit-slider-thumb:hover { 
  transform: scale(1.2, 1.3);
  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.5);
}
`;

export default GlobalStyle;
