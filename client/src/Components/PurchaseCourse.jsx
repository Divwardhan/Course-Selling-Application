import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';

const PurchaseCourse = () => {
    const [price, setPrice] = useState(0);
    const [orderId, setOrderId] = useState(null);
    const token = localStorage.getItem('token');
    const { id } = useParams();
    const title = decodeURIComponent(id);
    const navigate = useNavigate();
    const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

    console.log("PayPal Client ID:", clientId); // For debugging, remove in production

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/course/fetch', {
                    title,
                });
                setPrice(response.data.course.price);
            } catch (err) {
                console.error('Error fetching course details:', err);
            }
        }
        fetchData();
    }, [title]);

    const handlePurchaseCompletion = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/course/purchase',
                { courseId: id },
                {
                    headers: {
                        token: `${token}`,
                    },
                }
            );
            alert(response.data.message);
            navigate('/my-courses');
        } catch (err) {
            console.error('Error during purchase:', err.response?.data?.message || err.message);
            alert(err.response?.data?.message || 'An error occurred during the purchase process.');
        }
    };

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ color: '#333' }}>
                Purchase Course
            </Typography>
            <PayPalScriptProvider options={{ 'client-id': clientId }}>
                <PayPalButtons
                    createOrder={async () => {
                        try {
                            const response = await axios.post(
                                'http://localhost:3000/api/v1/user/create-order',
                                { price },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );
                            setOrderId(response.data.id);
                            return response.data.id; 
                        } catch (err) {
                            console.error('Error creating PayPal order:', err);
                            throw new Error('Failed to create PayPal order.');
                        }
                    }}
                    onApprove={async (data) => {
                        try {
                            const captureResponse = await axios.post(
                                `http://localhost:3000/api/v1/paypal/capture-order`,
                                { orderID: data.orderID }, // Pass order ID to the backend
                                {
                                    headers: {
                                        token: `${token}`, // Send token for authentication
                                    },
                                }
                            );

                            console.log('Transaction completed:', captureResponse.data);
                            alert('Transaction completed successfully!');
                            await handlePurchaseCompletion(); // Mark course as purchased
                        } catch (err) {
                            console.error('Error capturing PayPal payment:', err);
                            alert('Payment could not be captured. Please try again.');
                        }
                    }}
                    onError={(err) => {
                        console.error('PayPal Error:', err);
                        alert('An error occurred during the payment process. Please try again.');
                    }}
                />
            </PayPalScriptProvider>
        </>
    );
};

export default PurchaseCourse;
