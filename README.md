
# 🌊 WAVE

### 동영상 편집, 이제 브라우저만 여세요!  
 
![logo](https://user-images.githubusercontent.com/49153756/101979687-79288800-3ca2-11eb-9119-474bcef90db2.gif)


### [배포 주소 🖥 ](https://boostwave.ga/)
### [데모 영상🎞](https://www.youtube.com/watch?v=7TCaBNmKwSU)
> 배포 주소로 확인할 수 없을 때 데모 영상으로 확인해주세요.

**WAVE**(Web Application for Video Editing)는 **클라이언트 기반 웹 동영상🎥 편집기**로, 별도 프로그램을 설치할 필요 없이 **브라우저🌍만으로 작업이 가능합니다.** 영상의 편집 처리를 서버가 아닌 클라이언트에서 진행하여 서버의 부하도 많이 발생하지 않습니다.

사용자는 로컬 또는 서버에서 영상을 불러와서 **UI를 통해 다양한 효과를 추가**하고, 그 결과물을 **다운로드 및 서버로 업로드**할 수 있습니다. 이는 HTML5의 \<video> element에서 원본 영상을 재생하며 프레임을 추출하고, 추출한 프레임마다 편집 효과를 적용한 후, 이를 합쳐서 mp4 파일을 만드는 방식으로 이루어집니다.

동영상이 핸드폰으로 찍어 90° 돌아간 상태이거나, 맨 앞과 맨 뒤에 필요 없는 부분을 잘라내고 싶을 때, 동영상 편집 프로그램을 다운받아 실행하는 번거로운 작업 없이 **Chrome 브라우저를 켜서 WAVE를 시작하세요!**

## 🌉 Features

|  회전 / 반전  | 확대 / 축소  | 
|:---:|:---:|
| ![회전반전](https://user-images.githubusercontent.com/49153756/102684958-683ac200-4220-11eb-87c8-9a56e1cb5500.gif) | ![확대축소](https://user-images.githubusercontent.com/49153756/102684962-6b35b280-4220-11eb-9c59-5aa1497dd3f5.gif) | 
| `90°/-90° 회전`, `상하/좌우 반전`이 가능합니다. | `확대/축소`, `4:3`, `16:9` 비율 조정이 가능합니다.  |  
| **영상 자르기** | **서명 추가**   |
| ![자르기](https://user-images.githubusercontent.com/49153756/102684963-6bce4900-4220-11eb-8766-2e0be16973ce.gif)  |  ![서명](https://user-images.githubusercontent.com/49153756/102684965-6cff7600-4220-11eb-8dc5-3238055f5273.gif)  |
|  원하는 길이만큼 영상을 자를 수 있습니다.  |  로컬에서 이미지를 불러와서 영상에 서명을 추가할 수 있습니다. (워터마크 기능)  |
| **각종 필터 적용**  | **서버에서 불러오기**  |
| ![필터](https://user-images.githubusercontent.com/49153756/102684966-6d980c80-4220-11eb-913a-b5004ee9d219.gif) | ![히스토리](https://user-images.githubusercontent.com/49153756/102684974-71c42a00-4220-11eb-95d3-0891d30ed507.gif)  |
| `R,G,B` 값을 변경할 수 있고, `blur`효과 및 흑백 효과, 밝기 조절도 가능합니다!  | 편집 내역을 최대 20개까지 히스토리로 관리합니다. (서명, 필터 제외) |
| **해상도 설정**  | **로컬 다운로드**  |
| ![해상도설정](https://user-images.githubusercontent.com/49153756/102684967-6ec93980-4220-11eb-80df-a0137f414c87.gif)  | ![로컬다운](https://user-images.githubusercontent.com/49153756/102684968-6f61d000-4220-11eb-90cd-c5c7d31312ed.gif) |
| 원하는 해상도를 설정하여 영상을 인코딩할 수 있습니다.  | 인코딩이 완료된 영상을 즉시 로컬로 다운로드 할 수 있습니다. |
| **서버에서 불러오기**  | **도움말**  |
| ![서버에서다운로드](https://user-images.githubusercontent.com/49153756/102684970-6ffa6680-4220-11eb-95b1-f6696b8fa712.gif) |![도움말](https://user-images.githubusercontent.com/49153756/102684971-7092fd00-4220-11eb-90dc-7ff0508fa19b.gif)  |
| 편집했던 영상을 서버에서 불러와 추가적인 편집 작업도 가능합니다!  | WAVE의 사용법을 상세히 확인할 수 있습니다. |


## 🏛 Web Architecture 
![](https://i.imgur.com/X1Q9S7H.png)

## 🚩기술 스택
![](https://i.imgur.com/zmyi5gG.png)

> 자세한 설명은 [Wiki](https://github.com/boostcamp-2020/Project13-Web-Video-Editor/wiki/%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D) 를 참고해주세요.

## 👩‍ 팀원

|  J017_권영언  |  J096_석민지  |  J103_신승현  |  J117_오지현  |
| :----------: |  :--------:  |  :---------: |  :---------: |
| [<img src="https://avatars0.githubusercontent.com/u/49153756?s=460&u=a475983d60adb9ddac3d55771bde039d545360dd&v=4" width=100 alt="_"/><br/>GitHub](https://github.com/kyu9341) | [<img src="https://user-images.githubusercontent.com/57527380/97649629-2486d000-1a9b-11eb-9887-4241aeb15753.png" width=100 alt="_"/><br/>GitHub](https://github.com/mjseok) |[<img src="https://user-images.githubusercontent.com/48575504/99213106-144b5080-2810-11eb-9c35-c8f84194c148.jpg" width=100 alt="_"><br/>GitHub](https://github.com/SSH1997) | [<img src="https://avatars1.githubusercontent.com/u/48315101?s=460&v=4" width=100 alt="_"/><br/>GitHub](https://github.com/joh16) |
| 음음 🏳️‍🌈  |  ⭐👩‍💻⭐  | 😊 SSH ^^ㅎ 😊 |   🐾📏|


