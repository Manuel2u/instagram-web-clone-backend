"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jwt = require("jsonwebtoken");
const verifyAccessToken = async (req, res, next) => {
    let token;
    try {
        console.log(req.headers["authorization"]);
        token = req.headers.authorization?.split(" ")[1];
        const decoded = await jwt.verify(token || "", process.env.JWT_SECRET || "");
        // check expiry
        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: "Token Expired" });
        }
        req.user = decoded;
        console.log(req.user.id);
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Unauthorized Access" });
    }
    if (!token) {
        // CreateError("No token", 403);
        throw new Error("Unauthorized Access ");
    }
};
exports.verifyAccessToken = verifyAccessToken;
