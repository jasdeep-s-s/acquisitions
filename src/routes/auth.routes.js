import express from 'express';
import {signup, signin, signout} from '#controllers/auth.controller.js';

const router = express.Router(); 

router.post('/sign-up', signup);   // User registration endpoint
router.post('/sign-in', signin);   // User login endpoint
router.post('/sign-out', signout); // User logout endpoint

export default router;