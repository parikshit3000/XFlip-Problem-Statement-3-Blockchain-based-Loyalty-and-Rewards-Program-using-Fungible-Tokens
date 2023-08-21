import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { Address } from "../../blockchain/config";
import { nftAddress } from "../../blockchain/config";
import DynamicToken from "../../blockchain/artifacts/contracts/DynamicToken.sol/DynamicToken.json";
import NFTEE from "../../blockchain/artifacts/contracts/NFTEE.sol/NFTEE.json";
import Web3Modal from "web3modal";
import { useSnackbar } from "notistack";


const AnswerPage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchQuestions(); // Fetch all questions when the component mounts
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/questions/"); // Adjust the API endpoint
      const questionsData = response.data;
      setQuestions(questionsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuestionSelect = (question) => {
    // setSelectedQuestion(question);
    setSelectedQuestion(() => question);
    console.log("Selected question: ", selectedQuestion);
    setSelectedOption(""); // Reset selected option when a new question is selected
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    console.log("Selected option: ", selectedOption);
  };

  const user = useSelector((state) => state.user);
  const userId = user.user._id; // Get the userId of the logged-in user, replace with your logic

  const handleSubmit = async (e) => {
    await sign();
    e.preventDefault();
    try {
      if (!selectedQuestion) {
        return; // Exit if no question is selected
      }

      // Check if the user has already voted for the selected question
      if (selectedQuestion.votedBy.includes(userId)) {
        console.log("User has already voted for this question");
        return;
      }

      console.log("Inside handlesubmit1: ", userId);
      console.log("Inside handlesubmit2: ", selectedQuestion);
      console.log("Inside handlesubmit3: ", selectedOption);
      const response = await axios.post(
        `http://localhost:4000/dao/vote/${selectedQuestion._id}`, // Use questionId in the URL params
        {
          userId: userId, // Save the userId for the question
          optionText: selectedOption,
        }
      );
      console.log("Response data", response.data); // Handle success or display a message
      fetchQuestions(); // Refetch questions after submitting
      setSelectedQuestion(null); // Clear selected question
      enqueueSnackbar("Voted Successfully", { variant: "success" });
      setSelectedOption(""); // Clear selected option
    } catch (error) {
      console.error(error);
    }
  };

  const sign = async () => {
    console.log("signing");
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // console.log(provider);
    // sign the message
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(nftAddress, NFTEE.abi, signer);
    console.log(contract);
    let transaction = await contract.mint("1");
    console.log(transaction);
    // enqueueSnackbar(`${name} Tokens deducted`, { variant: "success" });
  };

  return (
    <div className="w-full mt-20">
      <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
        {/* <!-- cart column --> */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold my-4">
            Welcome to XFlip Governance DAO
          </h2>
          <p className="mb-4">
            The governance DAO in our blockchain-based loyalty and rewards
            program enables our community members,
            including users and partners, to collectively propose, discuss, and
            vote on decisions regarding program rules, features, and changes.
            This ensures that decisions are transparent, inclusive, and aligned
            with the interests of those involved, fostering a dynamic and
            user-driven ecosystem.
          </p>
          <h1 className="font-semibold"> 2 XFlip = 1 Vote (At current exchange rate: 0.85 XFlip/Rup)</h1>
          <div className="bg-white p-4 rounded-lg shadow mt-10 ">
            <ul className="list-none p-0">
              {questions.map((question) => (
                <li
                  key={question._id}
                  className={`p-2 mb-2 cursor-pointer border-b-2`}
                  onClick={() => handleQuestionSelect(question)}
                >
                  {question.question}
                </li>
              ))}
            </ul>
          </div>
          {selectedQuestion && (
            <div className="bg-white p-4 mt-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {selectedQuestion.question}
              </h2>
              <ul className="list-none p-0">
                {selectedQuestion.options.map((optionObj, index) => (
                  <li
                    key={index}
                    className={`p-2 mb-2 cursor-pointer ${
                      selectedOption === optionObj.optionText
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => handleOptionSelect(optionObj.optionText)}
                  >
                    {optionObj.optionText}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white py-2 px-4 mt-4 rounded-lg"
                disabled={!selectedOption}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
