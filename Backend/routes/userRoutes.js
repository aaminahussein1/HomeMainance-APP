import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
       
        const { username, email, password, fullName, phoneNumber } = req.body;

       
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email-kan horey ayaa loo diiwaangeliyey" });
        }

      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

      
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            name: fullName,      
            phone: phoneNumber   
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Si guul leh ayaad u diiwaangelisay isticmaalaha!"
        });

    } catch (error) {
     
        res.status(400).json({ success: false, message: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Email ama Password waa khalad" });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: "Si guul leh ayaad u soo gashay!",
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;