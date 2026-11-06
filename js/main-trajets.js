import { renderTrajets } from "./render.js";
import { initialiser } from "./store.js";

const trips = await initialiser();

const tripsPerPage = 5;
let currentPage = 1;
let filteredTrips = trips;

const searchInput = document.getElementById("trajetSearch");
const filtre = document.getElementById("filterTrajet");

function afficher() {
    const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }

    const start = (currentPage - 1) * tripsPerPage;
    const end = start + tripsPerPage;

    const tripsToDisplay = filteredTrips.slice(start, end);

    renderTrajets(tripsToDisplay);

    afficherPagination(totalPages);
}

function afficherPagination(totalPages) {
    const pagination = document.getElementById("pagination");

    if (!pagination) {
        return;
    }

    let buttons = "";

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    if (currentPage > 1) {
        buttons += `
            <button id="previous" class="border rounded px-3 py-2 bg-white">
                Précédent
            </button>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        buttons += `
            <button data-page="${i}"
                class="${currentPage === i ? "bg-blue-950 text-white" : "bg-white"} border rounded px-3 py-2">
                ${i}
            </button>
        `;
    }

    if (currentPage < totalPages) {
        buttons += `
            <button id="next" class="border rounded px-3 py-2 bg-white">
                Suivant
            </button>
        `;
    }

    pagination.innerHTML = buttons;

    const pageButtons = pagination.querySelectorAll("[data-page]");

    pageButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            currentPage = Number(button.dataset.page);
            afficher();
        });
    });

    const previous = document.getElementById("previous");

    if (previous) {
        previous.addEventListener("click", function () {
            currentPage--;
            afficher();
        });
    }

    const next = document.getElementById("next");

    if (next) {
        next.addEventListener("click", function () {
            currentPage++;
            afficher();
        });
    }
}

function filtrerTrajets() {
    const city = searchInput.value.toLowerCase().trim();
    const status = filtre.value;

    filteredTrips = trips.filter(function (trip) {
        const cityMatch =
            trip.departure.toLowerCase().includes(city) ||
            trip.destination.toLowerCase().includes(city);

        const statusMatch =
            status === "tous" ||
            (status === "disponible" && trip.reservations.length < trip.capacity) ||
            (status === "complet" && trip.reservations.length >= trip.capacity);

        return cityMatch && statusMatch;
    });

    currentPage = 1;
    afficher();
}

searchInput.addEventListener("input", filtrerTrajets);
filtre.addEventListener("change", filtrerTrajets);

afficher();