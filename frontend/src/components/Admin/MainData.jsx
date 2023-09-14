import { useEffect } from "react";
import Chart from "chart.js/auto";
import { Doughnut, Line, Pie, Bar } from "react-chartjs-2";
import { getAdminProducts } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";

const MainData = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.users);

  let outOfStock = 0;

  products?.forEach((item) => {
    if (item.stock === 0) {
      outOfStock += 1;
    }
  });

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = orders?.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

const pricePoints = [
  ["100,000", 0.874],
  ["105,000", 1.123],
  ["110,000", 0.621],
  ["115,000", 1.567],
  ["120,000", 0.789],
  ["125,000", 1.332],
  ["130,000", 1.234],
  ["135,000", 0.976],
  ["140,000", 1.789],
  ["145,000", 0.432],
  ["150,000", 1.654],
  ["155,000", 0.987],
  ["160,000", 1.234],
  ["165,000", 1.567],
  ["170,000", 0.765],
  ["175,000", 1.234],
  ["180,000", 0.876],
  ["185,000", 1.432],
  ["190,000", 1.111],
  ["195,000", 0.765],
  ["200,000", 1.345],
  ["205,000", 1.234],
];



  const lineState = {
    labels: pricePoints.map((point) => point[0]),
    datasets: [
      {
        label: `Value of XFlip (in Rs)`,
        borderColor: "#8A39E1",
        backgroundColor: "#8A39E1",
        data: pricePoints.map((point) => point[1]),
      },
    ],
  };

  return (
    <>
      <MetaData title="Admin Dashboard | Flipkart" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6">
        <div className="flex flex-col bg-purple-600 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
          <h4 className="text-gray-100 font-medium">Current Token Supply</h4>
          <h2 className="text-2xl font-bold">100,000</h2>
        </div>
        <div className="flex flex-col bg-red-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
          <h4 className="text-gray-100 font-medium">Current Token Holders</h4>
          <h2 className="text-2xl font-bold">1047</h2>
        </div>
        <div className="flex flex-col bg-yellow-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
          <h4 className="text-gray-100 font-medium">Treasury Tokens</h4>
          <h2 className="text-2xl font-bold">25,000</h2>
        </div>
        <div className="flex flex-col bg-green-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
          <h4 className="text-gray-100 font-medium">Total Tokens Redeemed</h4>
          <h2 className="text-2xl font-bold">3394</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-8 min-w-full">
        <div className="bg-white rounded-xl h-auto w-full shadow-lg p-2">
          <Line data={lineState} />
        </div>
      </div>
    </>
  );
};

export default MainData;
