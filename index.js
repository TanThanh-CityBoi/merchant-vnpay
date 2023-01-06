
const crypto = require('crypto');
const axios = require('axios')
require('dotenv').config()

const VNPAY_SANBOX_URL = process.env.VNPAY_URL
const TERMINAL_CODE = process.env.TERMINAL_CODE
const secretKey = process.env.SECRET_KEY
const BODY = {
    userId: "UserIDHashCode",
    checksum: "",
    orderCode: "9QSEUEX82DX",
    payments: {
        qr: {
            amount: 200000,
            buyerEmail: "",
            buyerIdentification: "",
            buyerName: "",
            buyerPhone: "",
            clientTransactionCode: "84cff4d9-450e-43b5-b7f9-9996daf3c922",
            flagQrPromotion: "",
            merchantMethodCode: "VNPAY_TEST_PE4019B260891_QRCODE",
            methodCode: "VNPAY_QRCODE",
            paymentTerm: null,
            qrHeight: 400,
            qrImageType: 0,
            qrPromotionAmount: null,
            qrWidth: 400,
        }
    },
    cancelUrl: "https://pos-gateway.thenewgym.vn/payment/vnpay/cancel",
    successUrl: "https://pos-gateway.thenewgym.vn/payment/vnpay/success",
    terminalCode: TERMINAL_CODE,
    merchantCode: "VNPAY_TEST",
    totalPaymentAmount: 200000,
    expiredDate: "2301061725"
}
BODY.checksum = generateChecksum({ ...BODY, secretKey })

function createPayment() {
    axios({
        method: 'post',
        url: VNPAY_SANBOX_URL,
        data: BODY
    })
        .then(function (response) {
            console.log("🚀 ~ response: ", response)
        })
        .catch(function (error) {
            console.log("🚀 ~ error: ", error.response.data);
        });
    ;
}

function generateChecksum(data) {
    const {
        secretKey,
        orderCode,
        userId,
        terminalCode,
        merchantCode,
        totalPaymentAmount,
        successUrl,
        cancelUrl,
        payments
    } = data
    var clientTrans = ''
    Object.entries(payments).forEach(([key, value]) => {
        const { clientTransactionCode, merchantMethodCode, methodCode, amount } = value
        clientTrans += `|${clientTransactionCode}|${merchantMethodCode}|${methodCode}|${amount}`
    });
    const rawInfo = `${secretKey}${orderCode}|${userId}|${terminalCode}|${merchantCode}|${totalPaymentAmount}|${successUrl}|${cancelUrl}${clientTrans}`
    const hmac = crypto.createHash('sha256').update(rawInfo).digest('hex');
    return hmac
}

createPayment();