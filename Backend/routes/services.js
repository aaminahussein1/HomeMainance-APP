import express from 'express';
const router = express.Router();


import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByProvider
} from '../controllers/serviceController.js';

router.post('/', createService);
router.get('/', getServices);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/provider/:providerId', getServicesByProvider);

export default router;