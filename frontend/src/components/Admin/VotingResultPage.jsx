import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionChart from "./QuestionChart"; // Create this component for rendering charts

const VotingResultPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/questions/");
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4">Governance DAO</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Decisions (Up for voting)</h3>
        <ul className="list-none p-0">
          {questions.map((question) => (
            <li
              key={question._id}
              className="p-2 mb-2 cursor-pointer bg-white"
              onClick={() => handleQuestionClick(question)}
            >
              {question.question}
            </li>
          ))}
          
        </ul>
      </div>
      {selectedQuestion && <QuestionChart question={selectedQuestion} />}
    </div>
  );
};

export default VotingResultPage;
