import express from 'express'
import authenticate from '../utils/cookies.js';
import paymentcontroller from '../Controller/payments.js'

const router=express.Router()

router.post('/paymentprocess', authenticate.sendTokenInHeader, paymentcontroller.processPayment)
router.get('/payments', authenticate.sendTokenInHeader, paymentcontroller.sendStripeApi)

export default router;
