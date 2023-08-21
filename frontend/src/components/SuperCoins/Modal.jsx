import React from "react";
import { ethers } from "ethers";
import { Address } from "../../blockchain/config";
import { nftAddress } from "../../blockchain/config";
import DynamicToken from "../../blockchain/artifacts/contracts/DynamicToken.sol/DynamicToken.json";
import NFTEE from "../../blockchain/artifacts/contracts/NFTEE.sol/NFTEE.json";
import Web3Modal from "web3modal";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");
import { emptyCart } from "../../actions/cartAction";
import { newOrder } from "../../actions/orderAction";
import { loadUser } from "../../actions/userAction";
import { useNavigate, useParams } from "react-router-dom";

const Modal = ({ isOpen, onClose, image, name, offer, tag, coinz }) => {
  if (!isOpen) {
    return null;
  }
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = {
    shippingInfo,
    orderItems: cartItems,
    totalPrice,
  };
  // sign to metamask
  const sign = async () => {
    console.log("signing");
    
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(nftAddress, NFTEE.abi, signer);
    console.log(contract);
    let transaction = await contract.mint("1");
    console.log(transaction);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(coinz);
      const { data } = await axios.post(
        "/api/v1/coins/burn",
        {
          coins: Math.round(coinz),
        },
        config
      );

      if (data.success) {
        enqueueSnackbar(
          `${data.data.coinsBurned} XFlips burned successfully! New balance is: ${data.data.newBalance}`,
          { variant: "success" }
        );
        await dispatch(loadUser());
        order.paymentInfo = {
          id: "oid" + uuidv4(),
          status: "success",
        };

        dispatch(newOrder(order));
        dispatch(emptyCart());
        navigate("/supercoins");
      } else {
        enqueueSnackbar("Processing Payment Failed!", { variant: "error" });
        enqueueSnackbar(
          `Failed to burn XFlips: ${data.message || "Unknown server error"}`,
          { variant: "error" }
        );
      }
    } catch (error) {
      // Differentiate between axios specific errors (like response error) vs general errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // outside of the range of 2xx
        enqueueSnackbar(
          `Failed to burn XFlips: ${error.response.data.message}`,
          { variant: "error" }
        );
      } else if (error.request) {
        // The request was made but no response was received
        enqueueSnackbar(
          "Failed to burn XFlips: No response from server. Please check your internet connection.",
          { variant: "error" }
        );
      } else {
        // Something happened in setting up the request and triggered an error
        enqueueSnackbar(`Failed to burn XFlips: ${error.message}`, {
          variant: "error",
        });
      }
    }

    enqueueSnackbar(`${coinz} Tokens deducted`, { variant: "success" });
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 z-50 flex justify-center items-center">
      <div className="custom-gray w-3/4 h-3/4 rounded-xl relative bg-white">
        <div className="flex absolute justify-end right-0">
          <button onClick={onClose} className="bg-white rounded-full p-2 m-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-2 mx-10 justify-center align-middle h-full">
          <div className="relative w-96 h-[80%] self-center rounded-full align-middle py-10 ">
            <img
              draggable="false"
              className="w-full h-full object-contain"
              src={image}
            />

            {/* <Image
                  src="https://media.istockphoto.com/id/828088276/vector/qr-code-illustration.jpg?s=612x612&w=0&k=20&c=FnA7agr57XpFi081ZT5sEmxhLytMBlK4vzdQxt8A70M="
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md "
                  alt="profile"
                /> */}
          </div>
          <div className="flex flex-col justify-center ">
            <h4 className="text-4xl text-gray-400 font-bold mb-10 mx-auto">
              {coinz} XFlips
            </h4>
            <p className="mx-2">
              In this offer you will get extra 2 months of Sony LIV Premium
              Subscription free once you purchase 6 months Subscription of Sony
              LIV Premium. Get exclusive access to 700 movies and 40,000+ hours
              of television shows in Hindi, English, Telugu and Tamil. <br></br>
              <br></br>Key Terms & Conditions The offer cannot be clubbed with
              any other ongoing offers. The offer code cannot be sold, canceled,
              returned, refunded or exchanged, once purchased.
            </p>
            <button
              className="bg-primary-blue mt-6 text-white rounded-md px-4 py-2 mb-10"
              onClick={sign}
            >
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
