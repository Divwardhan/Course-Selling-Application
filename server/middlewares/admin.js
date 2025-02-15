const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        req.userId = decoded.id;
        
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" ,error });
    }
}

module.exports = {
    adminMiddleware,
};
