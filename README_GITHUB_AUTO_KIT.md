# GitHub 협업 자동화 키트 (DESIGN 포함 최종판)

## 설치
1) `.github/` 폴더를 리포지토리 루트에 복사
2) 라벨 생성 (Settings → Labels):
   feature, bug, refactor, docs, chore, test, perf, style, backend, ci, design
3) 커밋 & 푸시

## 사용
- PR은 `.github/pull_request_template.md`가 자동으로 본문을 채웁니다.
- PR 제목 접두사에 따라 라벨이 자동 부착됩니다 (예: `DESIGN:` → `design`).
- 이슈는 `ISSUE_TEMPLATE`에서 선택해 생성합니다.
