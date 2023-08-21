import React, { useState } from "react";
import axios from "axios";
// ekje
const VotingPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { optionText: "" },
    { optionText: "" },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
      const response = await axios.post("http://localhost:4000/question/", {
        question,
        options: options.map((opt) => opt.optionText), // Extract optionText from the options array
      });
      console.log(response.data); // Handle success or display a message
      window.location.reload();
    } catch (error) {
      console.error(error);
    } 
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].optionText = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, { optionText: "" }]);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Admin Panel</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <label className="block mb-3">
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="block w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </label>
        {options.map((option, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1">Option {index + 1}:</label>
            <input
              type="text"
              value={option.optionText}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="block w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
        <button
          onClick={addOption}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
        >
          Add Option
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
        >
          Post Question
        </button>
      </form>
    </div>
  );
};

export default VotingPage;
