# 도서관리 시스템 - Frontend

## 프로젝트 개요

AI 기반 도서 표지 생성 기능을 포함한 도서관리 시스템의 프론트엔드 애플리케이션입니다. 사용자에게 직관적인 UI/UX를 제공하며, DALL-E 3 API를 활용한 시각적 경험을 제공합니다.



---

## 주요 기능

- **도서 CRUD**: 도서 생성, 조회, 수정, 삭제 기능
- **AI 표지 생성**: DALL-E 3 API를 활용한 자동 도서 표지 생성
- **사용자별 도서 관리**: 본인이 등록한 도서만 수정/삭제 가능
- **인증 시스템**: 토큰 기반 사용자 인증 및 권한 관리
- **반응형 UI**: MUI 기반의 사용자 친화적 인터페이스

---

## 기술 스택

### Core
- **React** - UI 라이브러리
- **React Router DOM** - 클라이언트 사이드 라우팅

### UI/UX
- **Material-UI (MUI)** - 컴포넌트 라이브러리

### API & Communication
- **Axios** - HTTP 클라이언트
- **Fetch API** - 네이티브 HTTP 통신
- **DALL-E 3 API** - AI 이미지 생성

### Authentication
- **토큰 기반 인증** - JWT 방식의 사용자 인증

---

## 프로젝트 구조

```
bms-FE-main/
├── .idea/                       # IDE 설정 파일
├── public/                      # 정적 파일
├── src/
│   ├── api/
│   │   └── client.js           # API 클라이언트 설정
│   ├── assets/                 # 이미지 및 정적 리소스
│   │   ├── aivle_logo.png
│   │   ├── aivle_logo2.png
│   │   ├── banner1.jpg
│   │   ├── banner2.jpg
│   │   ├── banner3.jpg
│   │   └── react.svg
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── books/
│   │   │   ├── BookCard.jsx    # 도서 카드 컴포넌트
│   │   │   └── BookList.jsx    # 도서 목록 컴포넌트
│   │   └── layout/
│   │       └── Layout.jsx      # 공통 레이아웃 컴포넌트
│   ├── css/                    # 스타일시트
│   │   ├── BookCreatePage.css
│   │   └── HomePage.css
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── ApiTestPage.jsx     # API 테스트 페이지
│   │   ├── BookCreatePage.jsx  # 도서 등록 페이지
│   │   ├── BookDetailPage.jsx  # 도서 상세 페이지
│   │   ├── BookEditPage.jsx    # 도서 수정 페이지
│   │   ├── BookListPage.jsx    # 전체 도서 목록 페이지
│   │   ├── HomePage.jsx        # 메인 페이지
│   │   ├── ImageCreatePage.jsx # AI 이미지 생성 페이지
│   │   ├── LogInPage.jsx       # 로그인 페이지
│   │   ├── MyBookListPage.jsx  # 내 도서 목록 페이지
│   │   └── SignUpPage.jsx      # 회원가입 페이지
│   ├── App.css                 # 앱 전역 스타일
│   ├── App.jsx                 # 메인 앱 컴포넌트 (라우팅)
│   ├── index.css               # 기본 스타일
│   ├── main.jsx                # 앱 진입점
│   └── theme.js                # MUI 테마 설정
├── .gitignore                  # Git 제외 파일 설정
├── eslint.config.js            # ESLint 설정
├── index.html                  # HTML 진입점
├── package.json                # 프로젝트 의존성 및 스크립트
├── package-lock.json           # 의존성 잠금 파일
├── README.md                   # 프로젝트 문서
└── vite.config.js              # Vite 빌드 설정
```

---

## 주요 컴포넌트

### Core
- **`App.jsx`**: 애플리케이션의 라우팅 구조 정의 및 공통 레이아웃 적용
- **`client.js`**: 백엔드 API 서버와의 HTTP 통신을 위한 클라이언트 설정

### Pages
| 컴포넌트 | 설명 |
|---------|------|
| `HomePage.jsx` | 메인 페이지 및 서비스 소개 |
| `LoginPage.jsx` | 이메일/비밀번호 기반 로그인 |
| `SignupPage.jsx` | 신규 사용자 회원가입 |
| `BookList.jsx` | 전체 도서 목록 조회 및 검색 |
| `MyBookListPage.jsx` | 사용자가 등록한 도서 목록 조회 |
| `BookDetailPage.jsx` | 도서 정보의 조회, 작성자 권한 확인 및 수정/삭제 |
| `BookCreatePage.jsx` | 새로운 도서 등록 |
| `BookEditPage.jsx` | 기존 도서 정보 수정 |
| `ImageCreatePage.jsx` | 사용자 프롬프트를 기반으로 AI 표지 이미지를 생성한 결과를 백엔드 서버를 통해 해당 도서에 저장 |

---

## 주요 기능 설명

### 1. AI 기반 도서 표지 생성
- 사용자가 입력한 프롬프트를 기반으로 DALL-E 3 API를 통해 도서 표지 자동 생성
- 모달 UI를 통한 직관적인 프롬프트 입력 경험

### 2. 도서 관리
- **조회**: 전체 도서 목록 및 개별 도서 상세 정보 확인
- **등록**: 제목, 저자, 출판사, 가격 등 도서 정보 입력 및 표지 이미지 업로드
- **수정**: 본인이 등록한 도서만 수정 가능 (권한 체크)
- **삭제**: 본인이 등록한 도서만 삭제 가능 (권한 체크)

### 3. 사용자 인증
- 회원가입 및 로그인
- 토큰 기반 인증으로 API 요청 시 자동 인증 처리
- 보호된 라우트를 통한 권한 관리

### 4. AI 기반 도서 표지 생성
- 프롬프트 기반 이미지 생성: 사용자가 원하는 표지 스타일이나 설명을 텍스트로 입력
- 실시간 생성: 입력된 프롬프트를 POST 요청으로 DALL-E 3 API에 전송하여 표지 생성
- 즉시 반영: 생성된 이미지 URL을 받아 화면에 실시간으로 표시
- 직관적인 UI: 모달 인터페이스를 통한 간편한 프롬프트 입력 경험

---

## 설치 및 실행

### 사전 요구사항
- Node.js (v20 이상)
- npm 또는 yarn

### 설치
```bash
# 의존성 패키지 설치
npm install
```

### 환경 변수 설정
`.env` 파일을 생성하고 다음 변수를 설정하세요:
```
VITE_APP_API_URL
```

### 설치
```bash
# 의존성 패키지 설치
npm install
```

### 실행
```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build
```

---

## 주요 특징

### MUI 기반 디자인
- 일관된 디자인 시스템
- 반응형 레이아웃
- 접근성 고려

### 사용자 경험 최적화
- 직관적인 네비게이션
- 로딩 상태 표시
- 에러 핸들링 및 사용자 피드백

### API 통신 최적화
- 로딩 상태 표시 및 HTTP 상태 코드 기반의 명확한 에러 핸들링
- 요청/응답 데이터 변환

---

## 개발 노트

- **권한 관리**: 도서 수정/삭제는 작성자 본인만 가능하도록 제한
- **이미지 처리**: DALL-E 3로 생성된 이미지는 Base64 또는 URL 형태로 저장
- **상태 관리**: React의 내장 Hook(useState, useEffect)을 활용한 로컬 상태 관리

---
