
// NO ESCAPE - Funciones de la página

// Fecha provisional del contador
const FECHA_INICIO = new Date(2026, 10, 4);

function actualizarProgreso() {
    const ahora = new Date();
    const dia = 1000 * 60 * 60 * 24;

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
            : "Próximo incremento en " + (5 - (dias % 5)) + " día(s).";
    }
}

// Inicio de sesión REAL con Roblox
const loginBtn = document.getElementById("loginBtn");

loginBtn?.addEventListener("click", () => {
    window.location.href = "/.netlify/functions/roblox-login";
});

// Botón del juego
document.getElementById("gameBtn")?.addEventListener("click", () => {
    alert("NO ESCAPE todavía está en desarrollo. ¡Próximamente en Roblox!");
});

// Comunidad
document.getElementById("communityBtn")?.addEventListener("click", () => {
    alert("La comunidad oficial de NO ESCAPE estará disponible próximamente.");
});

// Cerrar sesión, si existe el botón
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        await fetch("/.netlify/functions/roblox-logout", {
            method: "POST"
        });
        window.location.reload();
    } catch {
        alert("No se pudo cerrar la sesión.");
    }
});

// Iniciar contador
actualizarProgreso();
setInterval(actualizarProgreso, 60000);
