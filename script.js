
// NO ESCAPE - Funciones de la página

// Fecha provisional de inicio del contador.
// Después podemos cambiarla por la fecha oficial.
const FECHA_INICIO = new Date(2026, 10, 4);

function actualizarProgreso() {
    const ahora = new Date();
    const milisegundosPorDia = 1000 * 60 * 60 * 24;

    const dias = Math.max(
        0,
        Math.floor((ahora - FECHA_INICIO) / milisegundosPorDia)
    );

    const aumentos = Math.floor(dias / 5);
    const progreso = Math.min(100, aumentos);

    const numero = document.getElementById("progressNumber");
    const barra = document.getElementById("progressFill");
    const siguiente = document.getElementById("nextProgress");

    if (numero) {
        numero.textContent = progreso + "%";
    }

    if (barra) {
        barra.style.width = progreso + "%";
    }

    if (siguiente) {
        if (progreso >= 100) {
            siguiente.textContent = "¡Progreso del contador completado!";
        } else {
            const faltan = 5 - (dias % 5);
            siguiente.textContent =
                "Próximo incremento en " + faltan + " día(s).";
        }
    }
}

// Botón de inicio de sesión
document.getElementById("loginBtn")?.addEventListener("click", () => {
    alert(
        "El inicio de sesión oficial con Roblox estará disponible próximamente. Nunca escribas tu contraseña aquí."
    );
});

// Botón del juego
document.getElementById("gameBtn")?.addEventListener("click", () => {
    alert("NO ESCAPE todavía está en desarrollo. ¡Próximamente en Roblox!");
});

// Botón de comunidad
document.getElementById("communityBtn")?.addEventListener("click", () => {
    alert("La comunidad oficial de NO ESCAPE estará disponible próximamente.");
});

// Iniciar contador
actualizarProgreso();
setInterval(actualizarProgreso, 60000);
  
