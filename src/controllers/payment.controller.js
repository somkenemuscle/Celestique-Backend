import axios from 'axios';

// Initialize payment with Paystack
export const initializePayment = async (req, res) => {
    const { email, amount } = req.body; // Get email and amount from the request body
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Make request to Paystack to initialize payment
    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email,
            amount: amount * 100,
            callback_url: 'http://localhost:3000/verify'
        }, // Paystack expects amount in kobo
        {
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json',
            },
        }
    );
    res.status(200).json(response.data);
};



// Verify payment with Paystack
export const verifyPayment = async (req, res) => {
    const { reference } = req.body; // Retrieve reference from cookie
    if (!reference) return res.status(400).json({ error: 'No reference found' });

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Verify the transaction using the reference from the cookie
    const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
            headers: { Authorization: `Bearer ${paystackSecretKey}` },
        }
    );

    const { data } = response.data;
    if (data.status === 'success') {
        // Handle successful payment (e.g., save order to database, save payment also)
        return res.status(200).json({ success: true, data });
    } else {
        return res.status(400).json({ success: false, message: 'Payment not successful' });
    }
}