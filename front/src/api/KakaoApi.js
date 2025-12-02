const API_BASE_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=1c6850ea6c7624a34cc0553f3b13753a&autoload=false`;

let loadPromise = null;

// 지도 호출
export function loadKakaoMap() {
  if (window.kakao && window.kakao.maps) {
    return Promise.resolve(window.kakao);
  }

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = API_BASE_URL;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };

    script.onerror = reject;
    document.head.appendChild(script);
  });

  return loadPromise;
}