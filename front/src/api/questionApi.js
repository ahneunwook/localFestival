const API_BASE_URL = 'http://localhost:8080/api';

export const questionApi = {
    // 문의 생성
    async createQuestion(questionData){
        try{
            const response = await fetch(`${API_BASE_URL}/questions`, {
               method : 'POST',
               headers : {
                   'Content-Type' : 'application/json',
                   'Authorization': localStorage.getItem('accessToken'),
               },
                body: JSON.stringify(questionData),
            });
            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message);
            }
            return data.data;

        } catch (error){
            throw error;
        }
    },

    async openQuestionModal(){
        try {
            const response = await fetch(`${API_BASE_URL}/questions/users/me`, {
                headers: {
                    "Authorization": localStorage.getItem("accessToken")
                }
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message);
            }

            document.getElementById("name").value = data.data.userName;
            document.getElementById("email").value = data.data.email;

            document.getElementById("writeModal").classList.add("active");

            return data.data;
        } catch (error) {
            throw error;
        }
    }

}
