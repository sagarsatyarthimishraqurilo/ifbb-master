import express from 'express';
import createCheckoutSessionController from '../../controllers/payments/createCheckoutSessionController.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSessionController);

export default router;
