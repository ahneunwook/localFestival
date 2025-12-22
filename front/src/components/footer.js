export function createFooter() {
  return `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-logo">FESTIVAL</h3>
          <p class="footer-description">전국의 모든 축제를 한눈에</p>
        </div>

        <div class="footer-section">
          <h4>빠른 링크</h4>
          <ul class="footer-links">
            <li><a href="/">소개</a></li>
            <li><a href="/festivals">축제 목록</a></li>
            <li><a href="/calendar">일정</a></li>
            <li><a href="/news">소식</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>커뮤니티</h4>
          <ul class="footer-links">
            <li><a href="/reviews">축제 후기</a></li>
            <li><a href="/top10">인기 축제</a></li>
            <li><a href="/questions">문의하기</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>지역별 축제</h4>
          <ul class="footer-links">
            <li><a href="/festivals/regions">지역 탐색</a></li>
            <li><a href="/search">검색</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 FESTIVAL. All rights reserved.</p>
      </div>
    </footer>
  `;
}
