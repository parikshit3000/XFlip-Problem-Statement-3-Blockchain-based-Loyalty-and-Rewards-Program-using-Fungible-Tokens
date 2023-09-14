import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../actions/userAction';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';

const { v4: uuidv4 } = require('uuid');
import { emptyCart } from '../../actions/cartAction';
import { newOrder } from '../../actions/orderAction';
import { useNavigate, useParams } from 'react-router-dom';

import { ethers } from "ethers";

import { xflipAddress } from "../../blockchain/config";
import XFlipToken from "../../blockchain/artifacts/contracts/XFlipToken.sol/XFlipToken.json";
import Web3Modal from "web3modal";

// import {
//     CardNumberElement,
//     CardCvcElement,
//     CardExpiryElement,
//     useStripe,
//     useElements,
// } from '@stripe/react-stripe-js';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import { post } from '../../utils/paytmForm';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';

const Payment = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    // const stripe = useStripe();
    // const elements = useElements();
    // const paymentBtn = useRef(null);
    const [selectedPayment, setSelectedPayment] = useState('paytm');
    const [payDisable, setPayDisable] = useState(false);
    
    const handleChange = (event) => {
        setSelectedPayment(event.target.value);
      };
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const paymentData = {
        amount: Math.round(totalPrice),
        email: user.email,
        phoneNo: shippingInfo.phoneNo,
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        totalPrice,
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // paymentBtn.current.disabled = true;
        setPayDisable(true);
        //if value of radio is paytm
        if (e.target[0].checked) {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            // const { data } = await axios.post(
            //     '/api/v1/payment/process',
            //     paymentData,
            //     config,
            // );
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
             let transaction = await contract.mint(
               address,
               Math.min(Math.round((0.02 * totalPrice) / 0.85), 200)
             );
             console.log(transaction);
            const { data } = await axios.post(
                '/api/v1/coins/add',
                {
                    coins: Math.min(Math.round(0.02 * totalPrice / 0.85), 200)
                }
            );
            console.log(data);
            
            // Check if the request was successful
            if (data.success) {
                enqueueSnackbar(`${data.data.coinsAdded} XFlips added successfully! New balance is: ${data.data.newBalance}`, { variant: "success" });
                dispatch(loadUser());
                    order.paymentInfo = {
                        id: "oid"+ uuidv4(),
                        status: "success",
                    };

                    dispatch(newOrder(order));
                    dispatch(emptyCart());
                    navigate("/order/success");
            } else {
                enqueueSnackbar("Processing Payment Failed!", { variant: "error" });
                enqueueSnackbar('Failed to add XFlips:'+data.error, { variant: "error" });
            }

            // let info = {
            //     action: "https://securegw-stage.paytm.in/order/process",
            //     params: data.paytmParams
            // }

            // post(info)

            // if (!stripe || !elements) return;

            // const result = await stripe.confirmCardPayment(client_secret, {
            //     payment_method: {
            //         card: elements.getElement(CardNumberElement),
            //         billing_details: {
            //             name: user.name,
            //             email: user.email,
            //             address: {
            //                 line1: shippingInfo.address,
            //                 city: shippingInfo.city,
            //                 country: shippingInfo.country,
            //                 state: shippingInfo.state,
            //                 postal_code: shippingInfo.pincode,
            //             },
            //         },
            //     },
            // });

            // if (result.error) {
            //     paymentBtn.current.disabled = false;
            //     enqueueSnackbar(result.error.message, { variant: "error" });
            // } else {
            //     if (result.paymentIntent.status === "succeeded") {

            //         order.paymentInfo = {
            //             id: result.paymentIntent.id,
            //             status: result.paymentIntent.status,
            //         };

            //         dispatch(newOrder(order));
            //         dispatch(emptyCart());

            //         navigate("/order/success");
            //     } else {
            //         enqueueSnackbar("Processing Payment Failed!", { variant: "error" });
            //     }
            // }

        } catch (error) {
            // paymentBtn.current.disabled = false;
            setPayDisable(false);
            enqueueSnackbar(error, { variant: "error" });
        }
    }
    //if value of radio is xflip
    else {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

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
             let transaction = await contract.burn(
               address,
               Math.min(Math.round((0.02 * totalPrice) / 0.85), 200)
             );
        
            const { data } = await axios.post(
                '/api/v1/coins/burn',
                {
                    coins: Math.round(totalPrice/0.85).toLocaleString()
                },
                config
            );
        
            if (data.success) {
                enqueueSnackbar(`${data.data.coinsBurned} XFlips burned successfully! New balance is: ${data.data.newBalance}`, { variant: "success" });
                dispatch(loadUser());
                    order.paymentInfo = {
                        id: "oid"+ uuidv4(),
                        status: "success",
                    };

                    dispatch(newOrder(order));
                    dispatch(emptyCart());
                    navigate("/order/success");
            } else {
                enqueueSnackbar("Processing Payment Failed!", { variant: "error" });
                enqueueSnackbar(`Failed to burn XFlips: ${data.message || "Unknown server error"}`, { variant: "error" });                
            }
        } catch (error) {
            setPayDisable(false);
            // Differentiate between axios specific errors (like response error) vs general errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // outside of the range of 2xx
                enqueueSnackbar(`Failed to burn XFlips: ${error.response.data.message}`, { variant: "error" });
            } else if (error.request) {
                // The request was made but no response was received
                enqueueSnackbar('Failed to burn XFlips: No response from server. Please check your internet connection.', { variant: "error" });
            } else {
                // Something happened in setting up the request and triggered an error
                enqueueSnackbar(`Failed to burn XFlips: ${error.message}`, { variant: "error" });
            }
        }        
    }
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);


    return (
        <>
            <MetaData title="Flipkart: Secure Payment | Paytm" />

            <main className="w-full mt-20">

                {/* <!-- row --> */}
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">

                    {/* <!-- cart column --> */}
                    <div className="flex-1">

                        <Stepper activeStep={3}>
                            <div className="w-full bg-white">

                                <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-2 w-full mx-8 my-4 overflow-hidden">
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            defaultValue="paytm"
                                            name="payment-radio-button"
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="paytm"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img draggable="false" className="h-6 w-6 object-contain" src="https://rukminim1.flixcart.com/www/96/96/promos/01/09/2020/a07396d4-0543-4b19-8406-b9fcbf5fd735.png" alt="Paytm Logo" />
                                                        <span>Paytm</span>
                                                    </div>
                                                }
                                            />
                                            <FormControlLabel
                                                value="XFlip"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <span>XFlip</span>
                                                    </div>
                                                }
                                            />
                                        </RadioGroup>
                                        <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg shadow-md">
                                            <span className="text-lg text-gray-700 font-medium">1 XFlip =</span>
                                            <span className="text-xl text-blue-600 font-bold bg-blue-100 p-2 rounded-md">₹0.85</span>
                                        </div>

                                    </FormControl>

                                    {/* <input type="submit" value={`Pay ₹${totalPrice.toLocaleString()} and Earn ${Math.min(Math.round(0.05*totalPrice), 200).toLocaleString()} XFlip`} disabled={payDisable ? true : false} className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`} /> */}
                                    <input
                                        type="submit"
                                        value={
                                            selectedPayment === 'paytm'
                                                ? `Pay ₹${totalPrice.toLocaleString()} and Earn ${Math.min(Math.round(0.02 * totalPrice / 0.85), 200).toLocaleString()} XFlip`
                                                : `Pay ₹${totalPrice.toLocaleString()} using ${Math.round(totalPrice/0.85).toLocaleString()} XFlip` // Update this if you want a different value for XFlip
                                        }
                                        disabled={payDisable}
                                        className={`${payDisable ? "bg-primary-grey cursor-not-allowed" : "bg-primary-orange cursor-pointer"} w-1/3 sm:w-1/3 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`}
                                    />

                                </form>

                                {/* stripe form */}
                                {/* <form onSubmit={(e) => submitHandler(e)} autoComplete="off" className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-8 my-4">
                                <div>
                                    <CardNumberElement />
                                </div>
                                <div>
                                    <CardExpiryElement />
                                </div>
                                <div>
                                    <CardCvcElement />
                                </div>
                                <input ref={paymentBtn} type="submit" value="Pay" className="bg-primary-orange w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none cursor-pointer" />
                            </form> */}
                                {/* stripe form */}

                            </div>
                        </Stepper>
                    </div>

                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;