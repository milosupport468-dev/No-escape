
const crypto = require("crypto");

exports.handler = async function () {
    try {
        const clientId = process.env.ROBLOX_CLIENT_ID;
        const redirectUri = process.env.ROBLOX_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            return {
                statusCode: 500,
                body: "Faltan variables de Roblox en Netlify."
            };
        }

        const verifier = crypto.randomBytes(32).toString("base64url");
        const state = crypto.randomBytes(24).toString("hex");

        const challenge = crypto
            .createHash("sha256")
            .update(verifier)
            .digest("base64url");

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "openid profile",
            state,
            code_challenge: challenge,
            code_challenge_method: "S256"
        });

        const authorizationUrl =
            "https://apis.roblox.com/oauth/v1/authorize?" +
            params.toString();

        return {
            statusCode: 302,
            headers: {
                Location: authorizationUrl,
                "Cache-Control": "no-store"
            },
            multiValueHeaders: {
                "Set-Cookie": [
                    `roblox_verifier=${verifier}; HttpOnly; Secure; SameSite=Lax; Path=/.netlify/functions; Max-Age=600`,
                    `roblox_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/.netlify/functions; Max-Age=600`
                ]
            },
            body: ""
        };

    } catch (error) {
        console.error("Error Roblox Login:", error);

        return {
            statusCode: 500,
            body: "Error al iniciar sesión con Roblox."
        };
    }
};
                    
