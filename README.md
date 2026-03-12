# Somansa 비가시성 워터마크 홍보 영상

소만사의 비가시성 워터마크 보안 제품 홍보 애니메이션 영상 프로젝트입니다.
타이머 기반으로 장면(Scene)을 자동 전환하는 React SPA로 구축되어 있으며, Puppeteer를 이용한 화면 녹화를 통해 영상 파일로 변환합니다.

## 기술 스택

- **React 19** + **TypeScript**
- **Vite** (빌드 도구)
- **Framer Motion** (애니메이션)
- **Tailwind CSS v4** (스타일링)
- **Puppeteer** (영상 녹화)

## 설치

```bash
npm install
```

## 개발 서버 실행

```bash
npm run dev:client
```

브라우저에서 `http://localhost:5000` 으로 접속하면 영상이 자동 재생됩니다.

## 영상 구조

총 7개의 장면(Scene)으로 구성되며, 순서대로 자동 전환됩니다.

| 장면 | 파일 | 내용 | 재생 시간 |
|------|------|------|-----------|
| Scene 0 | `Scene0.tsx` | 인트로 | 4.0초 |
| Scene 1 | `Scene1.tsx` | 사무실 시나리오 | 5.5초 |
| Scene 2 | `Scene2.tsx` | 경고 알림 | 5.5초 |
| Scene 3 | `Scene3.tsx` | 스캐너 탐지 | 8.0초 |
| Scene 4 | `Scene4.tsx` | 프린트 워터마크 탐지 | 8.0초 |
| Scene 5 | `Scene5.tsx` | 보호 | 6.0초 |
| Scene 6 | `Scene6.tsx` | 아웃트로 로고 | 6.0초 |

**총 재생 시간: 약 43초**

장면 컴포넌트 위치: `client/src/components/video/video_scenes/`

## 영상 녹화 (Video Export)

Puppeteer + ffmpeg 기반의 프레임 단위 녹화 스크립트로 고품질 MP4 영상을 생성합니다.

### 사전 요구사항

- **ffmpeg** 설치 필요: `brew install ffmpeg`

### 기본 사용법

```bash
# 방법 1: dev 서버가 이미 실행 중인 경우
npm run dev:client          # 터미널 1
npm run record              # 터미널 2

# 방법 2: 서버가 꺼져 있으면 스크립트가 자동으로 시작
npm run record
```

### 녹화 옵션

```bash
npm run record -- --port 5000 --output my-video.mp4 --width 1920 --height 1080 --fps 30
```

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `--port` | `5000` | 개발 서버 포트 |
| `--output` | `output.mp4` | 출력 파일 경로 |
| `--width` | `1920` | 영상 가로 해상도 |
| `--height` | `1080` | 영상 세로 해상도 |
| `--fps` | `30` | 프레임 레이트 |

### 녹화 동작 원리

실시간 화면 캡처 대신 **가상 시간(Virtual Time) 제어** 방식을 사용하여 프레임 드롭 없는 완벽한 품질을 보장합니다.

1. 페이지 로드 전 JS 타이밍 API(`setTimeout`, `requestAnimationFrame`, `performance.now`, `Date.now`)를 가상 시간 모드로 전환
2. 앱 마운트 후 프레임 단위로 가상 시간을 전진 (30fps 기준 매 33.3ms)
3. 매 프레임마다 PNG 스크린샷 캡처 (약 1,350프레임)
4. ffmpeg로 전체 프레임을 H.264 MP4로 인코딩 (CRF 18, 고품질)
5. 임시 프레임 파일 자동 정리

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev:client` | Vite 개발 서버 실행 (포트 5000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run check` | TypeScript 타입 검사 |
| `npm run record` | Puppeteer 영상 녹화 |

## 프로젝트 구조

```
client/
├── src/
│   ├── components/video/
│   │   ├── VideoTemplate.tsx       # 장면 오케스트레이터
│   │   └── video_scenes/           # 개별 장면 컴포넌트 (Scene0~6)
│   ├── lib/video/
│   │   ├── hooks.ts                # useVideoPlayer, useSceneTimer
│   │   └── animations.ts           # 공유 애니메이션 프리셋
│   └── index.css                   # CSS 변수, 디자인 토큰
scripts/
└── record.mjs                      # Puppeteer 녹화 스크립트
attached_assets/                    # 로고, 이미지 등 정적 에셋
```

## 경로 별칭

| 별칭 | 경로 |
|------|------|
| `@/` | `client/src/` |
| `@shared/` | `shared/` |
| `@assets/` | `attached_assets/` |
