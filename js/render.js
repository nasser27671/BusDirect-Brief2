
import { estComplet, placeLibres } from "./reservations.js";

export function renderTrajets(trips) {
    const list = document.getElementById("list");

    list.innerHTML = trips.map(trip => {
        const { departure, destination } = trip;
        const complet = estComplet(trip);
        const placeLibre = placeLibres(trip);

        return `
            <div class="bg-white border rounded-xl shadow-md p-5">
                <h5 id="departure" class="text-2xl font-bold">${departure} -> ${destination}</h5>

                <p id="places" class="bg-yellow-500 rounded-md text-center p-2 mt-3">
                    Places disponibles : ${placeLibre}
                </p>

                <div class="flex justify-between items-center mt-4">
                    <span id="status" class="${complet ? "bg-red-300 text-red-800" : "bg-green-500 text-green-900"} border rounded-md px-2 py-1 text-sm font-bold">
                        ${complet ? "Complet" : "Disponible"}
                    </span>

                    <a href="cabine.html" class="text-center border rounded-lg px-4 py-2 shadow-sm">Réserver</a>
                </div>
            </div>
        `;
    }).join("");
}
