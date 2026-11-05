
/* =====================================================
   NO ESCAPE - SISTEMA PRINCIPAL + CONTROL CENTER
   OWNER: Rodnydetemu6
   DEV + ADMIN: soyloky944 / donsalva3w
===================================================== */

(() => {
"use strict";

/* =====================================================
   1. CONFIGURACIÓN
===================================================== */

const FECHA_INICIO = new Date(2026, 10, 4);
const STORAGE_KEY = "no_escape_control_center_v3";

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

const CATEGORIES = {
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

/* =====================================================
   2. ESTADO
===================================================== */

let currentUser = null;
let currentPage = "inicio";
let currentCategory = "noticias";
let editingId = null;
let searchQuery = "";

let database = loadDatabase();

function loadDatabase() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (saved && Array.isArray(saved.posts) &&
            Array.isArray(saved.drafts) &&
            Array.isArray(saved.history)) {
            return saved;
        }
    } catch (error) {
        console.error("Error leyendo datos:", error);
    }

    return {
        posts: [],
        drafts: [],
        history: []
    };
}

function saveDatabase() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    } catch (error) {
        alert("No se pudieron guardar los datos. Puede faltar espacio.");
        console.error(error);
    }
}

/* =====================================================
   3. PERFIL ROBLOX EXISTENTE
===================================================== */

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

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

/* =====================================================
   4. PROGRESO
===================================================== */

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

/* =====================================================
   5. ESTILOS
===================================================== */

function crearEstilos() {
    if (document.getElementById("neSystemStyles")) return;

    const style = document.createElement("style");
    style.id = "neSystemStyles";

    style.textContent = `
    .account-area {
        position:relative;
        display:inline-block;
        font-family:Arial,sans-serif;
        z-index:1000;
    }

    .account-trigger {
        display:flex;
        align-items:center;
        gap:9px;
        background:#171717;
        color:white;
        border:1px solid #a51d25;
        border-radius:12px;
        padding:9px 13px;
        cursor:pointer;
        font-weight:bold;
    }

    .account-trigger img {
        width:32px;
        height:32px;
        border-radius:50%;
        object-fit:cover;
    }

    .account-menu {
        position:absolute;
        right:0;
        top:calc(100% + 12px);
        width:260px;
        background:#111;
        color:white;
        border:1px solid #702027;
        border-radius:14px;
        padding:15px;
        box-shadow:0 12px 35px #000b;
        display:none;
    }

    .account-menu.open {display:block;}

    .account-menu button {
        width:100%;
        background:#202020;
        color:white;
        border:0;
        padding:12px;
        margin-top:9px;
        border-radius:9px;
        cursor:pointer;
        text-align:left;
    }

    .account-modal {
        position:fixed;
        inset:0;
        z-index:99999;
        background:#000c;
        display:none;
        align-items:center;
        justify-content:center;
        padding:15px;
    }

    .account-modal.open {display:flex;}

    .account-modal-content {
        width:100%;
        max-width:400px;
        background:#151515;
        color:white;
        border:1px solid #8d252d;
        border-radius:16px;
        padding:23px;
        box-sizing:border-box;
    }

    #neAdminButton {
        position:fixed;
        right:16px;
        bottom:18px;
        z-index:9998;
        background:#991b1b;
        color:white;
        border:1px solid #ef4444;
        border-radius:12px;
        padding:13px 17px;
        font-weight:bold;
        cursor:pointer;
        box-shadow:0 0 18px #991b1b88;
    }

    #neAdminPanel {
        position:fixed;
        inset:2%;
        z-index:9999;
        background:#101010;
        color:white;
        border:1px solid #7f1d1d;
        border-radius:16px;
        overflow:auto;
        font-family:Arial,sans-serif;
        box-shadow:0 0 40px #000;
    }

    #neAdminPanel button {
        cursor:pointer;
        border:1px solid #444;
        border-radius:9px;
        padding:11px;
        background:#242424;
        color:white;
    }

    #neAdminPanel input,
    #neAdminPanel textarea,
    #neAdminPanel select {
        box-sizing:border-box;
        width:100%;
        padding:12px;
        margin:7px 0 13px;
        background:#202020;
        color:white;
        border:1px solid #444;
        border-radius:8px;
    }

    #neAdminPanel textarea {
        min-height:110px;
        resize:vertical;
    }

    .ne-top {
        position:sticky;
        top:0;
        z-index:5;
        background:#151515;
        padding:14px;
        border-bottom:1px solid #333;
    }

    .ne-nav {
        display:flex;
        gap:7px;
        overflow-x:auto;
        margin-top:12px;
    }

    .ne-nav button.active,
    .ne-primary {
        background:#991b1b!important;
        border-color:#dc2626!important;
    }

    .ne-body {padding:16px;}

    .ne-grid {
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(135px,1fr));
        gap:10px;
    }

    .ne-card {
        background:#1b1b1b;
        border:1px solid #333;
        border-radius:12px;
        padding:14px;
        margin:10px 0;
    }

    .ne-muted {color:#aaa;font-size:12px;}
    .ne-red {color:#f87171;}

    .ne-actions {
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        margin-top:12px;
    }

    .ne-publication img {
        max-width:100%;
        max-height:220px;
        border-radius:10px;
        margin-top:10px;
    }

    @media(max-width:600px) {
        .account-menu {
            position:fixed;
            top:75px;
            right:12px;
            left:12px;
            width:auto;
        }

        #neAdminPanel {
            inset:0;
            border-radius:0;
        }

        .ne-body {padding:12px;}
    }
    `;

    document.head.appendChild(style);
}

