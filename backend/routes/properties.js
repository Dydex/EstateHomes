import express from 'express'
import { createProperty, getAllProperties, updateProperty, deleteProperty, getProperty } from '../controllers/propertiesController'

export const propertiesRouter = express.Router()

propertiesRouter.get('/', getAllProperties)
propertiesRouter.get('/:id', getProperty )
propertiesRouter.patch('/:id', updateProperty)
propertiesRouter.post('/', createProperty)
propertiesRouter.delete('/id', deleteProperty)