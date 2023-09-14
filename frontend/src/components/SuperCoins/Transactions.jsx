import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layouts/MetaData";
import axios from "axios";
import SaveForLaterItem from "./SaveForLaterItem";
import { Link } from "react-router-dom";
import { BsBoxArrowUpRight } from "react-icons/bs";

const tx = [
  {
    transaction_hash: "0x1234567890",
    note: "Token transfer",
    timestamp: "2021-09-01 12:00:00",
    buyer: "0x1234567890",
    amount: "110",
    seller: "0x1234567890",
  },
  {
    transaction_hash: "0xcd12833249832nnadsa",
    note: "Token Stake",
    timestamp: "2021-09-01 12:00:00",
    buyer: "0xcDf178734382",
    amount: "200",
    seller: "0x1234567890",
  },
  {
    transaction_hash: "0x1234567890",
    note: "Token Redeem",
    timestamp: "2021-09-01 12:00:00",
    buyer: "0x1234567890",
    amount: "130",
    seller: "0x1234567890",
  },
  {
    transaction_hash: "0x1234567890",
    note: "Token transfer",
    timestamp: "2021-09-01 12:00:00",
    buyer: "0x1234567890",
    amount: "140",
    seller: "0x1234567890",
  },
  {
    transaction_hash: "0x1234567890",
    note: "Token Reward",
    timestamp: "2021-09-01 12:00:00",
    buyer: "0x1234567890",
    amount: "30",
    seller: "0x1234567890",
  },
];

