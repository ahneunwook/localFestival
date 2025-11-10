# 🏷️ 라벨 자동화 키트 (Label Automation Kit)

이 키트는 GitHub 저장소에서 **자동으로 라벨을 부착**하는 기능을 제공합니다.

## ✨ 자동 라벨링 기능

- **파일 경로 기반 라벨링**  
  → `actions/labeler` 사용  
  → 변경된 파일 경로에 따라 PR에 자동으로 라벨 부착  
  예: `front/**` → `feature`, `src/main/**` → `backend`

- **PR 제목 접두사 기반 라벨링**  
  → `TimonVS/pr-labeler-action` 사용  
  → PR 제목의 접두사(`FEAT:`, `FIX:`, `REFACTOR:`, `CHORE:` 등)에 따라 자동 라벨 부착  

- **이슈 제목 키워드 기반 라벨링**  
  → `github/issue-labeler` 사용  
  → 이슈 제목의 키워드(`\[FEAT]`, `버그`, `docs` 등)를 인식해 자동 라벨 부착  