import {createHeader} from "../components/header.js";
import { questionApi } from '../api/questionApi.js';
import { formatDate } from "./News.js";
import {getCurrentUser} from "../utils/auth.js";

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
                <h2 id="modalTitle">문의 작성하기</h2>
                <button class="close-btn" data-close="writeModal">×</button>
            </div>
            <div class="modal-body">
                <form class="inquiry-form" id="inquiryForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">이름 *</label>
                            <input type="text" id="name" readonly>
                        </div>
                        <div class="form-group">
                            <label for="email">이메일 *</label>
                            <input type="email" id="email" readonly>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="category">문의 유형 *</label>
                        <select id="category" name="category" required>
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
                        <input type="text" id="subject" name="title" required>
                    </div>

                    <div class="form-group">
                        <label for="message">문의 내용 *</label>
                        <textarea id="message" name="content" required></textarea>
                    </div>
                    <input type="hidden" id="editQuestionId">

                    <button type="submit" class="submit-btn">문의 등록하기</button>
                </form>
            </div>
        </div>
    </div>

    <!-- 상세보기 모달 -->
    <div class="modal" id="detailModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>문의</h2>
                <button class="close-btn" data-close="detailModal">×</button>
            </div>
            <div class="modal-body" id="detailContent"></div>
            
            <div class="modal-actions">
                <button id="editQuestionBtn" class="edit-question-btn question-hidden">수정</button>
                <button id="deleteQuestionBtn" class="delete-question-btn question-hidden">삭제</button>
            </div>
        </div>
    </div>
    `;
}

export async function questionPageInit() {
    const questions = await questionApi.getQuestionList();
    const inquiryList = document.getElementById("inquiryList");

    inquiryList.innerHTML = questions
        .map(question => `
        <div class="inquiry-item" data-id="${question.id}">
            <div class="inquiry-header">
                <span class="inquiry-category">${question.category}</span>
                <span class="inquiry-date">${formatDate(question.createdAt)}</span>
            </div>
            <div class="inquiry-title">${question.title}</div>
            <div class="inquiry-meta">
                <span>👤 ${question.authorName}</span>
                <span class="inquiry-status ${question.status === '답변 완료' ? 'status-answered' : 'status-pending'}">
                    ${question.status}
                </span>
            </div>
        </div>
    `)
        .join("");

    const writeModal = document.getElementById("writeModal");
    const detailModal = document.getElementById("detailModal");

    // 작성 버튼
    document.getElementById("openWriteModalBtn").onclick = async () => {
        await questionApi.openQuestionModal();
        openCreateModal();
    };

    // 닫기 버튼
    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.onclick = () => {
            document.getElementById(btn.dataset.close).classList.remove("active");
        };
    });

    // 상세보기
    inquiryList.addEventListener("click", async (e) => {
        const item = e.target.closest(".inquiry-item");
        if (!item) return;

        const id = item.dataset.id;

        try {
            const question = await questionApi.getQuestionDetail(id);

            const detail = document.getElementById("detailContent");
            let html = `
                <h3>${question.title}</h3>
                <p>${question.content}</p>
            `;
            if (question.answer) {
                html += `<hr><h3>답변</h3><p>${question.answer}</p>`;
            } else {
                html += `
                    <hr>
                    <h3>답변</h3>
                    <p class="no-answer">아직 답변이 등록되지 않았습니다.</p>
                `;
            }

            detail.innerHTML = html;

            const editBtn = document.getElementById("editQuestionBtn");
            const deleteBtn = document.getElementById("deleteQuestionBtn");

            const currentUser = getCurrentUser();
            const currentUserId = Number(currentUser.userId);
            const isAdminUser = currentUser.userRole === "ADMIN";

            if (currentUserId === question.authorId || isAdminUser) {
                editBtn.classList.remove("question-hidden");
                editBtn.onclick = async () => {
                    await questionApi.openQuestionModal();  // 사용자 정보 로드
                    openEditModal(question);
                };
            } else {
                editBtn.classList.add("question-hidden");
            }

            // 삭제 버튼 표시
            if (currentUserId === question.authorId || isAdminUser) {
                deleteBtn.classList.remove("question-hidden");
                deleteBtn.onclick = () => handleDeleteQuestion(question.id);
            } else {
                deleteBtn.classList.add("question-hidden");
            }

            detailModal.classList.add("active");

        } catch (error) {
            console.error('상세 정보 로드 실패:', error);
            alert('문의 내용을 불러오는데 실패했습니다.');
        }
    });

    // 모달 외부 클릭
    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    };

    // 문의 등록/수정
    const form = document.getElementById("inquiryForm");
    form.onsubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("editQuestionId").value;

        const questionData = {
            category: document.getElementById("category").value,
            title: document.getElementById("subject").value,
            content: document.getElementById("message").value
        };

        try {
            if (id) {
                await questionApi.updateQuestion(id, questionData);
                alert("문의가 수정되었습니다.");
            } else {
                await questionApi.createQuestion(questionData);
                alert("문의가 등록되었습니다.");
            }

            writeModal.classList.remove("active");
            form.reset();
            location.reload();  // 목록 새로고침

        } catch (err) {
            alert(err.message);
        }
    };
}

function openCreateModal() {
    const modalTitle = document.querySelector("#writeModal .modal-header h2");
    const submitBtn = document.querySelector("#inquiryForm .submit-btn");

    if (modalTitle) modalTitle.textContent = "문의 작성하기";
    if (submitBtn) submitBtn.textContent = "문의 등록하기";

    document.getElementById("editQuestionId").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";
    document.getElementById("category").value = "";

    document.getElementById("writeModal").classList.add("active");
}

function openEditModal(q) {
    const modalTitle = document.querySelector("#writeModal .modal-header h2");
    const submitBtn = document.querySelector("#inquiryForm .submit-btn");

    if (modalTitle) modalTitle.textContent = "문의 수정하기";
    if (submitBtn) submitBtn.textContent = "수정하기";

    document.getElementById("editQuestionId").value = q.id;
    document.getElementById("subject").value = q.title;
    document.getElementById("message").value = q.content;
    document.getElementById("category").value = q.category;

    document.getElementById("detailModal").classList.remove("active");
    document.getElementById("writeModal").classList.add("active");
}

async function handleDeleteQuestion(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
        await questionApi.deleteQuestion(id);

        alert("문의가 삭제되었습니다.");

        // 모달 닫기
        document.getElementById("detailModal").classList.remove("active");

        // 리스트 다시 불러오기 (새로고침 없이 갱신)
        questionPageInit();

    } catch (err) {
        alert(err.message || "삭제에 실패했습니다.");
    }
}