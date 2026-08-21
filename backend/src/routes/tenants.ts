import express from 'express';
import { inviteTenant, getAllTenants, getTenant, updateTenant, deleteTenant } from '../controllers/tenantsController.js';

export const tenantsRouter = express.Router();

tenantsRouter.post('/invite', inviteTenant);
tenantsRouter.get('/', getAllTenants);
tenantsRouter.get('/:id', getTenant);
tenantsRouter.put('/:id', updateTenant);
tenantsRouter.delete('/:id', deleteTenant);
