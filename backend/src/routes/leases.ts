import express from 'express';
import { createLease, getLease, getAllLeases, terminateLease } from '../controllers/leaseController.js';

export const leasesRouter = express.Router();

leasesRouter.post('/', createLease);
leasesRouter.get('/', getAllLeases);
leasesRouter.get('/:id', getLease);
leasesRouter.patch('/:id/terminate', terminateLease);
