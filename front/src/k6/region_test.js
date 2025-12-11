import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 500,          // 동시에 접속하는 가상 유저 수
    duration: '20s',  // 테스트 시간
};

export default function () {
    const region = "서울";
    const url = "http://host.docker.internal:8080/api/festivals/regions/counts";

    //festivals/regions?region=${encodeURIComponent(region)}&page=0\`;

    const res = http.get(url);

    check(res, {
        'status was 200': (r) => r.status === 200,
    });

    sleep(1);
}