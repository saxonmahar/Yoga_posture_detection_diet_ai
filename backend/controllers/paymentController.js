const crypto = require('crypto');

// eSewa Test Secret Key (from eSewa docs)
const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q';

// Generate HMAC SHA256 signature
const generateSignature = (message) => {
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
  hmac.update(message);
  return hmac.digest('base64');
};

// Initiate eSewa payment
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, planName } = req.body;

    // Generate unique transaction UUID
    const transaction_uuid = `YOGAAI-${Date.now()}`;
    
    // Payment parameters
    const paymentData = {
      amount: amount.toString(),
      tax_amount: "0",
      total_amount: amount.toString(),
      transaction_uuid: transaction_uuid,
      product_code: "EPAYTEST", // Test merchant code
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${req.headers.origin}/payment-success`,
      failure_url: `${req.headers.origin}/payment-failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code"
    };

    // Generate signature
    const message = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
    const signature = generateSignature(message);

    // Add signature to payment data
    paymentData.signature = signature;

    console.log('✅ Payment initiated:', {
      transaction_uuid,
      amount,
      signature: signature.substring(0, 20) + '...'
    });

    res.json({
      success: true,
      paymentData,
      esewaUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
    });

  } catch (error) {
    console.error('❌ Payment initiation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Verify eSewa payment
exports.verifyPayment = async (req, res) => {
  try {
    const { data } = req.body;

    // Decode base64 response from eSewa
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

    // Verify signature
    const message = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code},signed_field_names=${decodedData.signed_field_names}`;
    const expectedSignature = generateSignature(message);

    if (expectedSignature === decodedData.signature) {
      console.log('✅ Payment verified successfully:', decodedData);
      
      res.json({
        success: true,
        verified: true,
        paymentData: decodedData
      });
    } else {
      console.log('❌ Signature mismatch');
      res.json({
        success: false,
        verified: false,
        error: 'Invalid signature'
      });
    }

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
