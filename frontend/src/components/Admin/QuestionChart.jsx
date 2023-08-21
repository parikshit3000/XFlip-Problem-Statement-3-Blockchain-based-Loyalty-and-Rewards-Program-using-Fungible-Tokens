import React from "react";
import { Pie } from "react-chartjs-2";

const QuestionChart = ({ question }) => {
  const data = {
    labels: question.options.map((option) => option.optionText),
    datasets: [
      {
        data: question.options.map((option) => option.votes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#66CC99",
          "#FF9900",
        ],
      },
    ],
  };

  return (
    <div className="bg-white h-auto w-96 p-4 mt-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Vote Distribution</h3>
      <Pie data={data}/>
    </div>
  );
};

export default QuestionChart;
