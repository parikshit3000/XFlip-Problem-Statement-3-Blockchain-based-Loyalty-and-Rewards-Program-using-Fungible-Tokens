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
    ["100,000", 1],
    ["105,000", 1.2],
    ["110,000", 1.44],
    ["115,000", 1.73],
    ["120,000", 2.08],
    ["125,000", 2.5],
    ["130,000", 3],
    ["135,000", 3.6],
    ["140,000", 4.32],
    ["145,000", 5.18],
    ["150,000", 6.22],
    ["155,000", 7.46],
    ["160,000", 8.95],
    ["165,000", 10.74],
    ["170,000", 8.59],
    ["175,000", 6.87],
    ["180,000", 5.5],
    ["185,000", 6.6],
    ["190,000", 7.92],
    ["195,000", 6.34],
    ["200,000", 5.07],
    ["205,000", 6.084],
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
          <h2 className="text-2xl font-bold">1000</h2>
        </div>
        <div className="flex flex-col bg-yellow-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
          <h4 className="text-gray-100 font-medium">Treasury Tokens</h4>
          <h2 className="text-2xl font-bold">20,000</h2>
        </div>
        <div className="flex flex-col bg-green-500 text-white gap-2 rounded-xl shadow-lg hover:shadow-xl p-6">
          <h4 className="text-gray-100 font-medium">Total Tokens Redeemed</h4>
          <h2 className="text-2xl font-bold">5000</h2>
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