/* =====================================================
   6. MENÚ DE CUENTA
===================================================== */

function crearMenuCuenta(perfil) {
    const loginBtn = document.getElementById("loginBtn");

    if (!loginBtn || !loginBtn.parentNode || !perfil) return;

    loginBtn.style.display = "none";

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
            <div style="display:flex;gap:12px;align-items:center">
                <img id="menuAvatar"
                    style="width:48px;height:48px;border-radius:50%"
                    alt="Avatar">
                <div>
                    <strong id="menuName"></strong>
                    <small id="menuUsername"
                        style="display:block;color:#aaa"></small>
                </div>
            </div>

            <button id="configureAccount">⚙️ Configurar cuenta</button>
            <button id="logoutAccount">↪ Cerrar sesión</button>
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

    document.getElementById("configureAccount").onclick = () => {
        menu.classList.remove("open");
        mostrarConfiguracion(perfil);
    };

    document.getElementById("logoutAccount").onclick = async () => {
        try {
            const response = await fetch(
                "/.netlify/functions/roblox-logout",
                { method: "POST" }
            );

            if (!response.ok) {
                throw new Error("Error de cierre de sesión");
            }

            window.location.reload();
        } catch (error) {
            alert("No se pudo cerrar sesión. Comprueba que roblox-logout.js exista.");
        }
    };
}

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
        "ID Roblox: " + (perfil.id || "No disponible");

    document.getElementById("configDevice").textContent =
        "Dispositivo: " +
        (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
            ? "Teléfono" : "PC");

    modal.classList.add("open");
}

/* =====================================================
   7. PANEL DE ADMINISTRACIÓN
===================================================== */

function can(permission) {
    return currentUser &&
        (currentUser.permissions.includes("all") ||
         currentUser.permissions.includes(permission));
}

function isOwner() {
    return currentUser && currentUser.role === "OWNER";
}

function startAdmin(profile) {
    if (!profile || !profile.username) return;

    const username = String(profile.username).toLowerCase();
    const role = ROLES[username];

    if (!role) return;

    currentUser = role;

    if (document.getElementById("neAdminButton")) return;

    const button = document.createElement("button");
    button.id = "neAdminButton";
    button.textContent = "⚙️ NO ESCAPE";
    button.onclick = openAdminPanel;

    document.body.appendChild(button);
}

function openAdminPanel() {
    if (document.getElementById("neAdminPanel")) return;

    const panel = document.createElement("div");
    panel.id = "neAdminPanel";

    document.body.appendChild(panel);

    renderPanel();
}

