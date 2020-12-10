import React from 'react';

export default interface Props<T> {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
}
