import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: "Fadlan soo gasho (No token)" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "123_@@123");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Token-ku ma shaqaynayo ama waa uu dhacay" });
    }
};