function renderPanel() {
    const panel = document.getElementById("neAdminPanel");
    if (!panel) return;

    const navigation = [
        ["inicio", "🏠 Inicio"],
        ["cuenta", "👤 Cuenta"],
        ["categorias", "☰ Categorías"]
    ];

    if (isOwner()) navigation.push(["owner", "👑 Owner"]);

    panel.innerHTML = `
        <header class="ne-top">
            <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                    <b style="font-size:19px;color:#ef4444">NO ESCAPE</b>
                    <div class="ne-muted">CONTROL CENTER</div>
                </div>
                <button id="neClose">✕ Cerrar</button>
            </div>

            <nav class="ne-nav">
                ${navigation.map(([id, label]) => `
                    <button data-page="${id}"
                        class="${currentPage === id ? "active" : ""}">
                        ${label}
                    </button>
                `).join("")}
            </nav>
        </header>

        <main class="ne-body" id="neMain"></main>
    `;

    panel.querySelector("#neClose").onclick = () => panel.remove();

    panel.querySelectorAll("[data-page]").forEach(button => {
        button.onclick = () => {
            currentPage = button.dataset.page;
            renderPanel();
        };
    });

    renderPage();
}

function renderPage() {
    const area = document.getElementById("neMain");
    if (!area) return;

    if (currentPage === "inicio") renderHome(area);
    if (currentPage === "cuenta") renderAccount(area);
    if (currentPage === "categorias") renderCategories(area);
    if (currentPage === "owner" && isOwner()) renderOwner(area);
}

/* =====================================================
   8. INICIO
===================================================== */

function renderHome(area) {
    const total = database.posts.length;
    const drafts = database.drafts.length;

    area.innerHTML = `
        <h2>🏠 Inicio</h2>
        <p>Bienvenido al centro de control de NO ESCAPE.</p>

        <div class="ne-card">
            <b>${escapeHTML(currentUser.name)}</b>
            <p class="ne-red">${escapeHTML(currentUser.role)}</p>
        </div>

        <div class="ne-grid">
            <div class="ne-card">
                <h2>${total}</h2>
                <p>Publicaciones</p>
            </div>
            <div class="ne-card">
                <h2>${drafts}</h2>
                <p>Borradores</p>
            </div>
            <div class="ne-card">
                <h2>${database.history.length}</h2>
                <p>Acciones registradas</p>
            </div>
        </div>

        <h3>Accesos rápidos</h3>
        <div class="ne-grid">
            ${Object.entries(CATEGORIES)
                .filter(([key]) => can(key) && key !== "estadisticas")
                .map(([key, label]) => `
                    <button data-quick="${key}">${label}</button>
                `).join("")}
        </div>
    `;

    area.querySelectorAll("[data-quick]").forEach(button => {
        button.onclick = () => {
            currentCategory = button.dataset.quick;
            currentPage = "categorias";
            renderPanel();
        };
    });
}

/* =====================================================
   9. CUENTA
===================================================== */

function renderAccount(area) {
    const profile = obtenerPerfil() || {};

    area.innerHTML = `
        <h2>👤 Mi cuenta</h2>
        <div class="ne-card">
            <h3>${escapeHTML(currentUser.name)}</h3>
            <p class="ne-red">${escapeHTML(currentUser.role)}</p>
            <p>Usuario Roblox: @${escapeHTML(profile.username || "")}</p>
            <p>ID Roblox: ${escapeHTML(profile.id || "No disponible")}</p>
            <p>Sesión de perfil: ${profile.username ? "Detectada" : "No disponible"}</p>
        </div>

        <h3>Mis publicaciones</h3>
        ${database.posts.filter(post => post.author === currentUser.name).length}
        <p class="ne-muted">Publicaciones atribuidas a esta cuenta en este navegador.</p>
    `;
}

/* =====================================================
   10. CATEGORÍAS
===================================================== */

function renderCategories(area) {
    const available = Object.entries(CATEGORIES)
        .filter(([key]) => can(key));

    area.innerHTML = `
        <h2>☰ Categorías</h2>

        <label>Seleccionar categoría</label>
        <select id="neCategorySelect">
            ${available.map(([key, label]) => `
                <option value="${key}"
                    ${key === currentCategory ? "selected" : ""}>
                    ${label}
                </option>
            `).join("")}
        </select>

        <div id="neCategoryContent"></div>

        <hr style="border-color:#333;margin:20px 0">

        <h3>🔎 Buscar publicaciones</h3>
        <input id="neSearch" placeholder="Buscar por título o contenido..."
            value="${escapeHTML(searchQuery)}">

        <div id="neSearchResults"></div>

        <h3>📝 Borradores</h3>
        <div id="neDrafts"></div>

        <h3>📚 Historial</h3>
        <div id="neHistory"></div>
    `;

    const select = area.querySelector("#neCategorySelect");

    select.onchange = () => {
        currentCategory = select.value;
        editingId = null;
        renderCategoryContent();
    };

    area.querySelector("#neSearch").oninput = event => {
        searchQuery = event.target.value;
        renderSearchResults();
    };

    renderCategoryContent();
    renderSearchResults();
    renderDrafts();
    renderHistory();
}

