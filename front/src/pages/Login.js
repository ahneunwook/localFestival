import {authApi} from "../api/AuthApi.js";
import { initNotifications } from '../utils/notifications.js';

export function LoginPage() {
  return `
    <div class="login-page">
      <div class="login-container">
        <div class="logo">FESTIVAL</div>
        <div class="subtitle">대한민국 대표 축제 플랫폼</div>

        <form id="login-form">
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" placeholder="example@email.com" required>
          </div>

          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" placeholder="비밀번호를 입력하세요" required>
          </div>

          <div class="options">
            <label class="remember-me">
              <input type="checkbox">
              <span>로그인 상태 유지</span>
            </label>
            <a href="#" class="forgot-password">비밀번호 찾기</a>
          </div>

          <button type="submit" class="login-btn">로그인</button>
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
          아직 회원이 아니신가요? <a href="/signup" data-link>회원가입</a>
        </div>
      </div>
    </div>
  `;
}

export function login(){
  const form = document.getElementById('login-form');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginRequest = {
      email : document.getElementById("email").value,
      password : document.getElementById("password").value,
    }

    try {
      const result = await authApi.login(loginRequest);
	  
      localStorage.setItem("accessToken", result.data.accessToken);
	  initNotifications();
      alert("로그인이 완료되었습니다.");
      window.location.href = "/";
    } catch (err) {
      alert(err.message);
    }
  })
}