const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload-simple'); 
const controller = require('../Controllers/providers');


router.post(
  '/register',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documents', maxCount: 5 }
  ]),
  controller.registerProvider
);


router.get('/', controller.getProviders);


router.get('/:id', controller.getProviderById);


router.put('/profile/:id', controller.updateProfile);


router.put('/:id/availability', controller.updateAvailability);


router.put('/:id/status', controller.updateStatus);

module.exports = router;