/* =====================================================
   11. EDITOR DE CADA CATEGORÍA
===================================================== */

function renderCategoryContent() {
    const area = document.getElemen
            editing.updatedAt = new Date().toISOString();

            if (status === "draft") {
                database.posts = database.posts.filter(
                    post => post.id !== editing.id
                );

                editing.status = "draft";
                database.drafts.push(editing);
            }

            addHistory("Editó", editing.title);
            editingId = null;

        } else {
            const item = {
                id: "ne_" + Date.now() + "_" +
                    Math.random().toString(36).slice(2, 8),
                category: key,
                title,
                description,
                image,
                author: currentUser.name,
                date: new Date().toISOString(),
                status
            };

            if (status === "draft") {
                database.drafts.push(item);
                addHistory("Guardó borrador", title);
            } else {
                database.posts.push(item);
                addHistory("Publicó", title);
            }
        }

        saveDatabase();
        renderPanel();
    };

    area.querySelector("#neCancelEdit")?.addEventListener("click", () => {
        editingId = null;
        renderCategoryContent();
    });

    area.querySelectorAll("[data-edit]").forEach(button => {
        button.onclick = () => {
            editingId = button.dataset.edit;
            renderCategoryContent();
        };
    });

    area.querySelectorAll("[data-delete]").forEach(button => {
        button.onclick = () => {
            const id = button.dataset.delete;
            const post = database.posts.find(item => item.id === id);

            if (!post || !confirm("¿Eliminar esta publicación?")) return;

            database.posts = database.posts.filter(
                item => item.id !== id
            );

            addHistory("Eliminó", post.title);
            saveDatabase();
            renderPanel();
        };
    });
}

/* =====================================================
   12. BORRADORES
===================================================== */

function renderDrafts() {
    const area = document.getElementById("neDrafts");
    if (!area) return;

    area.innerHTML = database.drafts.map(item => `
        <div class="ne-card">
            <b>${escapeHTML(item.title)}</b>
            <p class="ne-muted">
                ${CATEGORIES[item.category] || item.category}
            </p>

            <div class="ne-actions">
                <button data-draft-publish="${escapeHTML(item.id)}">
                    Publicar
                </button>
                <button data-draft-delete="${escapeHTML(item.id)}">
                    Eliminar
                </button>
            </div>
        </div>
    `).join("") || "<p>No hay borradores.</p>";

    area.querySelectorAll("[data-draft-publish]").forEach(button => {
        button.onclick = () => {
            const id = button.dataset.draftPublish;
            const item = database.drafts.find(draft => draft.id === id);

            if (!item || !can(item.category)) {
                alert("No tienes permiso para esta categoría.");
                return;
            }

            database.drafts = database.drafts.filter(
                draft => draft.id !== id
            );

            item.status = "published";
            item.date = new Date().toISOString();
            database.posts.push(item);

            addHistory("Publicó borrador", item.title);
            saveDatabase();
            renderPanel();
        };
    });

    area.querySelectorAll("[data-draft-delete]").forEach(button => {
        button.onclick = () => {
            const id = button.dataset.draftDelete;
            const item = database.drafts.find(draft => draft.id === id);

            if (!item || !can(item.category)) return;
            if (!confirm("¿Eliminar este borrador?")) return;

            database.drafts = database.drafts.filter(
                draft => draft.id !== id
            );

            addHistory("Eliminó borrador", item.title);
            saveDatabase();
            renderPanel();
        };
    });
}

/* =====================================================
   13. BUSCADOR
===================================================== */

function renderSearchResults() {
    const area = document.getElementById("neSearchResults");
    if (!area) return;

    const query = searchQuery.toLowerCase().trim();

    const results = database.posts.filter(post =>
        can(post.category) &&
        (
            !query ||
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query)
        )
    );

    area.innerHTML = results.map(post => `
        <div class="ne-card">
            <b>${escapeHTML(post.title)}</b>
            <p class="ne-muted">
                ${CATEGORIES[post.category] || post.category}
            </p>
            <button data-result="${escapeHTML(post.id)}">
                Abrir
            </button>
        </div>
    `).join("") || "<p>No se encontraron publicaciones.</p>";

    area.querySelectorAll("[data-result]").forEach(button => {
        button.onclick = () => {
            const post = database.posts.find(
                item => item.id === button.dataset.result
            );

            if (!post) return;

            currentCategory = post.category;
            editingId = post.id;
            renderPanel();
        };
    });
}