const Transactions = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { saveForLaterItems } = useSelector((state) => state.saveForLater);
  const [transactions, setTransactions] = useState([]);
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  const placeOrderHandler = () => {
    navigate("/login?redirect=shipping");
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  // useEffect
  useEffect(() => {
    axios
      .get(
        "https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=0xE084e0b47007812cdFEc142783f530cd5A8484a2&startblock=0&endblock=99999999&page=2&offset=10&sort=asc&apikey=7PR586J85ZAYCK5R8W4MI3MZJCD2FTVW8S"
      )
      .then((res) => {
        console.log(res);
        console.log(res.data.result);
        // reverse the array
        res.data.result.reverse();
        setTransactions(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // function UnixTimestampConverter(tp) {
  //   const dateObject = new Date(tp * 1000); // Convert Unix timestamp to milliseconds

  //   const year = dateObject.getFullYear();
  //   const month = ("0" + (dateObject.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-based
  //   const day = ("0" + dateObject.getDate()).slice(-2);
  //   const hours = ("0" + dateObject.getHours()).slice(-2);
  //   const minutes = ("0" + dateObject.getMinutes()).slice(-2);
  //   const seconds = ("0" + dateObject.getSeconds()).slice(-2);

  //   const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  //   return <div>{formattedDateTime}</div>;
  // }

  function UnixTimestampConverter(tp) {
    const currentDate = new Date();
    const timestampDate = new Date(tp * 1000);

    const timeDifference = currentDate - timestampDate;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const monthsDifference = Math.floor(daysDifference / 30.44); // Average month length
    const yearsDifference = Math.floor(monthsDifference / 12);

    if (yearsDifference >= 1) {
      return (
        <div>{`${yearsDifference} year${
          yearsDifference > 1 ? "s" : ""
        } ago`}</div>
      );
    } else if (monthsDifference >= 1) {
      return (
        <div>{`${monthsDifference} month${
          monthsDifference > 1 ? "s" : ""
        } ago`}</div>
      );
    } else if (daysDifference >= 1) {
      return (
        <div>{`${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`}</div>
      );
    } else if (hoursDifference >= 1) {
      return (
        <div>{`${hoursDifference} hour${
          hoursDifference > 1 ? "s" : ""
        } ago`}</div>
      );
    } else if (minutesDifference >= 1) {
      return (
        <div>{`${minutesDifference} minute${
          minutesDifference > 1 ? "s" : ""
        } ago`}</div>
      );
    } else {
      return (
        <div>{`${secondsDifference} second${
          secondsDifference !== 1 ? "s" : ""
        } ago`}</div>
      );
    }
  }

  return (
    <>
      <MetaData title="Shopping Cart | Flipkart" />
      <main className="w-full mt-20">
        {/* <!-- row --> */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
          {/* <!-- cart column --> */}
          <div className="flex-1">
            {/* <!-- cart items container --> */}
            <div className="flex flex-col shadow bg-white">
              <Link
                to="/user/dashboard"
                className="flex underline font-medium text-lg px-2 sm:px-8 py-4 border-b underline-offset-2"
              >
                XFlip coins Balance : {user.coins}
                <BsBoxArrowUpRight className="ml-2 mt-1" />
              </Link>

              {/* <div class="font-bold mb-2 text-xl flex items-center">
                <RiWallet3Fill className=" mr-2" />
                <p className=" font-Poppins text-custom-white">
                  Wallet Balance
                </p>
                <a
                  href={`https://goerli.etherscan.io/address/${userInfo?.address}`}
                  target="_blank"
                  className="text-custom-blue1 text-sm ml-2 underline underline-offset-2"
                >
                  {userInfo?.address}
                </a>
                <BsBoxArrowUpRight className="ml-1 text-custom-blue1 text-sm" />
              </div> */}

              {transactions.length > 0 ? (
                <table className="table-fixed w-full mt-4 mb-2 overflow-scroll overflow-y-auto ">
                  <thead>
                    <tr className="text-white bg-primary-blue rounded-md">
                      <th className="text-left px-4 py-2 border-b border-slate-400">
                        Transaction Hash
                      </th>
                      <th className="text-left px-4 py-2 border-b border-slate-400">
                        Note
                      </th>
                      <th className="px-4 py-2 border-b border-slate-400 text-center">
                        Time
                      </th>
                      {/* <th className="text-left px-4 py-2 border-b border-slate-400">
                        Block Number
                      </th> */}
                      <th className="text-left px-4 py-2 border-b border-slate-400">
                        Buyer
                      </th>
                      <th className="text-center px-4 py-2 border-b border-slate-400 break-words">
                        Amount
                      </th>
                      <th className="text-left px-4 py-2 border-b border-slate-400">
                        Seller
                      </th>
                    </tr>
                  </thead>
                  <tbody className="overflow-scroll overflow-y-auto">
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction}
                        className="text-custom-white custom-gray rounded-md even:bg-gray-300 odd:bg-white"
                      >
                        <td className=" border-b border-slate-400 px-4 py-2 overflow-clip overflow-ellipsis">
                          {transaction.hash}
                        </td>
                        <td className="border-b border-slate-400 px-4 py-2">
                          <p className="bg-yellow-100 text-black w-fit py-1 rounded-md px-4 ">

                            {transaction.functionName.substring( 0, transaction.functionName.indexOf('(') )}

                          </p>
                        </td>
                        <td className="border-b border-slate-400 py-2 px-2 text-center">
                          {/* Convert the unix timestamp to date and time */}
                          {/* {new Date(transaction.timeStamp).toLocaleString()} */}
                          {UnixTimestampConverter(transaction.timeStamp)}
                        </td>
                        {/* <td className="border-b border-slate-400 py-2 px-2 w-min">
 
                          {transaction.blockNumber}
                        </td> */}
                        <td className="border-b px-2 py-2 border-slate-400 overflow-clip overflow-ellipsis text-blue-400 cursor-pointer">
                          {transaction.from}
                        </td>
                        <td className="border-b px-2 py-2 border-slate-400 break-words text-center">
                          {tx[Math.floor(Math.random() * tx.length)].amount}{" "}
                          XFlip
                        </td>
                        <td className="border-b px-2 py-2 border-slate-400 overflow-clip overflow-ellipsis text-blue-400 cursor-pointer">
                          {transaction.to}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-custom-white text-xl mt-4 mb-6">
                  No transactions yet
                </div>
              )}
            </div>
            {/* <!-- cart items container --> */}

            {/* <!-- saved for later items container --> */}
            <div className="flex flex-col mt-5 shadow bg-white">
              <Link
                to="https://mumbai.polygonscan.com/address/0xE084e0b47007812cdFEc142783f530cd5A8484a2"
                className=" underline font-medium text-lg px-2 sm:px-8 py-4 border-b"
                target="_blank"
              >
                Get a more detialed view on etherscan
              </Link>
            </div>
            {/* <!-- saved for later container --> */}
          </div>
          {/* <!-- cart column --> */}

          {/* <PriceSidebar cartItems={cartItems} /> */}
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default Transactions;
