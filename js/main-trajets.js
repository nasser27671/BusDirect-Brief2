
import { renderTrajets } from "./render.js";
import { initialiser } from "./store.js";

const trip = await initialiser();
console.table(trip);

async function afficher() {
    renderTrajets(trip);
}

afficher();