/* =====================================================
   14. HISTORIAL
===================================================== */

function addHistory(action, title) {
    database.history.unshift({
        action,
        title,
        user: currentUser.name,
        date: new Date().toISOString()
    });

    database.history = database.history.slice(0, 200);
}

function renderHistory() {
    const area = document.getElementById("neHistory");
    if (!area) return;

    area.innerHTML = database.history
        .filter(item => item.user === currentUser.name || isOwner())
        .slice(0, 30)
        .map(item => `
            <div class="ne-card">
                <b>${escapeHTML(item.action)}:</b>
                ${escapeHTML(item.title)}

                <p class="ne-muted">
                    ${escapeHTML(item.user)} ·
                    ${new Date(item.date).toLocaleString()}
                </p>
            </div>
        `).join("") || "<p>No hay actividad registrada.</p>";
}

/* =====================================================
   15. ESTADÍSTICAS
===================================================== */

function renderStatistics(area) {
    const total = database.posts.length;
    const drafts = database.drafts.length;

    area.innerHTML = `
        <h2>📊 Estadísticas</h2>

        <div class="ne-grid">
            <div class="ne-card">
                <h2>${total}</h2>
                Publicaciones
            </div>

            <div class="ne-card">
                <h2>${drafts}</h2>
                Borradores
            </div>

            <div class="ne-card">
                <h2>${database.history.length}</h2>
                Acciones
            </div>
        </div>

        <h3>Contenido por categoría</h3>

        ${Object.entries(CATEGORIES)
            .filter(([key]) => can(key))
            .map(([key, label]) => `
                <div class="ne-card">
                    ${label}
                    <b style="float:right">
                        ${database.posts.filter(
                            post => post.category === key
                        ).length}
                    </b>
                </div>
            `).join("")}
    `;
}

/* =====================================================
   16. PANEL OWNER
===================================================== */

function renderOwner(area) {
    if (!isOwner()) {
        area.innerHTML = "<h2>Acceso denegado</h2>";
        return;
    }

    area.innerHTML = `
        <h2>👑 OWNER CONTROL</h2>

        <div class="ne-card">
            <h3>Rodnydetemu6</h3>
            <p class="ne-red">OWNER</p>
            <p>Propietario del proyecto NO ESCAPE.</p>
        </div>

        <h3>Equipo autorizado</h3>

        <div class="ne-card">
            <b>soyloky944</b>
            <p class="ne-red">DEV + ADMIN</p>
        </div>

        <div class="ne-card">
            <b>donsalva3w</b>
            <p class="ne-red">DEV + ADMIN</p>
        </div>

        <h3>Herramientas</h3>

        <button id="neExportData">
            📥 Exportar datos JSON
        </button>

        <button id="neClearHistory">
            🧹 Limpiar historial
        </button>

        <p class="ne-muted">
            Herramientas locales del panel.
        </p>
    `;

    area.querySelector("#neExportData").onclick = () => {
        const blob = new Blob(
            [JSON.stringify(database, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "no-escape-backup.json";
        link.click();

        URL.revokeObjectURL(url);
    };

    area.querySelector("#neClearHistory").onclick = () => {
        if (!confirm("¿Borrar todo el historial?")) return;

        database.history = [];
        saveDatabase();
        renderPanel();
    };
}

/* =====================================================
   17. INICIO DEL SISTEMA
===================================================== */

function iniciarSistema() {
    actualizarProgreso();
    setInterval(actualizarProgreso, 60000);

    crearEstilos();

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            window.location.href =
                "/.netlify/functions/roblox-login";
        });
    }

    document.getElementById("gameBtn")?.addEventListener("click", () => {
        alert("NO ESCAPE todavía está en desarrollo.");
    });

    document.getElementById("communityBtn")?.addEventListener("click", () => {
        alert("La comunidad oficial estará disponible próximamente.");
    });

    const profile = obtenerPerfil();

    if (profile) {
        crearMenuCuenta(profile);
        startAdmin(profile);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarSistema);
} else {
    iniciarSistema();
}

})();
                   
