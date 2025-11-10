# Contributing Guide

이 리포지토리는 PR 템플릿과 자동화 체크를 사용합니다.

## PR 템플릿
- 위치: `.github/PULL_REQUEST_TEMPLATE/`
- 작업 성격에 맞는 템플릿을 선택하세요 (feature / fix / refactor).
- **중간 PR**은 `Related: #이슈번호`만 사용하세요.
- **최종 PR**에서만 `Closes #이슈번호`를 사용하여 자동 종료합니다.

## PR 제목 규칙
- 형식: `FEAT: ~`, `FIX: ~`, `REFACTOR: ~`, `CHORE: ~` 등
- 규칙을 어기면 GitHub Actions가 실패 처리합니다.

## 리뷰 규칙
- CODEOWNERS에 지정된 리뷰어가 승인해야 머지됩니다(저장소 설정 > 브랜치 보호 규칙에서 활성화).
