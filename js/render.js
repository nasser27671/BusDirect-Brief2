import {estComplet, placeLibres, price, departureTime, arrivTime} from "./reservations.js";

export function renderTrajets(trips) {
    const list = document.getElementById("list");

    list.innerHTML = trips.map(function (trip) {
        const { departure, destination } = trip;

        const complet = estComplet(trip);
        const tripPrice = price(trip);
        const departTime = departureTime(trip);
        const arrivalTime = arrivTime(trip);
        const placeLibre = placeLibres(trip);

        return `
            <div class="bg-white border rounded-xl shadow-md p-5">

                <h5 class="text-2xl font-bold">
                    ${departure} -> ${destination}
                </h5>

                <h6 class="text-sm">
                    Prix normal: ${tripPrice} DH
                </h6>

                <p class="text-yellow-600 text-sm font-bold">
                    Prix VIP (sièges 1 à 4): ${(tripPrice * 1.10).toFixed(2)} DH
                </p>

                <h6 class="text-blue-700 flex justify-end underline text-sm">
                    Départ à: ${departTime}
                    Arrivée à: ${arrivalTime}
                </h6>

                <p class="bg-yellow-500 rounded-md text-center p-2 mt-3">
                    Places disponibles : ${placeLibre}
                </p>

                <div class="flex justify-between items-center mt-4">

                    <span class="${complet
                        ? "bg-red-300 text-red-800"
                        : "bg-green-500 text-green-900"
                    } border rounded-md px-2 py-1 text-sm font-bold">

                        ${complet ? "Complet" : "Disponible"}

                    </span>

                    <a href="cabine.html?id=${trip.id}"
                       class="text-center border rounded-lg px-4 py-2 shadow-sm">

                        Réserver

                    </a>

                </div>
            </div>
        `;
    }).join("");
}