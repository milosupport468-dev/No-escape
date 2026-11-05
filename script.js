
/* =========================================
   NO ESCAPE - SISTEMA PRINCIPAL
========================================= */

// CONFIGURACIÓN DEL PROGRESO
const FECHA_INICIO = new Date(2026, 10, 4);

// ACTUALIZAR PROGRESO
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
              (5 - (dias % 5)) + " día(s).";
    }
}

// OBTENER PERFIL DE ROBLOX
function obtenerPerfil() {
    try {
        const cookie = document.cookie
            .split("; ")
            .find(item => item.startsWith("roblox_user="));

        if (!cookie) return null;

        return JSON.parse(
            decodeURIComponent(
                cookie.substring("roblox_user=".length)
            )
        );
    } catch (error) {
        console.error("Error leyendo perfil:", error);
        return null;
    }
}

// ESTILOS DEL MENÚ DE CUENTA
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

    if (!loginBtn || !loginBtn.parentNode || !perfil) return;

    loginBtn.style.display = "none";

    // Evitar duplicar el menú
    if (document.getElementById("accountArea")) return;

    const area = document.createElement("div");
    area.id = "accountArea";
    area.className = "account-area";

    area.innerHTML = `
        <button class="account-trigger" id="accountTrigger">
            <img id="accountAvatar" alt="Avatar">
            <span>Mi cuenta</span>
            <span>⌄</span>
        </button>

        <div class="account-menu" id="accountMenu">
            <div class="account-user">
                <img id="menuAvatar" alt="Avatar">
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

    const avatar = perfil.picture || "";

    if (avatar) {
        document.getElementById("accountAvatar").src = avatar;
        document.getElementById("menuAvatar").src = avatar;
    }

    document.getElementById("menuName").textContent =
        perfil.displayName || "Jugador de Roblox";

    document.getElementById("menuUsername").textContent =
        perfil.username ? "@" + perfil.username : "Cuenta Roblox";

    const menu = document.getElementById("accountMenu");

    document.getElementById("accountTrigger").onclick = () => {
        menu.classList.toggle("open");
    };

    document.addEventListener("click", event => {
        if (!area.contains(event.target)) {
            menu.classList.remove("open");
        }
    });

    // CONFIGURACIÓN
    document.getElementById("configureAccount").onclick = () => {
        menu.classList.remove("open");
        mostrarConfiguracion(perfil);
    };

    // CERRAR SESIÓN
    document.getElementById("logoutAccount").onclick = async () => {
        try {
            const respuesta = await fetch(
                "/.netlify/functions/roblox-logout",
                { method: "POST" }
            );

            if (!respuesta.ok) {
                throw new Error("No se pudo cerrar la sesión.");
            }

            window.location.reload();

        } catch (error) {
            alert("Error al cerrar sesión. Inténtalo de nuevo.");
        }
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

        modal.addEventListener("click", event => {
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

// INICIO DE SESIÓN CON ROBLOX
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        window.location.href =
            "/.netlify/functions/roblox-login";
    });
}

// BOTÓN DEL JUEGO
document.getElementById("gameBtn")?.addEventListener("click", () => {
    alert("NO ESCAPE todavía está en desarrollo.");
});

// COMUNIDAD
document.getElementById("communityBtn")?.addEventListener("click", () => {
    alert("La comunidad oficial estará disponible próximamente.");
});

// INICIAR SISTEMA
actualizarProgreso();

setInterval(actualizarProgreso, 60000);

// COMPROBAR SESIÓN
const perfilRoblox = obtenerPerfil();

if (perfilRoblox) {
    crearMenuCuenta(perfilRoblox);
                           }


/* =========================================
   NO ESCAPE - PANEL ESPECIAL
   OWNER / DEV + ADMIN
========================================= */

(() => {
    const ROLES = {
        rodnydetemu6: {
            name: "Rodnydetemu6",
            role: "OWNER",
            permissions: ["all"]
        },
        soyloky944: {
            name: "soyloky944",
            role: "DEV + ADMIN",
            permissions: [
                "noticias", "anuncios", "eventos",
                "mapas", "zombis", "armas",
                "comunidad", "multimedia", "estadisticas"
            ]
        },
        donsalva3w: {
            name: "donsalva3w",
            role: "DEV + ADMIN",
            permissions: [
                "noticias", "anuncios", "eventos",
                "mapas", "zombis", "armas",
                "comunidad", "multimedia", "estadisticas"
            ]
        }
    };

    const SECTIONS = {
        noticias: "📰 Noticias",
        anuncios: "📢 Anuncios",
        eventos: "📅 Eventos",
        mapas: "🗺️ Mapas",
        zombis: "🧟 Zombis",
        armas: "🔫 Armas",
        comunidad: "👥 Comunidad",
        multimedia: "🖼️ Multimedia",
        estadisticas: "📊 Estadísticas"
    };

    const STORAGE_KEY = "no_escape_panel_content_v1";

    let currentUser = null;
    let currentSection = "noticias";
    let content = loadContent();

    function loadContent() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    }

    function saveContent() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }

    function getProfile() {
        const cookie = document.cookie
            .split("; ")
            .find(c => c.startsWith("roblox_user="));

        if (!cookie) return null;

        try {
            return JSON.parse(
                decodeURIComponent(cookie.substring(12))
            );
        } catch {
            return null;
        }
    }

    function can(permission) {
        return currentUser.permissions.includes("all") ||
            currentUser.permissions.includes(permission);
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function createStyles() {
        if (document.getElementById("nePanelStyles")) return;

        const style = document.createElement("style");
        style.id = "nePanelStyles";
        style.textContent = `
            #neAdminButton {
                position:fixed;right:16px;bottom:18px;z-index:9998;
                background:#b91c1c;color:white;border:0;border-radius:12px;
                padding:14px 18px;font-weight:bold;cursor:pointer;
            }
            #neAdminPanel {
                position:fixed;inset:3%;z-index:9999;
                background:#101010;color:white;border:1px solid #7f1d1d;
                border-radius:16px;padding:18px;overflow:auto;
                font-family:Arial,sans-serif;box-shadow:0 0 40px #000;
            }
            #neAdminPanel button {
                cursor:pointer;border:1px solid #444;border-radius:9px;
                padding:11px;background:#242424;color:white;
            }
            #neAdminPanel input,#neAdminPanel textarea {
                box-sizing:border-box;width:100%;padding:12px;
                margin:7px 0 13px;background:#202020;color:white;
                border:1px solid #444;border-radius:8px;
            }
            #neAdminPanel textarea {min-height:100px;resize:vertical}
            .ne-grid {display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px}
            .ne-card {background:#1b1b1b;border:1px solid #333;border-radius:12px;padding:13px;margin:10px 0}
            .ne-primary {background:#991b1b!important;border-color:#dc2626!important}
            .ne-muted {color:#aaa;font-size:12px}
        `;
        document.head.appendChild(style);
    }

    function addButton() {
        if (document.getElementById("neAdminButton")) return;

        const button = document.createElement("button");
        button.id = "neAdminButton";
        button.textContent = "⚙️ PANEL NO ESCAPE";
        button.onclick = openPanel;
        document.body.appendChild(button);
    }

    function openPanel() {
        if (document.getElementById("neAdminPanel")) return;

        const panel = document.createElement("div");
        panel.id = "neAdminPanel";
        document.body.appendChild(panel);

        renderPanel();
    }

    function renderPanel() {
        const panel = document.getElementById("neAdminPanel");
        if (!panel) return;

        const sectionButtons = Object.entries(SECTIONS)
            .filter(([key]) => can(key))
            .map(([key, label]) => `
                <button data-section="${key}"
                    class="${currentSection === key ? "ne-primary" : ""}">
                    ${label}
                </button>
            `).join("");

        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
                <div>
                    <h2 style="color:#ef4444;margin:0">NO ESCAPE</h2>
                    <p class="ne-muted">CONTROL CENTER</p>
                </div>
                <button id="neClose">✕ Cerrar</button>
            </div>

            <div class="ne-card">
                <b>${escapeHTML(currentUser.name)}</b>
                <p style="color:#f87171">${escapeHTML(currentUser.role)}</p>
            </div>

            <h3>Herramientas</h3>
            <div class="ne-grid">${sectionButtons}</div>
            <hr style="border-color:#333;margin:18px 0">
            <div id="neSection"></div>
            <p class="ne-muted">NO ESCAPE · Panel de administración</p>
        `;

        panel.querySelector("#neClose").onclick = () => panel.remove();

        panel.querySelectorAll("[data-section]").forEach(button => {
            button.onclick = () => {
                currentSection = button.dataset.section;
                renderPanel();
            };
        });

        renderSection();
    }

    function getItems() {
        if (!content[currentSection]) content[currentSection] = [];
        return content[currentSection];
    }

    function renderSection() {
        const area = document.getElementById("neSection");
        if (!area) return;

        if (currentSection === "estadisticas") {
            const total = Object.values(content)
                .reduce((sum, items) => sum + items.length, 0);

            area.innerHTML = `
                <h2>📊 Estadísticas</h2>
                <div class="ne-card">
                    <h3>${total}</h3>
                    <p>Contenidos guardados en este navegador</p>
                </div>
                ${Object.entries(SECTIONS).map(([key, label]) => `
                    <div class="ne-card">
                        ${label}: ${(content[key] || []).length} registros
                    </div>
                `).join("")}
            `;
            return;
        }

        const items = getItems();

        area.innerHTML = `
            <h2>${SECTIONS[currentSection]}</h2>

            <form id="neForm">
                <label>Título</label>
                <input id="neTitle" maxlength="100" required
                    placeholder="Escribe un título">

                <label>Descripción o contenido</label>
                <textarea id="neDescription" maxlength="5000" required
                    placeholder="Escribe aquí..."></textarea>

                <label>Imagen (URL opcional)</label>
                <input id="neImage" type="url"
                    placeholder="https://...">

                <button class="ne-primary" type="submit">
                    + Publicar contenido
                </button>
            </form>

            <h3>Contenido creado (${items.length})</h3>

            <div id="neItems">
                ${items.map((item, index) => `
                    <article class="ne-card">
                        <h3>${escapeHTML(item.title)}</h3>
                        <p>${escapeHTML(item.description)}</p>
                        ${item.image ? `
                            <img src="${escapeHTML(item.image)}"
                                alt="" loading="lazy"
                                style="max-width:100%;max-height:180px;border-radius:9px">
                        ` : ""}
                        <p class="ne-muted">
                            Publicado por ${escapeHTML(item.author)}
                        </p>
                        <div class="ne-grid">
                            <button data-edit="${index}">✏️ Editar</button>
                            <button data-delete="${index}">🗑️ Eliminar</button>
                        </div>
                    </article>
                `).join("") || "<p>Aún no hay contenido.</p>"}
            </div>
        `;

        area.querySelector("#neForm").onsubmit = event => {
            event.preventDefault();

            const title = area.querySelector("#neTitle").value.trim();
            const description = area.querySelector("#neDescription").value.trim();
            const image = area.querySelector("#neImage").value.trim();

            if (!title || !description) return;

            items.push({
                title,
                description,
                image,
                author: currentUser.name,
                date: new Date().toISOString()
            });

            saveContent();
            renderSection();
        };

        area.querySelectorAll("[data-delete]").forEach(button => {
            button.onclick = () => {
                const index = Number(button.dataset.delete);

                if (!confirm("¿Eliminar este contenido?")) return;

                items.splice(index, 1);
                saveContent();
                renderSection();
            };
        });

        area.querySelectorAll("[data-edit]").forEach(button => {
            button.onclick = () => {
                const index = Number(button.dataset.edit);
                const item = items[index];

                const title = prompt("Nuevo título:", item.title);
                if (title === null) return;

                const description = prompt(
                    "Nueva descripción:", item.description
                );
                if (description === null) return;

                if (!title.trim() || !description.trim()) {
                    alert("Completa el título y la descripción.");
                    return;
                }

                item.title = title.trim();
                item.description = description.trim();

                saveContent();
                renderSection();
            };
        });
    }

    function start() {
        const profile = getProfile();
        if (!profile || !profile.username) return;

        const username = String(profile.username).toLowerCase();
        const role = ROLES[username];

        if (!role) return;

        currentUser = role;
        createStyles();
        addButton();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
           

            
