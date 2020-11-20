import React, { ChangeEvent, FunctionComponent } from 'react';

interface Props {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton: FunctionComponent<Props> = ({ onChange }) => (
  <input type="file" onChange={onChange} />
);

export default UploadButton;
