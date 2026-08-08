import express from 'express'

import { inviteTenant, getAllTenants, getTenant, updateTenant } from '../controllers/tenantsController.js'

export const tenantsRouter= express.Router()

tenantsRouter.post('/invite', inviteTenant)
tenantsRouter