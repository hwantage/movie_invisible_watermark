# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

소만사의 비가시성 워터마크 보안 제품 홍보 애니메이션 영상 프로젝트(신한은행 대상). 타이머 기반으로 장면(Scene)을 자동 전환하는 React SPA로 구축되어 있으며, 화면 녹화를 통해 영상 파일로 변환하는 용도로 설계됨.

## 명령어

- `npm run dev:client` — Vite 개발 서버 실행 (포트 5000)
- `npm run build` — 프로덕션 빌드 (`dist/public/`으로 출력)
- `npm run check` — TypeScript 타입 검사 (emit 없음)

테스트 프레임워크는 설정되어 있지 않음.

## 아키텍처

**장면 기반 영상 시스템:** `VideoTemplate` 컴포넌트가 Scene0~Scene5를 타이머로 자동 전환하며 재생 (사용자 인터랙션 없음).

핵심 흐름: `main.tsx` → `App.tsx` → `VideoTemplate.tsx` → Scene 컴포넌트들

### 핵심 구성요소

- **`client/src/components/video/VideoTemplate.tsx`** — 오케스트레이터. `SCENE_DURATIONS`(장면별 밀리초)를 정의하고, `useVideoPlayer` 훅으로 `currentScene`을 추적하며, Framer Motion `AnimatePresence` 안에서 장면을 렌더링.
- **`client/src/components/video/video_scenes/Scene0-5.tsx`** — 개별 장면 컴포넌트. 각 장면은 `useState`/`setTimeout`으로 내부 애니메이션 단계(phase)를 관리하고, 애니메이션 라이브러리의 프리셋을 사용.
- **`client/src/lib/video/hooks.ts`** — `useVideoPlayer` (장면 전환 + 루프 + `window.startRecording`/`stopRecording` 녹화 라이프사이클) 및 `useSceneTimer` (장면 내 특정 타이밍에 콜백 실행).
- **`client/src/lib/video/animations.ts`** — 공유 애니메이션 프리셋: 스프링 설정, 이징 커브, 장면 전환 효과 (fadeBlur, clipCircle, wipe 등), 요소 애니메이션, 키네틱 타이포그래피 variants. 모두 Framer Motion 호환.

### 경로 별칭 (vite.config.ts 및 tsconfig.json에서 설정)

- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### 스타일링

- Tailwind CSS v4 + `@tailwindcss/vite` 플러그인
- `client/src/index.css`에 CSS 변수로 디자인 토큰 정의 (브랜드 색상: `--color-primary: #0046FF` 등)
- 폰트: Outfit (디스플레이), Noto Sans KR (본문), JetBrains Mono (모노) — Google Fonts에서 로드
- shadcn/ui 설정됨 (new-york 스타일) 하지만 최소한으로 사용; 애니메이션은 주로 Framer Motion 활용
- 해상도 독립적 스케일링을 위해 뷰포트 상대 단위(`vw`, `vh`) 전반적으로 사용

### 주요 컨벤션

- 장면 컴포넌트는 `phase` 상태 패턴 사용: `useState(0)` + `setTimeout` 체인으로 내부 애니메이션 순차 실행
- 장면 전환 효과는 스프레드로 적용: `{...sceneTransitions.fadeBlur}`
- 모든 콘텐츠는 한국어
- 정적 에셋(로고, 스크린샷)은 `attached_assets/`에 위치
