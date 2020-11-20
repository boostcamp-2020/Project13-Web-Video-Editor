import React from 'react';

interface Props {
  handleChange: () => void;
}

const FileInput = React.forwardRef<HTMLInputElement, Props>(
  ({ handleChange }, forwardedRef) => {
    return (
      <>
        <label htmlFor="local">내 컴퓨터</label>
        <input
          type="file"
          id="local"
          ref={forwardedRef}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </>
    );
  }
);

export default FileInput;
