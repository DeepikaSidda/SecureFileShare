import jwt from 'jsonwebtoken';
import { createPublicKey } from 'node:crypto';

export const getCognitoJWTPublicKey = async (tokenSigningKeyUrl) => {
    const res = await fetch(tokenSigningKeyUrl);
    const data = await res.json();
    const jwtSigningKey = createPublicKey({ format: 'jwk', key: data.keys[1] }).export({ format: 'pem', type: 'spki' });
    return jwtSigningKey;
};

export const verfiyJWT = (jwtToken, jwtSigningKey) => {
    return jwt.verify(jwtToken, jwtSigningKey, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            return false;
        } else {
            return true;
        }
    });
};

export const getCurrentUrl = (req) => {
    const currentUrl = process.env.COGNITO_CALLBACK_URL + req['_parsedUrl'].search;
    return new URL(currentUrl);
};
