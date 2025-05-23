import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as client from 'openid-client'; // ✅ updated
import authMiddleware from './authMiddleware.js';
import { getCurrentUrl, getCognitoJWTPublicKey } from './utils.js';


global.jwtSigningKey;
let config;

async function initializeServer() {
    const server = new URL(`https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`);
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;

    config = await client.Issuer.discover(server.href);
    config = new client.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [process.env.COGNITO_CALLBACK_URL],
        response_types: ['code'],
    });

    jwtSigningKey = await getCognitoJWTPublicKey(server.href + "/.well-known/jwks.json");
}
initializeServer().catch(console.error);

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Custom-Header"],
    credentials: true,
    maxAge: 10,
};

app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(authMiddleware);

app.get('/login', async (req, res) => {
    const code_verifier = client.generators.codeVerifier();
    const code_challenge = client.generators.codeChallenge(code_verifier);
    const state = client.generators.state();

    const authUrl = config.authorizationUrl({
        redirect_uri: process.env.COGNITO_CALLBACK_URL,
        code_challenge,
        code_challenge_method: 'S256',
        state,
        scope: 'openid profile email',
    });

    res.cookie('state', state, { httpOnly: true, signed: true });
    res.cookie('code_verifier', code_verifier, { httpOnly: true, signed: true });

    res.send(JSON.stringify({ congnitoLoginURL: authUrl }));
});

app.get('/token', async (req, res) => {
    try {
        const { state, code_verifier } = req.signedCookies;

        const params = config.callbackParams(getCurrentUrl(req));

        const tokenSet = await config.callback(
            process.env.COGNITO_CALLBACK_URL,
            params,
            { code_verifier, state }
        );

        res.cookie('ACCESS_TOKEN', tokenSet.access_token, { httpOnly: true, signed: true });
        res.cookie('REFRESH_TOKEN', tokenSet.refresh_token, { httpOnly: true, signed: true });
        res.cookie('ID_TOKEN', tokenSet.id_token);
        res.clearCookie("state");
        res.clearCookie("code_verifier");
        res.send(tokenSet);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.get('/todos', (req, res) => {
    const todos = ["task1", "task2", "task3"];
    const adminTodos = ["adminTask1", "adminTask2", "adminTask3"];
    const token = req?.signedCookies?.ACCESS_TOKEN;

    const isAdmin = JSON.parse(Buffer.from(token?.split('.')[1], 'base64').toString('utf8'))['cognito:groups']?.includes('Admin');
    res.send(isAdmin ? adminTodos : todos);
});

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});
