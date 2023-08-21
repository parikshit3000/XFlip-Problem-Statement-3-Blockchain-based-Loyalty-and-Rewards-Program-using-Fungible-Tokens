import axios from "axios";
const ADMIN_QUESTION_REQUEST = "ADMIN_QUESTION_REQUEST",
    ADMIN_QUESTION_SUCCESS = "ADMIN_QUESTION_SUCCESS",
    ADMIN_QUESTION_FAIL = "ADMIN_QUESTION_FAIL"


export const postQuestion = (questionData) => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_QUESTION_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const response = await axios.post(
            "/api/v1/admin/question/",
            questionData,
            config
        );

        dispatch({
            type: ADMIN_QUESTION_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: ADMIN_QUESTION_FAIL,
            payload: error.response.data.message,
        });
    }
};
