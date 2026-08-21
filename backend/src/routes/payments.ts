import express from 'express';
import { getPaymentsByLease, recordPayment, getOverduePayments } from '../controllers/paymentController.js';

export const paymentsRouter = express.Router();

paymentsRouter.get('/lease/:leaseId', getPaymentsByLease);
paymentsRouter.patch('/:id/pay', recordPayment);
paymentsRouter.get('/overdue', getOverduePayments);
