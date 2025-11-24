import { authApi } from '../api/AuthApi.js';

export function SignupPage() {
  setTimeout(() => {
    initializeSignupForm();
  }, 0);

  return `
    <div class="login-page">
      <div class="login-container">
        <div class="logo">FESTIVAL</div>
        <div class="subtitle">대한민국 대표 축제 플랫폼</div>

        <form id="signup-form">
          <div class="form-group">
            <label for="signup-name">이름</label>
            <input type="text" id="signup-name" name="userName" placeholder="이름을 입력하세요" required>
          </div>

          <div class="form-group">
            <label for="signup-email">이메일</label>
            <input type="email" id="signup-email" name="email" placeholder="example@email.com" required>
          </div>

          <div class="form-group">
            <label for="signup-password">비밀번호</label>
            <input type="password" id="signup-password" name="password" placeholder="8자 이상 입력하세요" required>
          </div>
          
          <div class="form-group">
            <label for="signup-password-confirm">비밀번호 확인</label>
            <input type="password" id="signup-password-confirm" name="confirmPassword" placeholder="비밀번호를 다시 입력하세요" required>
          </div>

          <div class="form-group">
            <label for="gender">성별</label>
            <select id="gender" name="gender" required>
              <option value="">성별을 선택해주세요</option>
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
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

function initializeSignupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const signupRequestDto = {
      userName : formData.get('userName'),
      email : formData.get('email'),
      password : formData.get('password'),
      confirmPassword : formData.get('confirmPassword'),
      gender : formData.get('gender')
    };

    try {
      const result = await authApi.signUp(signupRequestDto);

      alert('회원가입에 성공했습니다!');
      window.location.href = '/login';
    } catch (error) {
      // 백엔드에서 온 에러 처리
      console.error('회원가입 실패:', error);

      // 에러 메시지 표시
      if (error.message) {
        alert(error.message); // 백엔드 에러 메시지 표시
      } else {
        alert('회원가입에 실패했습니다.');
      }
    }
  })
}
