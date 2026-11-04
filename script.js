
/* =================================
   NO ESCAPE - SISTEMA DE CUENTAS
================================= */

// CONTADOR DE DESARROLLO
const FECHA_INICIO = new Date(2026, 10, 4);

function actualizarProgreso() {
    const ahora = new Date();
    const dia = 86400000;

    const dias = Math.max(
        0,
        Math.floor((ahora - FECHA_INICIO) / dia)
    );

    const progreso = Math.min(100, Math.floor(dias / 5));

    const numero = document.getElementById("progressNumber");
    const barra = document.getElementById("progressFill");
    const siguiente = document.getElementById("nextProgress");

    if (numero) numero.textContent = progreso + "%";
    if (barra) barra.style.width = progreso + "%";

    if (siguiente) {
        siguiente.textContent = progreso >= 100
            ? "¡Progreso completado!"
            : "Próximo incremento en " +
              (5 - dias % 5) + " día(s).";
    }
}

// LEER PERFIL DE ROBLOX
function obtenerPerfil() {
    try {
        const cookie = document.cookie
            .split("; ")
            .find(item => item.startsWith("roblox_user="));

        if (!cookie) return null;

        return JSON.parse(
            decodeURIComponent(cookie.substring("roblox_user=".length))
        );
    } catch (error) {
        console.error("Error leyendo perfil:", error);
        return null;
    }
}

// ESTILOS DEL MENÚ
const estilos = document.createElement("style");
estilos.textContent = `
.account-area {
    position: relative;
    display: inline-block;
    font-family: Arial, sans-serif;
    z-index: 1000;
}

.account-trigger {
    display: flex;
    align-items: center;
    gap: 9px;
    background: #171717;
    color: white;
    border: 1px solid #a51d25;
    border-radius: 12px;
    padding: 9px 13px;
    cursor: pointer;
    font-weight: bold;
}

.account-trigger img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background: #333;
}

.account-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 12px);
    width: 280px;
    background: #111;
    color: white;
    border: 1px solid #702027;
    border-radius: 14px;
    padding: 15px;
    box-shadow: 0 12px 35px #000b;
    display: none;
}

.account-menu.open {
    display: block;
}

.account-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid #333;
}

.account-user img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    background: #333;
}

.account-user strong {
    display: block;
    font-size: 14px;
}

.account-user small {
    color: #aaa;
    display: block;
    margin-top: 5px;
}

.account-menu button {
    width: 100%;
    background: #202020;
    color: white;
    border: 0;
    padding: 12px;
    margin-top: 9px;
    border-radius: 9px;
    cursor: pointer;
    text-align: left;
}

.account-menu button:hover {
    background: #702027;
}

.account-menu .logout-button {
    background: #651b20;
}

.account-modal {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: #000c;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 15px;
}

.account-modal.open {
    display: flex;
}

.account-modal-content {
    width: 100%;
    max-width: 400px;
    background: #151515;
    color: white;
    border: 1px solid #8d252d;
    border-radius: 16px;
    padding: 23px;
    box-sizing: border-box;
}

.account-modal-content h2 {
    margin-top: 0;
}

.account-modal-content p {
    color: #ccc;
    overflow-wrap: anywhere;
}

.account-modal-content button {
    width: 100%;
    padding: 12px;
    background: #8d252d;
    color: white;
    border: 0;
    border-radius: 9px;
    margin-top: 12px;
    cursor: pointer;
}

@media (max-width: 600px) {
    .account-menu {
        position: fixed;
        top: 75px;
        right: 12px;
        left: 12px;
        width: auto;
        max-width: none;
    }

    .account-trigger {
        padding: 7px 9px;
        font-size: 12px;
    }
}
`;
document.head.appendChild(estilos);

// CREAR MENÚ DE CUENTA
function crearMenuCuenta(perfil) {
    const loginBtn = document.getElementById("loginBtn");

    if (!loginBtn || !perfil) return;

    loginBtn.style.display = "none";

    const area = document.createElement("div");
    area.className = "account-area";

    const avatar = perfil.picture || "";
    const nombre = perfil.displayName ||
                   perfil.username ||
                   "Jugador de Roblox";

    area.innerHTML = `
        <button class="account-trigger" id="accountTrigger">
            <img src="" alt="Avatar" id="accountAvatar">
            <span>Mi cuenta</span>
            <span>⌄</span>
        </button>

        <div class="account-menu" id="accountMenu">
            <div class="account-user">
                <img src="" alt="Avatar" id="menuAvatar">
                <div>
                    <strong id="menuName"></strong>
                    <small id="menuUsername"></small>
                </div>
            </div>

            <button id="configureAccount">
                ⚙️ Configurar cuenta
            </button>

            <button id="logoutAccount" class="logout-button">
                ↪ Cerrar sesión
            </button>
        </div>
    `;

    loginBtn.parentNode.insertBefore(area, loginBtn.nextSibling);

    const setAvatar = (id) => {
        const img = document.getElementById(id);
        if (img && avatar) {
            img.src = avatar;
        }
    };

    setAvatar("accountAvatar");
    setAvatar("menuAvatar");

    document.getElementById("menuName").textContent = nombre;
    document.getElementById("menuUsername").textContent =
        perfil.username ? "@" + perfil.username : "Cuenta Roblox";

    const menu = document.getElementById("accountMenu");

    document.getElementById("accountTrigger").onclick = () => {
        menu.classList.toggle("open");
    };

    document.addEventListener("click", (event) => {
        if (!area.contains(event.target)) {
            menu.classList.remove("open");
        }
    });

    // CONFIGURAR CUENTA
    document.getElementById("configureAccount").onclick = () => {
        menu.classList.remove("open");
        mostrarConfiguracion(perfil);
    };

    // CERRAR SESIÓN
    document.getElementById("logoutAccount").onclick = () => {
        document.cookie =
            "roblox_user=; Path=/; Max-Age=0; Secure; SameSite=Lax";

        window.location.reload();
    };
}

// VENTANA DE CONFIGURACIÓN
function mostrarConfiguracion(perfil) {
    let modal = document.getElementById("accountModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "accountModal";
        modal.className = "account-modal";

        modal.innerHTML = `
            <div class="account-modal-content">
                <h2>Configuración de cuenta</h2>
                <p id="configName"></p>
                <p id="configUsername"></p>
                <p id="configId"></p>
                <p id="configDevice"></p>
                <button id="closeAccountModal">Cerrar</button>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("closeAccountModal").onclick = () => {
            modal.classList.remove("open");
        };

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("open");
            }
        });
    }

    document.getElementById("configName").textContent =
        "Nombre: " + (perfil.displayName || "No disponible");

    document.getElementById("configUsername").textContent =
        "Usuario: @" + (perfil.username || "No disponible");

    document.getElementById("configId").textContent =
        "ID de Roblox: " + (perfil.id || "No disponible");

    const esTelefono =
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    document.getElementById("configDevice").textContent =
        "Dispositivo: " + (esTelefono ? "Teléfono" : "PC");

    modal.classList.add("open");
}

// BOTÓN DEL JUEGO
document.getElementById("gameBtn")?.addEventListener("click", () => {
    alert("NO ESCAPE todavía está en desarrollo.");
});

// COMUNIDAD
document.getElementById("communityBtn")?.addEventListener("click", () => {
    alert("La comunidad oficial estará disponible próximamente.");
});

// INICIAR
actualizarProgreso();
setInterval(actualizarProgreso, 60000);

const perfilRoblox = obtenerPerfil();

if (perfilRoblox) {
    crearMenuCuenta(perfilRoblox);
        }
                               
