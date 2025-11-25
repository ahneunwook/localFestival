/**
 * JWT 토큰을 디코딩하여 페이로드를 반환
 * @param {string} token - JWT 토큰 (Bearer 포함 가능)
 * @returns {object|null} 디코딩된 페이로드 또는 null
 */
export function decodeJWT(token) {
  try {
    // Bearer 제거
    const actualToken = token.replace('Bearer ', '');
    
    // JWT는 header.payload.signature 구조
    const payload = actualToken.split('.')[1];
    
    if (!payload) {
      return null;
    }
    
    // Base64 디코딩
    const decoded = JSON.parse(atob(payload));
    
    return decoded;
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
}

/**
 * 현재 로그인한 사용자의 role을 반환
 * @returns {string|null} 'ADMIN' | 'USER' | null
 */
export function getUserRole() {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return null;
  }
  
  const decoded = decodeJWT(token);
  return decoded?.userRole || null;
}

/**
 * 현재 사용자가 ADMIN 권한을 가지고 있는지 확인
 * @returns {boolean}
 */
export function isAdmin() {
  return getUserRole() === 'ADMIN';
}

/**
 * 현재 사용자가 로그인 상태인지 확인
 * @returns {boolean}
 */
export function isLoggedIn() {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return false;
  }
  
  // 토큰 만료 확인
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return false;
  }
  
  // exp는 초 단위, Date.now()는 밀리초 단위
  const isExpired = decoded.exp * 1000 < Date.now();
  
  if (isExpired) {
    // 만료된 토큰은 제거
    localStorage.removeItem('accessToken');
    return false;
  }
  
  return true;
}

/**
 * 현재 사용자 정보 반환
 * @returns {object|null} { userId, userName, userRole, exp }
 */
export function getCurrentUser() {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return null;
  }
  
  const decoded = decodeJWT(token);
  
  if (!decoded) {
    return null;
  }
  
  return {
    userId: decoded.sub,
    userName: decoded.userName,
    userRole: decoded.userRole,
    exp: decoded.exp
  };
}