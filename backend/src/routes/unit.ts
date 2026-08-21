import express from 'express';
import { createUnit, getAllUnits, getUnit, updateUnit, deleteUnit } from '../controllers/unitController.js';

export const unitsRouter = express.Router();

unitsRouter.post('/:propertyId', createUnit);
unitsRouter.get('/:propertyId', getAllUnits);
unitsRouter.get('/:propertyId/:unitId', getUnit);
unitsRouter.put('/:propertyId/:unitId', updateUnit);
unitsRouter.delete('/:propertyId/:unitId', deleteUnit);
