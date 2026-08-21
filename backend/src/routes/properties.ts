import express from 'express';
import { createProperty, getAllProperties, updateProperty, deleteProperty, getProperty } from '../controllers/propertiesController.js';

import { authenticate } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
export const propertiesRouter = express.Router();

propertiesRouter.get('/', authenticate, getAllProperties);
propertiesRouter.get('/:id', authenticate, getProperty);
propertiesRouter.patch('/:id', authenticate, authorize("owner", "manager"), updateProperty);
propertiesRouter.post('/', authenticate, authorize("owner", "manager"), createProperty);
propertiesRouter.delete('/:id', authenticate, authorize("owner"), deleteProperty);
