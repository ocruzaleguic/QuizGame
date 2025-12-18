import { STORE_ITEMS } from "../data/storeItems.js";
import { lsGet, lsSet, ensureGamification, syncUser, requireAuth } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {

    // SEGURIDAD 
    requireAuth();

    renderCoins();
    renderStore();
});

function renderCoins() {
    const user = lsGet("loggedUser");
    const coinsEl = document.getElementById("coinsValue");

    coinsEl.textContent = user?.gamification?.coins ?? 0;
}

function renderStore() {
    const user = lsGet("loggedUser");
    ensureGamification(user);

    const container = document.getElementById("storeItems");
    container.innerHTML = "";

    STORE_ITEMS.forEach(item => {
        const owned = user.gamification.inventory.includes(item.id);
        const canAfford = user.gamification.coins >= item.price;

        const card = document.createElement("div");
        card.className = "store-item";

        if (owned) card.classList.add("purchased");
        else if (!canAfford) card.classList.add("insufficient");

        // RENDER DE ITEMS .............................
        card.innerHTML = `

            <h3>${item.name}</h3>

            <p>${item.description}</p>

            <p class="store-price">Precio: ${item.price} 🪙</p>

            <button class="btn-primary">
            ${owned ? "Comprado" : "Comprar"}
            </button>
        `;
        // .............................................

        const btn = card.querySelector("button");

        btn.disabled = owned || !canAfford;

        btn.onclick = () => buyItem(item);

        container.appendChild(card);
    });
}

// FUNCIONES ÚTILES PARA STORE.JS -------------------------------------

function buyItem(item) {
    const user = lsGet("loggedUser");
    ensureGamification(user);

    // Validaciones defensivas
    if (user.gamification.inventory.includes(item.id)) return;

    if (user.gamification.coins < item.price) {
        alert("No tienes monedas suficientes");
        return;
    }

    // Descontar monedas
    user.gamification.coins -= item.price;

    // Agregar al inventario
    user.gamification.inventory.push(item.id);

    // Persistir cambios
    lsSet("loggedUser", user);
    syncUser(user);

    // Actualizar UI
    renderCoins();
    renderStore();
}


