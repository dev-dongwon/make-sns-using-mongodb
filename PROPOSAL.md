# SNS FOR ARTISTS (SFA) 

예술 작품을 공유하는 SNS 사이트



## SUMMARY

### user

- 메인 페이지에서 admin이 고른 주목할 만한 예술 작품을 볼 수 있습니다

- discover 페이지에서 누구나 공개된 예술 작품을 볼 수 있습니다
  - recent 탭에서는 최근 올라온 작품을, trend 탭에서는 최근 인기 작품을 볼 수 있습니다
- Following 페이지에서 로그인한 유저에 한해 자신이 팔로잉한 아티스트의 작품을 볼 수 있습니다
- 자신의 작품을 자유롭게 올리고 다른 사람과 좋아요, 팔로잉을 통해 interaction 할 수 있습니다



### admin

- user, post, page views, comment 전체 숫자와 주간 변동 상황을 차트로 볼 수 있습니다
- 메인 화면을 구성할 작품을 등록, 삭제, 업데이트 할 수 있습니다
- 유저 권한을 금지시키거나 관리자 등급으로 상향시키는 등 유저 권한 변경이 가능합니다



## API & WIREFRAME : PAGE

- **메인 페이지** : `GET /`
  - 유저 게시물 중 관리자가 pick한 게시물이 관리자가 쓴 설명과 함께 노출
  - 게시물 우측 하단에는 해당 게시물의 유저 프로필 노출
  - 게시물을 클릭하면 원본 게시물로 이동

