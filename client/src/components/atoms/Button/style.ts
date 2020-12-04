import color from '@/theme/colors';

import { ButtonType } from '.';

export default (type: ButtonType) => {
  switch (type) {
    case 'default':
      return `
        background: ${`radial-gradient(${color.PURPLE}, ${color.DARK_PURPLE})`};
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
      `;
    case 'transparent':
      return `
        background : transparent;
      `;
    case 'selected':
      return `
          background : transparent;
          color: ${color.PALE_PURPLE};
        `;
    default:
      return ``;
  }
};
