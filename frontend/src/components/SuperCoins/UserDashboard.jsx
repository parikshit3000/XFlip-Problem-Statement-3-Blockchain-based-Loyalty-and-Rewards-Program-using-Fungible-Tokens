import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { BsTwitter } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";
import Accordion from "./Accordion";
import Avatar, { genConfig } from "react-nice-avatar";
import axios from "axios";
import { useSelector } from "react-redux";
import { Doughnut, Line, Pie, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

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
// const pricePoints = ['100,000', '105,000', '110,000', '115,000', '120,000', '125,000', '130,000', '135,000', '140,000', '145,000', '150,000', '155,000']
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// const date = new Date();
const lineState = {
  labels: pricePoints.map((point) => point[0]),
  datasets: [
    {
      label: `Value of xFlip (in Rs)`,
      // label: `Sales in ${date.getFullYear() - 2}`,
      borderColor: "#8A39E1",
      backgroundColor: "#8A39E1",
      data: pricePoints.map((point) => point[1]),
      // data: months.map((m, i) => orders?.filter((od) => new Date(od.createdAt).getMonth() === i && new Date(od.createdAt).getFullYear() === date.getFullYear() - 2).reduce((total, od) => total + od.totalPrice, 0)),
    },
  ],
};

const acc = `
                    <p class="text-[#9a9999] text-base">
                      Your avatar acts as a entry point to these exclusive events. A few lucky winners among these can get a chance to:
                    </p>
                    `;

const acc2 = `
  <p><span class="text-lg mr-2">o</span>Win contests</p>
  <p><span class="text-lg mr-2">o</span>Interacting with icc products such as ICC TV, criio, crictos </p>
  <p><span class="text-lg mr-2">o</span>Shopping on icc store</p>
  <p><span class="text-lg mr-2">o</span>View time on icc TV</p>
  <p><span class="text-lg mr-2">o</span>Buying tickets</p>
`;

export default function UserDashboard() {
  const [config, setConfig] = useState(genConfig());
  console.log(config);

  const [profile, setProfile] = useState({});
  const [userInfo, setUserInfo] = useState("");
  const [address, setAddress] = useState("");
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  console.log(address);
  // const [domloaded, setDomLoaded] = useState(true);

  useEffect(() => {
    setAddress(localStorage.getItem("address"));
    setUserInfo(localStorage.getItem("name"));
  }, []);

  //   async function onConnect() {
  //     await authArcana.init();
  //     const token = localStorage.getItem("token");
  //     await authArcana.getUser().then((res) => {
  //       console.log("inside res");
  //       console.log(res);
  //       setUserInfo(res);
  //     });
  //     try {
  //       await axios
  //         .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me/get-avatar`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         })
  //         .then((res) => {
  //           console.log("inside res");
  //           console.log(res);

  //           console.log(res.data);
  //           let updatedConfig = res.data;
  //           updatedConfig.shape = "rounded";
  //           setConfig(updatedConfig);
  //           setProfile(res.data.profile)
  //         })
  //         .catch((err) => {
  //           console.log("inside axios error");
  //           console.log(err);
  //           if (err.response.status === 500) {
  //             axios
  //               .post(
  //                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/me/create-avatar`,
  //                 { ...genConfig() },
  //                 {
  //                   headers: {
  //                     Authorization: `Bearer ${token}`,
  //                   },
  //                 }
  //               )
  //               .then((res) => {
  //                 console.log(res.data);
  //                 let updatedConfig = res.data;
  //                 updatedConfig.shape = "rounded";
  //                 setConfig(updatedConfig);
  //                 setProfile(res.data.profile)
  //               });
  //           }
  //         });
  //     } catch (error) {
  //       console.log("error catch");
  //       if (error.response.status === 500) {
  //         console.log("inside error status");
  //       }
  //     }
  //     setDomLoaded(true);
  //     console.log(profile);
  //     console.log(userInfo);
  //   }

  return (
    <>
      {/* {!domloaded && (
        <>
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-custom-white"></div>
          </div>
        </>
      )} */}
      {/* {domloaded && ( */}
      <>
        <div className="mt-20 text-custom-white">
          <div className="flex w-full mb-10">
            <div className=" w-[50%] relative mx-10">
              <div className="w-full h-full rounded overflow-hidden ">
                <div
                  className="flex mb-8"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <div className="relative h-96 w-[100%] ">
                    <Avatar className=" h-full w-[60%] mx-auto" {...config} />
                  </div>
                </div>
                <div className="px-2 py-4 custom-gray">
                  <div className="font-bold text-xl mb-2">User level</div>
                  <p className="text-[#9a9999] text-base pb-2">
                    As users progress through levels in our program, they unlock
                    exclusive discounts, early access to new products,
                    personalized recommendations, and even free shipping.
                    Enhanced customer support, personalized gifts, and points
                    multipliers further elevate their experience. Special items,
                    VIP event access, and gamified challenges await at higher
                    levels, ensuring a rewarding journey.
                  </p>
                  <div className="flex align-middle items-center">
                    <div className="w-[90%]">
                      <ProgressBar
                        completed="28"
                        bgColor="#206FBF"
                        height="10px"
                        isLabelVisible={false}
                        baseBgColor="#E4E4E4"
                      />
                    </div>

                    <p className=" w-[10%] px-2">28/100</p>
                  </div>
                </div>
                {/* <Accordion title="What can i do with my avatar?" desc={acc} />
                <Accordion title="How do i level up my avatar?" desc={acc2} /> */}
              </div>
            </div>
            <div className="w-[50%] mr-10">
              <Link
                to={"https://etherscan.io/address/" + address}
                className="underline text-primary-blue"
              >
                <p className=" text-xl py-2">{address}</p>
              </Link>
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-Poppins py-2">{userInfo}</h1>
                <div className="flex">
                  <BsTwitter className="text-white text-2xl mr-3" />
                  <AiFillLinkedin className="text-white text-2xl mr-3" />
                  <BsInstagram className="text-white text-2xl" />
                </div>
              </div>
              <h1 className="text-xl">
                Wallet balance: {user?.coins}
                <span className="text-yellow-400"> XFLIP </span>={" "}
                {user?.coins * 0.8} Rs
              </h1>
              <div className="my-4 mt-6">
                <div>
                  <div className="flex justify-between bg-gray-200 rounded-md p-4 items-center">
                    <h1 className="text-xl">
                      20 Tokens worth 16 Rs expire in: 30 Days
                    </h1>
                    <Link
                      to="/supercoins"
                      className="bg-primary-blue text-white px-4 py-2 rounded-md"
                    >
                      Reedeem Now
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-xl h-auto w-full shadow-lg p-2 mt-6">
                  <Line data={lineState} />
                </div>

                {/* <div className="custom-gray rounded-md p-4 mt-6">
                    <h1 className="font-Poppins text-custom-white text-2xl mb-2">
                      Attributes
                    </h1>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col bg-[#253239] border border-[#206fbf] p-2 items-center rounded-md">
                        <p className="text-custom-blue1 pb-1">Hair Style</p>
                        <p className="pb-3 text-xl">{config.hairStyle}</p>
                        <p className="text-xs">45% have this trait</p>
                      </div>
                      <div className="flex flex-col bg-[#253239] border border-[#206fbf] p-2 items-center rounded-md">
                        <p className="text-custom-blue1 pb-1">Facewear</p>
                        <p className="pb-3 text-xl">{config.glassesStyle}</p>
                        <p className="text-xs">31% have this trait</p>
                      </div>
                      <div className="flex flex-col bg-[#253239] border border-[#206fbf] p-2 items-center rounded-md">
                        <p className="text-custom-blue1 pb-1">Skin tone</p>
                        <p className="pb-3 text-xl">{config.faceColor}</p>
                        <p className="text-xs">50% have this trait</p>
                      </div>
                      <div className="flex flex-col bg-[#253239] border border-[#206fbf] p-2 items-center rounded-md">
                        <p className="text-custom-blue1 pb-1">Body wear</p>
                        <p className="pb-3 text-xl">{config.shirtStyle}</p>
                        <p className="text-xs">35% have this trait</p>
                      </div>
                      <div className="flex flex-col bg-[#253239] border border-[#206fbf] p-2 items-center rounded-md">
                        <p className="text-custom-blue1 pb-1">Head wear</p>
                        <p className="pb-3 text-xl">{config.hatStyle}</p>
                        <p className="text-xs">22% have this trait</p>
                      </div>
                      <div className="flex flex-col bg-[#253239] border border-[#206fbf] p-2 items-center rounded-md">
                        <p className="text-custom-blue1 pb-1">Mouth</p>
                        <p className="pb-3 text-xl">{config.mouthStyle}</p>
                        <p className="text-xs">58% have this trait</p>
                      </div>
                    </div>
                    <h1 className="font-Poppins text-custom-white text-2xl mt-5">
                      Avatar Rarity
                    </h1>
                    <div className="flex align-middle items-center">
                      <div className="w-[90%]">
                        <ProgressBar
                          completed="50"
                          bgColor="#206FBF"
                          height="10px"
                          isLabelVisible={false}
                          baseBgColor="#E4E4E4"
                        />
                      </div>

                      <p className=" w-[10%] px-2">50%</p>
                    </div>
                  </div> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col  w-full mx-auto mt-0  ">
            <div className="flex-1 mx-10 bg-white p-4 rounded-md">
              <h1 className="text-3xl text-center">
                Tokenomics and DAO Guidelines
              </h1>
              <br></br>
              <ol className="list-decimal m-3">
                <li>
                  <span className="text-xl font-bold">Token creation: </span>
                  <ul>
                    <li className="list-disc m-2">
                      <b>Minting: </b>Loyalty coins can be minted whenever a
                      customer performs a qualifying action, such as making a
                      purchase, referring a friend, or leaving a review.
                    </li>
                    <li className="list-disc m-2">
                      <b>Burn Mechanism: </b>To control the supply and maintain
                      coin value, a percentage of loyalty coins could be burned
                      when redeemed.
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="text-xl font-bold">Distribution: </span>

                  <ul>
                    <li className="list-disc m-2">
                      <b>Rewarding: </b>Customers earn loyalty coins based on
                      their interactions and purchases.
                    </li>
                    <li className="list-disc m-2">
                      <b>Partnerships: </b>Collaborate with other businesses to
                      expand the utility of loyalty coins, thereby allowing
                      cross-redemption across platforms.
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="text-xl font-bold">Usage: </span>

                  <ul>
                    <li className="list-disc m-2">
                      <b>Redemption: </b>Customers can use loyalty coins to get
                      discounts, special offers, or even purchase
                      products/services.
                    </li>
                    <li className="list-disc m-2">
                      <b>Trading: </b>With blockchain, customers can trade
                      loyalty coins with other users or convert them into other
                      cryptocurrencies or fiat currency.
                    </li>
                  </ul>
                </li>

                <li>
                  <span className="text-xl font-bold">Storage: </span>

                  <ul>
                    <li className="list-disc m-2">
                      <b>Digital Wallets: </b>Customers store their loyalty
                      coins in digital wallets, which can be integrated into a
                      brand's app or be a separate blockchain wallet.
                    </li>
                  </ul>
                </li>

                <li>
                  <span className="text-xl font-bold">
                    Value Stabilization:
                  </span>

                  <ul>
                    <li className="list-disc m-2">
                      <b>Backing: </b>To provide stability, loyalty coins could
                      be backed by assets, reserves, or a basket of goods.
                    </li>
                    <li className="list-disc m-2">
                      <b>Limited Supply: </b>A cap on the maximum number of
                      coins in circulation ensures rarity and value.
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="text-xl font-bold">Tokenomics: </span>
                  <ul>
                    <li className="list-disc m-2">
                      <b>Value of tokens:</b> 1 token = ₹1 (initial, varies based on
                      supply and demand) <br></br><b>Initial issuance:</b> 10 million tokens<br></br>
                      <b>Token Allocation:</b> 60% rewards, 20% development, 10%
                      partnerships, 10% governance<br></br> <b>Vesting Period:</b> 2-3 years<br></br>
                      <b>Annual Staking Interest Rate:</b> 15% <br></br><b>Token Burn Percentage:</b>
                      1% of the revenue <br></br><b>Rules and Regulations:</b> Capped issuance
                      at 100 million to prevent inflation Clearly defined
                      treasury governance protocols
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="text-xl font-bold">Rules and regulations of earning Fungible Tokens: </span>
                  <ul>
                    <li className="list-disc m-2">
                      <ul>
                        <li>For each purchase, you'll receive tokens equivalent to 2% of your cart's value, based on the prevailing conversion rate. The maximum you can earn is 200 tokens for each order<br></br></li>
                        <li>Earn ₹50 in tokens for every successful referral.</li>
                        <li>Receive ₹5 in tokens for each social media share (upto 4 shares a month).<br></br></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/*}
                  <b>Treasury Management: </b> Allocate 20% of the initial token
                  supply to the treasury for future use. These tokens will be
                  used for partnerships, program expansion, and unexpected
                  rewards. Regular quarterly reports will detail treasury usage
                  and allocations.
                </li> */}
              </ol>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
