export function createHeader(activePage = '') {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return `
    <header class="header">
      <div class="logo" onclick="window.location.href='/'" style="cursor: pointer;">FESTIVAL</div>
      <nav class="nav">
        <a href="/" data-link class="${activePage === 'home' ? 'active' : ''}">소개</a>
        <a href="/festivals" data-link class="${activePage === 'list' ? 'active' : ''}">축제 목록</a>
        <a href="#schedule" class="${activePage === 'schedule' ? 'active' : ''}">일정</a>
        <a href="/news" data-link class="${activePage === 'news' ? 'active' : ''}">소식</a>
        <a href="/questions" class="${activePage === 'questions' ? 'active' : ''}">문의</a>
      </nav>
       <div class="auth-buttons">
        ${isLoggedIn
      ? `<span id="logoutBtn" style="cursor: pointer;">로그아웃</span>`
      : `
             <span onclick="window.location.href='/login'" style="cursor: pointer;">로그인</span>
             <span onclick="window.location.href='/signup'" style="cursor: pointer;">회원가입</span>
            `
  }
      </div>
    </header>
  `;
}


