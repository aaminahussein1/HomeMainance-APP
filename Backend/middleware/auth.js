import jwt from 'jsonwebtoken';
import { User } from '../models/models.js'; // Hubi in jidkani sax yahay

// 1. Kan wuxuu hubiyaa in qofku Login yahay (Protect Route)
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "123_@@123");

            // User-ka ka soo saar Database-ka
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: "User-ka lama helin" });
            }

            next();
        } catch (err) {
            console.error("Token Error:", err.message);
            return res.status(401).json({ success: false, message: "Token-ku ma shaqaynayo ama waa uu dhacay" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Fadlan soo gasho (No token)" });
    }
};

/**
 * 2. KANI WAA KAN KAA MAQNAA (Admin Route)
 * Kan ayaa xallinaya ciladda "SyntaxError: does not provide an export named 'admin'"
 */
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: "Lama oggola: Admin oo keliya ayaa geli kara meeshan." 
        });
    }
};