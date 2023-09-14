import axios from "axios";

import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

import MetaData from "../Layouts/MetaData";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import PriceSidebar from "./PriceSidebar";
import SaveForLaterItem from "./SaveForLaterItem";
import { Link } from "react-router-dom";
import DealSlider from "../Home/DealSlider/DealSlider";
import Product from "./Product";
import img1 from "../../assets/images/Categories/beauty.png";
import { BsArrowBarRight, BsArrowUpRightSquare } from "react-icons/bs";
import { loadUser } from "../../actions/userAction";

import { useDispatch } from "react-redux";

import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { xflipAddress } from "../../blockchain/config";
import XFlipToken from "../../blockchain/artifacts/contracts/XFlipToken.sol/XFlipToken.json";

const SuperCoins = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { saveForLaterItems } = useSelector((state) => state.saveForLater);
  const userInfo = useSelector((state) => state.user);
  console.log(userInfo?.user?.name);
  localStorage.setItem("name", userInfo?.user?.name);
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  const updateCoins = async (userId, coinsToAdd) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/v1/coins/add", {
      coins: coinsToAdd,
    });
    return data;
  };

  // Sharing
  const shareUrl = "https://flipkart.com/supercoins";
  const title =
    "Join the rewards program at Flipkart and earn exciting rewards!";

  const handleShare = async () => {
    try {
      var refercoins = Math.floor(5 / 0.85);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(
        xflipAddress,
        XFlipToken.abi,
        signer
      );
      console.log(contract);
      // get address of user from metamask
      const address = await signer.getAddress();
      let transaction = await contract.mint(address, Math.round(refercoins));
      console.log(transaction);
      const response = await updateCoins(userInfo?.user?._id, refercoins);
      // update user state

      if (response.success) {
        enqueueSnackbar(`Thanks for sharing! You earned ${refercoins} coins!`, {
          variant: "success",
        });
        await dispatch(loadUser());
        navigate("/supercoins");
      } else {
        enqueueSnackbar("Something went wrong! Please try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("An error occurred while granting coins.", {
        variant: "error",
      });
    }
  };

  const placeOrderHandler = () => {
    navigate("/login?redirect=shipping");
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <MetaData title="Supercoins | Flipkart" />
      <main className="w-full mt-20">
        {/* <!-- row --> */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
          {/* <!-- cart column --> */}
          <div className="flex-1">
            {/* <!-- cart items container --> */}
            <div className="flex flex-col shadow bg-white">
              <Link
                to="/user/dashboard"
                className="flex text-center underline underline-offset-2 items-center font-medium text-lg px-2 sm:px-8 py-4 border-b"
              >
                <div className="mr-2">XFlip coins Balance {user?.coins}</div>
                {/* Display coins balance after updating user state*/}
                <BsArrowUpRightSquare />
              </Link>
              <div className="flex justify-start">
                <Link
                  to="/transactions"
                  className=" bg-primary-blue text-sm ml-6 text-white px-12 py-2 rounded-sm shadow mt-3"
                >
                  View Coin Activity
                </Link>
              </div>

              <span className="font-medium text-lg px-2 sm:px-8 py-4 mt-7 border-b">
                Vouchers
              </span>

              <div className="grid grid-cols-4">
                <div className="col-span-1">
                  <Product
                    image="https://rukminim2.flixcart.com/fk-p-www/400/400/promos/01/08/2023/a0669428-600c-4e64-aeac-2a2d0412fc42.png?q=50"
                    name="20 XFlip"
                    coinz="20"
                  />
                </div>
                <div className="col-span-1">
                  <Product
                    image="https://rukminim2.flixcart.com/fk-p-www/400/400/promos/05/09/2022/b8777150-a49e-40f8-8d97-21a90470c7c8.png?q=50"
                    name="100 XFlip"
                    coinz="100"
                  />
                </div>
                <div className="col-span-1">
                  <Product
                    image="https://rukminim2.flixcart.com/fk-p-www/400/400/promos/26/07/2023/5558c7d3-23ef-4d95-9e62-6540be3f504d.png?q=50"
                    name="250 XFlip"
                    coinz="250"
                  />
                </div>
                <div className="col-span-1">
                  <Product
                    image="https://rukminim2.flixcart.com/fk-p-lockin/400/400/rs-img/2010T30SNY01_hybrid_980_765_03-29-2021_20-41-57.jpg?q=50"
                    name="1000 XFlip"
                    coinz="1000"
                  />
                </div>
              </div>
            </div>
            {/* <!-- cart items container --> */}

            {/* <!-- saved for later items container --> */}
            {/* <div className="flex flex-col mt-5 shadow bg-white">
              <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
                Saved For Later ({saveForLaterItems.length})
              </span>
              {saveForLaterItems &&
                saveForLaterItems.map((item) => <SaveForLaterItem {...item} />)}
            </div> */}
            {/* <!-- saved for later container --> */}
          </div>
          {/* <!-- cart column --> */}

          {/* <PriceSidebar cartItems={cartItems} /> */}
        </div>
        <div className="flex flex-row m-auto mx-16 mt-5 shadow bg-white items-center">
          <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
            Share and earn 5 Rup worth XFlips
          </span>
          <div className="share-buttons flex space-x-4">
            <div className="p-2 bg-primary-blue rounded-full shadow-md hover:shadow-lg transition-shadow">
              <FacebookShareButton
                url={shareUrl}
                quote={title}
                onClick={handleShare}
                className="cursor-pointer"
              >
                <FacebookIcon size={20} round />
              </FacebookShareButton>
            </div>

            <div className="p-2 bg-primary-blue rounded-full shadow-md hover:shadow-lg transition-shadow">
              <TwitterShareButton
                url={shareUrl}
                title={title}
                onClick={handleShare}
                className="cursor-pointer"
              >
                <TwitterIcon size={20} round />
              </TwitterShareButton>
            </div>

            <div className="p-2 bg-primary-blue rounded-full shadow-md hover:shadow-lg transition-shadow">
              <WhatsappShareButton
                url={shareUrl}
                title={title}
                onClick={handleShare}
                className="cursor-pointer"
              >
                <WhatsappIcon size={20} round />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default SuperCoins;
