import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Range } from 'react-range';
import styled from 'styled-components';
import color from '@/theme/colors';
import convertReactStyleToCSS from '@/utils/convert';

const STEP = 0.1;
const MIN = 0;
const MAX = 100;

interface OverlayProps {
  width: number;
  direction: string;
}

const CropLayerDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Overlay = styled.div<OverlayProps>`
  position: absolute;
  width: ${({ width }) => width}%;
  ${({ direction }) => direction}: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Track = styled.div`
  height: 7rem;
  width: 100%;
  display: flex;
  position: relative;
`;

const Thumb = styled.div`
  ${({ propsStyle }) => convertReactStyleToCSS(propsStyle)}
  height: 7rem;
  width: 6px;
  border-radius: 2px;
  background-color: ${color.PALE_PURPLE};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 5px ${color.DARK_PURPLE};
`;

const CropLayer = ({ positions, setPositions, duration }) => {
  return (
    <CropLayerDiv>
      <Range
        values={positions}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={values => {
          setPositions(values);
        }}
        renderTrack={({ props, children }) => (
          <Track
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
          >
            <Overlay width={positions[0]} direction="left" />
            <Overlay width={MAX - positions[1]} direction="right" />
            <div
              ref={props.ref}
              style={{
                width: '100%',
              }}
            >
              {children}
            </div>
          </Track>
        )}
        renderThumb={({ props }) => (
          <Thumb
            key={props.key}
            draggable
            tabIndex={props.tabIndex}
            aria-valuemax={props['aria-valuemax']}
            aria-valuemin={props['aria-valuemin']}
            aria-valuenow={props['aria-valuenow']}
            role={props.role}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            propsStyle={props.style}
          />
        )}
      />
    </CropLayerDiv>
  );
};

export default CropLayer;
