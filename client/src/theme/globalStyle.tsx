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

input[type="radio"] {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

input[type="radio"]:hover + label:before {
  border-color: #999;
}

input[type="radio"]:active + label:before {
  transition-duration: 0;
  filter: brightness(0.2);
}

input[type="radio"] + label {
  position: relative;
  padding-left: 26px;
  font-weight: normal;
}

input[type="radio"] + label:before,
input[type="radio"] + label:after {
  box-sizing: content-box;
  position: absolute;
  content: '';
  display: block;
  left: 0;
}

input[type="radio"] + label:before {
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -10px;
  border: 2px solid #d9d9d9;
  text-align: center;
}

input[type="radio"] + label:after {
  background-color: ${color.LIGHT_PURPLE};
  top: 50%;
  left: 6px;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  transform: scale(0);
  transform-origin: 50%;
  transition: transform 200ms ease-out;
}

input[type="radio"]:checked + label:before {
  -moz-animation: borderscale 300ms ease-in;
  -webkit-animation: borderscale 300ms ease-in;
  animation: borderscale 300ms ease-in;
  background-color: ${color.LIGHT_PURPLE};
}
input[type="radio"]:checked + label:after {
  transform: scale(1);
}
input[type="radio"] + label:before, input[type="radio"] + label:after {
  border-radius: 50%;
}
`;

export default GlobalStyle;
