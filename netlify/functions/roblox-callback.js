exports.handler = async function (event) {
    const headers = {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
    };

    try {
        const clientId = process.env.ROBLOX_CLIENT_ID;
        const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
        const redirectUri = process.env.ROBLOX_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error("Faltan variables de configuración en Netlify.");
        }

        const url = new URL(event.rawUrl);
        const code = url.searchParams.get("code");
        const returnedState = url.searchParams.get("state");
        const oauthError = url.searchParams.get("error");

        if (oauthError) {
            throw new Error("Roblox rechazó la autorización.");
        }

        const cookies = {};
        const cookieHeader = event.headers.cookie || "";

        cookieHeader.split(";").forEach(item => {
            const index = item.indexOf("=");
            if (index > -1) {
                const key = item.slice(0, index).trim();
                const value = item.slice(index + 1).trim();
                cookies[key] = value;
            }
        });

        if (!code || !returnedState) {
            throw new Error("Falta el código de autorización.");
        }

        if (!cookies.roblox_state ||
            cookies.roblox_state !== returnedState) {
            throw new Error("Estado de seguridad inválido. Intenta de nuevo.");
        }

        if (!cookies.roblox_verifier) {
            throw new Error("No se encontró el verificador PKCE. Intenta de nuevo.");
        }

        // Intercambiar código por token
        const tokenResponse = await fetch(
            "https://apis.roblox.com/oauth/v1/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    code_verifier: cookies.roblox_verifier,
                    client_id: clientId,
                    client_secret: clientSecret
                })
            }
        );

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok || !tokens.access_token) {
            console.error("Error al obtener token:", tokens);
            throw new Error("Roblox no pudo validar el acceso.");
        }

        // Obtener perfil de Roblox
        const userResponse = await fetch(
            "https://apis.roblox.com/oauth/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokens.access_token}`
                }
            }
        );

        const user = await userResponse.json();

        if (!userResponse.ok || !user.sub) {
            throw new Error("No se pudo obtener el perfil de Roblox.");
        }

        // Guardar únicamente datos públicos para mostrar el perfil.
        // Esta cookie NO es una sesión segura para autorizar acciones.
        const profile = {
            id: user.sub,
            username: user.preferred_username || "",
            displayName: user.name || "",
            picture: user.picture || "",
            profile: user.profile || ""
        };

        const profileCookie =
            "roblox_user=" +
            encodeURIComponent(JSON.stringify(profile)) +
            "; Path=/; Max-Age=86400; Secure; SameSite=Lax";

        const clearVerifier =
            "roblox_verifier=; Path=/.netlify/functions; Max-Age=0; Secure; HttpOnly; SameSite=Lax";

        const clearState =
            "roblox_state=; Path=/.netlify/functions; Max-Age=0; Secure; HttpOnly; SameSite=Lax";

        return {
            statusCode: 302,
            headers: {
                Location: "/?roblox=success",
                "Cache-Control": "no-store"
            },
            multiValueHeaders: {
                "Set-Cookie": [
                    profileCookie,
                    clearVerifier,
                    clearState
                ]
            },
            body: ""
        };

    } catch (error) {
        console.error("Roblox callback:", error.message);

        return {
            statusCode: 400,
            headers,
            body: "No se pudo completar el inicio de sesión: " +
                error.message +
                "\n\nVuelve a NO ESCAPE e inténtalo otra vez."
        };
    }
};
            
