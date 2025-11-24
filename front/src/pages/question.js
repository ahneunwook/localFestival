import {createHeader} from "../components/header.js";

export function questionPage() {
    return `
    ${createHeader('questions')}
    <div class="question-container">
        <div class="page-title">
            <h1>문의 게시판</h1>
            <p>궁금한 사항을 문의해주세요. 다른 사용자들의 문의도 확인할 수 있습니다.</p>
        </div>

        <button class="write-btn" id="openWriteModalBtn">
            ✏️ 문의 작성하기
        </button>

        <div class="inquiry-list" id="inquiryList"></div>
    </div>

    <!-- 작성 모달 -->
    <div class="modal" id="writeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>문의 작성하기</h2>
                <button class="close-btn" data-close="writeModal">×</button>
            </div>
            <div class="modal-body">
                <form class="inquiry-form" id="inquiryForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">이름 *</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">이메일 *</label>
                            <input type="email" id="email" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="category">문의 유형 *</label>
                        <select id="category" required>
                            <option value="">선택하세요</option>
                            <option value="축제 관련">축제 관련</option>
                            <option value="예약/참가 문의">예약/참가 문의</option>
                            <option value="제휴 문의">제휴 문의</option>
                            <option value="기술 지원">기술 지원</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="subject">제목 *</label>
                        <input type="text" id="subject" required>
                    </div>

                    <div class="form-group">
                        <label for="message">문의 내용 *</label>
                        <textarea id="message" required></textarea>
                    </div>

                    <button type="submit" class="submit-btn">문의 등록하기</button>
                </form>
            </div>
        </div>
    </div>

    <!-- 상세보기 모달 -->
    <div class="modal" id="detailModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>문의 상세보기</h2>
                <button class="close-btn" data-close="detailModal">×</button>
            </div>
            <div class="modal-body" id="detailContent"></div>
        </div>
    </div>
    `;
}

export function questionPageInit() {

    // 샘플 데이터
    const inquiries = {
        1: {
            category: '축제 관련',
            title: '서울 벚꽃 축제 일정이 궁금합니다',
            author: '김민수',
            date: '2024.11.20',
            content: '내년 봄 서울에서 열리는 벚꽃 축제 일정을 알고 싶습니다.',
            status: '답변 완료',
            answer: '안녕하세요. 문의 주셔서 감사합니다.<br>서울 벚꽃 축제는 매년 4월 초 열립니다.'
        },
        2: {
            category: '예약/참가 문의',
            title: '단체 예약 가능한가요?',
            author: '이지은',
            date: '2024.11.19',
            content: '50명 참가 가능한가요?',
            status: '답변 대기중',
            answer: null
        },
        3: {
            category: '제휴 문의',
            title: '지역 축제 제휴 제안드립니다',
            author: '박철수',
            date: '2024.11.18',
            content: '저희 지역에서 운영하는 전통 문화 축제와 제휴를 제안드리고 싶습니다. 상세한 내용은 이메일로 보내드리겠습니다.',
            status: '답변 완료',
            answer: '안녕하세요. 제휴 제안 감사드립니다.\n\n파트너십 담당자가 보내주신 이메일로 연락드릴 예정입니다. 좋은 협력 관계를 기대하겠습니다.'
        }
    };

    // 리스트 렌더링
    const inquiryList = document.getElementById("inquiryList");
    inquiryList.innerHTML = Object.entries(inquiries)
        .map(([id, q]) => `
            <div class="inquiry-item" data-id="${id}">
                <div class="inquiry-header">
                    <span class="inquiry-category">${q.category}</span>
                    <span class="inquiry-date">${q.date}</span>
                </div>
                <div class="inquiry-title">${q.title}</div>
                <div class="inquiry-meta">
                    <span>👤 ${q.author}</span>
                    <span class="inquiry-status ${q.status === '답변 완료' ? 'status-answered' : 'status-pending'}">${q.status}</span>
                </div>
            </div>
        `).join("");

    // 모달 기능
    const writeModal = document.getElementById("writeModal");
    const detailModal = document.getElementById("detailModal");

    document.getElementById("openWriteModalBtn").onclick = () => {
        writeModal.classList.add("active");
    };

    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.onclick = () => {
            document.getElementById(btn.dataset.close).classList.remove("active");
        };
    });

    inquiryList.addEventListener("click", (e) => {
        const item = e.target.closest(".inquiry-item");
        if (!item) return;

        const id = item.dataset.id;
        const q = inquiries[id];

        const detail = document.getElementById("detailContent");
        let html = `
            <h3>${q.title}</h3>
            <p>${q.content}</p>
        `;
        if (q.answer) {
            html += `<hr><h3>답변</h3><p>${q.answer}</p>`;
        }

        detail.innerHTML = html;
        detailModal.classList.add("active");
    });

    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    };

    // 문의 등록
    const form = document.getElementById("inquiryForm");
    form.onsubmit = (e) => {
        e.preventDefault();
        alert("문의가 정상적으로 등록되었습니다.");
        writeModal.classList.remove('active');
        form.reset();
    };
}
