export function SignupPage() {
  return `
    <div class="login-page">
      <div class="login-container">
        <div class="logo">FESTIVAL</div>
        <div class="subtitle">대한민국 대표 축제 플랫폼</div>

        <form>
          <div class="form-group">
            <label for="signup-name">이름</label>
            <input type="text" id="signup-name" placeholder="이름을 입력하세요" required>
          </div>

          <div class="form-group">
            <label for="signup-email">이메일</label>
            <input type="email" id="signup-email" placeholder="example@email.com" required>
          </div>

          <div class="form-group">
            <label for="signup-password">비밀번호</label>
            <input type="password" id="signup-password" placeholder="8자 이상 입력하세요" required>
          </div>

          <div class="form-group">
            <label for="signup-password-confirm">비밀번호 확인</label>
            <input type="password" id="signup-password-confirm" placeholder="비밀번호를 다시 입력하세요" required>
          </div>

          <div class="options">
            <label class="remember-me">
              <input type="checkbox" required>
              <span>이용약관 및 개인정보처리방침에 동의합니다</span>
            </label>
          </div>

          <button type="submit" class="login-btn">회원가입</button>
        </form>

        <div class="divider">
          <span>또는</span>
        </div>

        <div class="social-login">
          <button class="social-btn">카카오</button>
          <button class="social-btn">네이버</button>
          <button class="social-btn">구글</button>
        </div>

        <div class="signup-link">
          이미 회원이신가요? <a href="/login" data-link>로그인</a>
        </div>
      </div>
    </div>
  `;
}
