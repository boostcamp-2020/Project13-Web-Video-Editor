/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import styled from 'styled-components';
import color from '@/theme/colors';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  width: 100%;
  height: 89%;

  p {
    align-items: baseline;
  }
`;

const StyledTitle = styled.h3`
  margin-top: 5%;
`;

const StyledP = styled.p`
  margin-top: 5%;
`;

const Help: React.FC = () => {
  return (
    <StyledDiv>
      <StyledTitle first>1. 비디오 불러오기</StyledTitle>
      <img src="https://i.ibb.co/vvx2MZC/1.png" alt="1" />
      <StyledP>
        ① 내 컴퓨터에 있는 비디오를 불러올 수 있습니다.
        <br />② 서버에 올라가있는 비디오를 불러올 수 있습니다.
      </StyledP>
      <StyledTitle>2. 비디오 재생 / 정지하기</StyledTitle>
      <img src="https://i.ibb.co/tDTvP5N/2.png" alt="2" />
      <StyledP>
        ① 버튼을 클릭하거나 space bar를 눌러서 비디오를 재생 / 정지할 수
        있습니다.
        <br />② 버튼을 클릭하거나 왼쪽 방향키를 눌러서 비디오를 10초 전으로
        이동할 수 있습니다.
        <br />③ 버튼을 클릭하거나 오른쪽 방향키를 눌러서 비디오를 10초 후로
        이동할 수 있습니다.
        <br />④ 썸네일을 클릭하여 해당하는 위치로 영상의 재생시간을 이동시킬 수
        있습니다.
      </StyledP>

      <StyledTitle>3. 비디오 소리조절하기</StyledTitle>
      <img src="https://i.ibb.co/XZwkh5T/3.png" alt="3" />
      <StyledP>
        ① 버튼을 클릭하여 음소거를 할 수 있습니다.
        <br />② 마우스를 올려 볼륨 조절 창을 나타나게할 수 있습니다. <br /> ③
        마우스로 볼륨 조절 슬라이더를 조절하여 볼륨을 조절할 수 있습니다.
      </StyledP>

      <StyledTitle>4. 비디오 편집하기</StyledTitle>
      <img src="https://i.ibb.co/Trs0MPQ/4.png" alt="4" />
      <StyledP>
        ① 회전 / 반전 하기 ② 비율 조절하기 <br />③ 비디오 길이 자르기 <br /> ④
        서명 추가하기 <br />⑤ 비디오 필터 입히기
      </StyledP>

      <StyledTitle>5. 비디오 편집하기 - 회전 / 반전 하기</StyledTitle>
      <img src="https://i.ibb.co/jR6fHqS/5.png" alt="5" />
      <StyledP>
        ① 버튼을 클릭하여 비디오를 왼쪽으로 90도 회전할 수 있습니다 <br />②
        버튼을 클릭하여 비디오를 오른쪽으로 90도 회전할 수 있습니다 <br />③
        버튼을 클릭하여 비디오를 상하로 반전시킬 수 있습니다. <br />④ 버튼을
        클릭하여 비디오를 좌우로 반전시킬 수 있습니다.
      </StyledP>

      <StyledTitle>6. 비디오 편집하기 - 비율 조절하기</StyledTitle>
      <img src="https://i.ibb.co/HKnJCR9/6.png" alt="6" />
      <StyledP>
        ① 버튼을 클릭하여 비디오를 확대할 수 있습니다.
        <br />② 버튼을 클릭하여 비디오를 축소할 수 있습니다.
        <br />③ 버튼을 클릭하여 비디오의 비율을 4:3으로 조정할 수 있습니다.
        <br />④ 버튼을 클릭하여 비디오의 비율을 16:9로 조정할 수 있습니다.
        <br />⑤ 버튼을 클릭하여 비디오의 비율을 원래대로 되돌릴 수 있습니다.
      </StyledP>

      <StyledTitle>7. 비디오 편집하기 - 길이 자르기</StyledTitle>
      <img src="https://i.ibb.co/1vDc1bV/7.png" alt="7" />
      <StyledP>
        ① 마우스로 썸네일 위의 보라색 막대기를 드래그하여 원하는 길이만큼만
        비디오를 자를 수 있습니다. <br /> ② 버튼을 클릭하여 자르기 효과를
        비디오에 적용시킬 수 있습니다. <br /> ③ 버튼을 클릭하여 자르기 효과를
        취소할 수 있습니다.
      </StyledP>

      <StyledTitle>8. 비디오 편집하기 - 서명 추가하기</StyledTitle>
      <img src="https://i.ibb.co/GkFB4nF/8.png" alt="8" />
      <StyledP>
        ① 슬라이더를 조절하여 서명의 크기를 조절할 수 있습니다. <br /> ② 버튼을
        클릭하여 원하는 서명 파일을 업로드 할 수 있습니다. <br />③ 버튼을
        클릭하여 서명을 비디오에 적용시킬 수 있습니다. <br />④ 버튼을 클릭하여
        업로드 된 서명을 삭제할 수 있습니다.
      </StyledP>

      <StyledTitle>9. 비디오 편집하기 - 비디오 필터 입히기</StyledTitle>
      <img src="https://i.ibb.co/T8q6ZFv/9.png" alt="9" />
      <StyledP>
        ① 슬라이더를 조절하여 비디오의 RGB 색감을 조절할 수 있습니다. <br /> ②
        슬라이더를 조절하여 비디오의 블러 효과를 조절할 수 있습니다. <br />③
        슬라이더를 조절하여 비디오의 밝기를 조절할 수 있습니다. <br /> ④
        슬라이더를 조절하여 비디오에 흑백필터를 씌울 수 있습니다. <br /> ⑤
        초기화 버튼을 클릭하여 비디오에 적용된 필터를 초기화 시킬 수 있습니다.
      </StyledP>

      <StyledTitle>10. 히스토리</StyledTitle>
      <img src="https://i.ibb.co/F7hBSrG/10.png" alt="10" />
      <StyledP>
        ① 버튼을 클릭하여 직전에 적용된 편집효과를 취소할 수 있습니다.
        <br />② 버튼을 클릭하여 취소된 편집효과를 재 적용시킬 수 있습니다.
        <br />③ 버튼을 클릭하여 비디오에 적용된 편집효과를 초기화 시킬 수
        있습니다.
      </StyledP>

      <StyledTitle>11. 취소하기</StyledTitle>
      <img src="https://i.ibb.co/BL1ZD7x/11.png" alt="11" />
      <StyledP>
        ① 취소버튼을 누르면 비디오를 불러오기 이 전의 상태로 돌아갑니다.
      </StyledP>

      <StyledTitle>12. 비디오 업로드 / 다운로드</StyledTitle>
      <img src="https://i.ibb.co/YRfFpPJ/12.png" alt="12" />
      <StyledP>
        ① 비디오의 이름을 바꿀 수 있습니다.
        <br />② 확인버튼을 누르면 비디오가 서버에 업로드되거나 다운을 받을 수
        있습니다.
      </StyledP>
    </StyledDiv>
  );
};

export default Help;