![main](https://user-images.githubusercontent.com/43179397/60863838-deca4680-a25c-11e9-9a9a-e66dd3472b23.png)



- **discover 페이지** : `GET /discover`
  - 최근 페이지 : `GET /discover/recent`
    - 게시물의 최신순으로 정렬

  - 인기 페이지 : `GET /discover/trend`
    - 현재 시각부터 하루 기준으로 가장 '좋아요'를 많이 받은 순으로 정렬

![discover](https://user-images.githubusercontent.com/43179397/60863845-dffb7380-a25c-11e9-9e9a-c7f579d98b64.png)



- **login 페이지** : `GET/login`
  - email or userID 입력
  - 패스워드 입력

![login](https://user-images.githubusercontent.com/43179397/60863849-e0940a00-a25c-11e9-94c8-19cc164faeaa.png)



- **회원가입 페이지** : `GET /signup`
  - email 입력
  - username 입력
  - password 입력
  - 모든 정보가 입력되고, 그 값들이 모두 유효할 때 회원가입 요청 가능

![signup](https://user-images.githubusercontent.com/43179397/60863843-dffb7380-a25c-11e9-9748-fd22b71000e9.png)
![signup2](https://user-images.githubusercontent.com/43179397/60863844-dffb7380-a25c-11e9-959c-d0aa390307de.png)



### user

- **follwing 페이지** : `GET /followings`
  - 내가 follow 하고 있는 유저의 게시물을 최신순으로 정렬
  - 로그아웃된 사용자에겐 메뉴가 보이지 않음

![following](https://user-images.githubusercontent.com/43179397/60863846-e0940a00-a25c-11e9-9815-064794f5a6b0.png)



- **회원 프로필&작업물 페이지** : `GET /:USER_ID`
  - 상단에 프로필 노출
    - 사진
    - 팔로우 버튼
    - 이름
    - 이메일
    - location
    - 게시물 총 view 숫자
    - 게시물 수
    - 팔로잉 수
    - 팔로워 수
    - 좋아요 수
    - user Bio
  - 페이지 하단에 자신이 올린 게시물이 최신 순으로 노출

![profile](https://user-images.githubusercontent.com/43179397/60863841-df62dd00-a25c-11e9-9006-dba4f2ca7eb4.png)



- **게시물 페이지** : `GET /:USER_ID/post/:POST_ID`
  - 프로필 사진
  - 유저 아이디
  - 게시물 view 숫자
  - 게시물 loves 숫자
  - reply 박스
  - 현재부터 계산한 게시물 업로드 시간
  - 댓글
    - 1 depth 우선 구현 => 무한 depth 까지 도전
    - 유저 프로필
    - 유저 아이디
    - 코멘트 내용
    - 현재 시점부터 계산한 코멘트 업로드 시간

![content](https://user-images.githubusercontent.com/43179397/60905828-d3a10600-a2b0-11e9-8fbb-9e940894e5a1.png)





- **회원이 '좋아요' 표시를 누른 게시물 페이지** : `GET /:USER_ID/loves`
  - 자신이 좋아요를 누른 게시물이 '좋아요' 등록 최신 순으로 노출

![loves](https://user-images.githubusercontent.com/43179397/60863837-deca4680-a25c-11e9-8f34-6da854ce3b38.png)



- **회원 프로필 정보 수정 페이지** : `GET /:USER_ID/settings`

  - 사용자 정보 수정

    - 헤더 이미지
    - 프로필 이미지
    - 이름
    - location
    - Bio
    - sites

  - 사용자 정보 노출 여부 수정 (옵션)

    - 프로필 공개
    - 댓글 허용
    - 좋아요 허용

  - 탈퇴

    - 계정 삭제 및 탈퇴

    

![settings2](https://user-images.githubusercontent.com/43179397/60866644-da555c00-a263-11e9-8e9e-17b3ecbff760.png)



![settings](https://user-images.githubusercontent.com/43179397/60863842-df62dd00-a25c-11e9-8baa-910d5593cc5e.png)



### admin : page

- **로그인 페이지** : `GET /admin`

![admin](https://user-images.githubusercontent.com/43179397/60883164-6e372000-a284-11e9-811e-616cacde72c5.png)



- **대시보드** : `GET /admin/dashboard`
  - 상단에 user, post, page views, comment 전체 숫자 대시보드
  - 상단 버튼을 클릭하면 하단에 주간 변동 상황을 나타내는 차트 노출
  - 라이브러리 chart.js 활용 예정

![dashboard](https://user-images.githubusercontent.com/43179397/60883698-d4707280-a285-11e9-8150-6d56491dcc0b.png)



- **메인 화면 관리** : `GET /admin/members`
  - 메인 화면에 노출되는 3개 컨텐츠 표시
  - 컨텐츠 클릭할 경우, 편집 모드로 진입
  - 메인 화면 편집 & 등록
    - 메인으로 올릴 유저 컨텐츠의 url
    - 이미지 위에 노출될 관리자 메시지

![admin-manage-main1](https://user-images.githubusercontent.com/43179397/60887590-bd368280-a28f-11e9-8f52-11d41a9bb9d9.png)

![admin-manage-main2](https://user-images.githubusercontent.com/43179397/60887591-bd368280-a28f-11e9-9803-d6b542cc421a.png)



- **회원관리** : `GET /admin/members`
  - 이름, 이메일, 상태 표시
  - 상태
    - ban : 아이디 정지 및 서비스 이용 불가
    - admin : admin 권한 부여

![admin-manage-member](https://user-images.githubusercontent.com/43179397/60887533-a132e100-a28f-11e9-8ece-b12d3efcfe78.png)



## API : ACTION

### posting

- **게시물 삭제** : `DELETE /post/:POST_ID`

- **게시물 수정** :  `PATCH /post/:POST_ID`

- **게시물 등록** : `POST /post`



### comment

- **댓글 등록** : `POST /comment`
- **댓글 가져오기** : `GET /comment/:COMMENT_ID`
- **댓글 수정** : `PATCH /comment/:COMMENT_ID`



### login & logout

- **로그인** : `POST /login`
- **로그아웃** : `POST /logout`



### user

- **유저 등록** : `POST /users/:USER_ID`

- **유저 정보 수정** : `PATCH /users/:USER_ID`

- **유저 정보 삭제** : `DELETE /users/:USER_ID`



### interaction

- **해당 유저 팔로우 & 언팔로우** :  `PATCH /following/:USER_ID`
- **해당 게시물 좋아요 & 좋아요 취소** : `PATCH /loves/:POST_ID`



### validation Check

- **이메일 중복 체크** : `GET /Check/:EMAIL_ADDRESS`
- **유저 ID 중복 체크** : `GET /check/:USER_ID`



### admin

##### dashboard

- **user 통계 보기** : `GET /admin/dashboard/users`
- **posts 통계 보기** : `GET /admin/dashboard/posts`
- **view 통계 보기** : `GET /admin/dashboard/views`
- **댓글 통계 보기** : `GET /admin/dashboard/comments`

##### update main view

- **메인 화면 업데이트** : `PATCH /admin/main`

##### manage user

- **유저 권한 상태 변경** : `PATCH /admin/status/:USER_ID`



## DB

```js
const Post = new Schema({
    content : String,
    createdDate : {
		type : Date,
        default : Date.now
    },
    Photo : String,
    comments : [Comment],
    user : [User],
    username : String,
    useravatar : String
})

const Comment = new Shcema({
    content : String,
    createdDate : {
		type : Date,
        default : Date.now
    },
    user : [User],
    username : String,
    useravatar : String
})

const User = new Schema({
    name : String,
    status : String,
    email : String,
    password : String,
    location : String,
    bio : String,
    avatar : String,
    header : String,
    createdDate : {
        type : Date,
        default : Date.now
    },
    posts : [Post],
    followings : [User],
    followers : [User],
    loves : [Post]
})
```



