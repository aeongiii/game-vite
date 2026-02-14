# game-vite

TypeScript + Vanilla JS + Vite 기반 미니 게임 프로젝트입니다.  
현재는 `Snake` 게임이 구현되어 있고, 이후 여러 게임을 추가할 수 있는 구조로 구성되어 있습니다.

## Tech Stack
- TypeScript
- Vite
- Vanilla JavaScript (DOM + Canvas API)
- GitHub Actions + GitHub Pages

## 구현된 기능
- Snake 기본 플레이
  - 방향키/WASD 이동
  - 사과 획득 시 점수 증가 + 몸 길이 증가
  - 벽/자기 몸 충돌 시 게임 오버
  - 게임 오버 오버레이 + 재시작 버튼
  - 게임 오버 상태에서 `Enter`/`Space` 재시작
- 속도 조절 (3단계)
  - Slow / Normal / Fast
  - 플레이 중 즉시 적용
- 다국어 지원 (EN/KR)
  - 런처 상단 언어 스위치 버튼
  - 게임 UI/설명 문구 동시 전환
  - 선택 언어 `localStorage` 유지
- 게임 설명 섹션
  - 광고 심사 대응을 위한 설명 콘텐츠(영/한)

## 구조와 구현 방식
- `src/main.ts`
  - 게임 런처 엔트리
  - 게임 레지스트리(`id`, `label`, `mount`) 기반 실행
  - 전역 언어 상태 관리 및 게임 재마운트
- `src/games/snake.ts`
  - Snake 게임 모듈
  - Canvas 렌더링, 입력 처리, 게임 루프(`setInterval`) 담당
  - 언어 리소스 딕셔너리 기반 UI 텍스트 생성
  - 속도 단계별 tick 간격 재설정
- `src/style.css`
  - 런처/게임 공통 스타일
  - 오버레이, 속도 버튼, 설명 섹션 UI 포함

## 실행
```bash
npm install
npm run dev
```

## 빌드
```bash
npm run build
```

## 배포
- GitHub Pages + GitHub Actions 사용
- 워크플로우: `.github/workflows/deploy-pages.yml`
- `staging` 브랜치 push 시 자동 배포
- Vite base 설정: `vite.config.ts` (`/game-vite/`)
