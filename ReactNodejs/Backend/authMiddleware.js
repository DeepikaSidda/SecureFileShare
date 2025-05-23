import { verfiyJWT } from './utils.js';

const excludeAuthURLs = new Set(['/login', '/token']);

const authMiddleware = async (req, res, next) => {
    if (excludeAuthURLs.has(req.path)) {
        console.log("Bypassing JWT verification for " + req.path);
        next();
        return;
    }

    const { ACCESS_TOKEN: accessToken } = req.signedCookies;
    if (verfiyJWT(accessToken, global.jwtSigningKey)) next();
    else res.status(401).send("Unauthenticated");
};

export default authMiddleware;
