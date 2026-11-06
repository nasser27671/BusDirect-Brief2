import { initialiser, sauvegarder } from "./store.js";
import { prixSiege } from "./reservations.js";

const trips = await initialiser();

const params = new URLSearchParams(window.location.search);
const tripId = params.get("id");

const trip = trips.find(function (item) {
    return String(item.id) === String(tripId);
});

if (!trip) {
    alert("Trajet introuvable.");
} else {

    if (!trip.reservations) {
        trip.reservations = [];
    }

    if (!trip.waitingList) {
        trip.waitingList = [];
    }

    const submitButton = document.getElementById("submit-button");
    const modifyButton = document.getElementById("modify-button");
    const deleteButton = document.getElementById("delete-button");
    const nameInput = document.getElementById("reservation-name");
    const phoneInput = document.getElementById("reservation-phone");
    const seatNumber = document.getElementById("seat-number");
    const modifySeat = document.getElementById("modify-seat");
    const deleteSeat = document.getElementById("delete-seat");
    const newName = document.getElementById("new-name");
    const newSeat = document.getElementById("new-seat");
    const nameError = document.getElementById("nameError");
    const addMessage = document.getElementById("addMessage");
    const modifyMessage = document.getElementById("modifyMessage");
    const deleteMessage = document.getElementById("deleteMessage");

    let reservations = trip.reservations;

    function displayReservations() {
        reservations = trip.reservations;

        sauvegarder(trips);

        const ticketsTotal = document.getElementById("tickets-total");

        let total = 0;

        for (let i = 0; i < reservations.length; i++) {
            total += prixSiege(trip, Number(reservations[i].seat));
        }

        ticketsTotal.textContent = total.toFixed(2) + " DH";

        for (let i = 1; i <= 20; i++) {
            const seat = document.getElementById("seat-" + i);

            if (seat) {
                seat.textContent = i;
                seat.style.backgroundColor = i <= 4 ? "#FACC15" : "#9CA3AF";
                seat.style.color = "#000000";
                seat.draggable = false;
            }
        }

        for (let i = 0; i < reservations.length; i++) {
            const seat = document.getElementById("seat-" + reservations[i].seat);

            if (seat) {
                seat.textContent = reservations[i].seat + " - " + reservations[i].name;
                seat.style.backgroundColor = "#DC2626";
                seat.style.color = "#FFFFFF";
                seat.draggable = true;
            }
        }

        modifySeat.innerHTML = '<option value="">Choisir une réservation</option>';
        deleteSeat.innerHTML = '<option value="">Choisir une réservation</option>';

        for (let i = 0; i < reservations.length; i++) {
            const option1 = document.createElement("option");

            option1.value = reservations[i].seat;
            option1.textContent = reservations[i].name + " - Siège " + reservations[i].seat;

            modifySeat.appendChild(option1);

            const option2 = document.createElement("option");

            option2.value = reservations[i].seat;
            option2.textContent = reservations[i].name + " - Siège " + reservations[i].seat;

            deleteSeat.appendChild(option2);
        }
    }

    submitButton.addEventListener("click", function () {
        const name = nameInput.value.trim();
        const phone = phoneInput ? phoneInput.value.trim().replace(/[\s.-]/g, "") : "";
        const seat = Number(seatNumber.value);

        nameError.textContent = "";
        addMessage.textContent = "";

        const phoneRegex = /^(0[567]\d{8}|\+212[567]\d{8}|00212[567]\d{8})$/;

        if (name === "") {
            nameError.textContent = "Veuillez saisir votre prénom.";
            return;
        }

        if (!phoneRegex.test(phone)) {
            nameError.textContent = "Veuillez saisir un numéro marocain valide.";
            return;
        }

        if (seat < 1 || seat > 20) {
            addMessage.textContent = "Veuillez choisir un siège valide.";
            return;
        }

        for (let i = 0; i < reservations.length; i++) {
            if (reservations[i].name.toLowerCase() === name.toLowerCase()) {
                nameError.textContent = "Ce prénom possède déjà une réservation.";
                return;
            }

            if (Number(reservations[i].seat) === seat) {
                addMessage.textContent = "Ce siège est déjà réservé.";
                return;
            }
        }

        reservations.push({
            name: name,
            phone: phone,
            seat: seat
        });

        trip.reservations = reservations;

        displayReservations();

        nameInput.value = "";

        if (phoneInput) {
            phoneInput.value = "";
        }

        addMessage.textContent = "Réservation ajoutée avec succès.";
    });

    modifyButton.addEventListener("click", function () {
        const seat = Number(modifySeat.value);
        const name = newName.value.trim();
        const seatChange = Number(newSeat.value);

        modifyMessage.textContent = "";

        if (!seat || name === "" || seatChange < 1 || seatChange > 20) {
            modifyMessage.textContent = "Veuillez remplir les informations.";
            return;
        }

        for (let i = 0; i < reservations.length; i++) {
            if (
                Number(reservations[i].seat) === seatChange &&
                Number(reservations[i].seat) !== seat
            ) {
                modifyMessage.textContent = "Ce siège est déjà réservé.";
                return;
            }
        }

        for (let i = 0; i < reservations.length; i++) {
            if (Number(reservations[i].seat) === seat) {
                reservations[i].name = name;
                reservations[i].seat = seatChange;
                break;
            }
        }

        trip.reservations = reservations;

        displayReservations();

        newName.value = "";

        modifyMessage.textContent = "Réservation modifiée avec succès.";
    });

    deleteButton.addEventListener("click", function () {
        const seat = Number(deleteSeat.value);

        deleteMessage.textContent = "";

        if (!seat) {
            deleteMessage.textContent = "Veuillez choisir une réservation.";
            return;
        }

        for (let i = 0; i < reservations.length; i++) {
            if (Number(reservations[i].seat) === seat) {
                reservations.splice(i, 1);
                break;
            }
        }

        trip.reservations = reservations;

        displayReservations();

        deleteMessage.textContent = "Réservation supprimée avec succès.";
    });

    for (let i = 1; i <= 20; i++) {
        const seat = document.getElementById("seat-" + i);

        if (seat) {
            seat.addEventListener("dragstart", function (event) {
                event.dataTransfer.setData("text", seat.id);
            });

            seat.addEventListener("dragover", function (event) {
                event.preventDefault();
            });

            seat.addEventListener("drop", function (event) {
                event.preventDefault();

                const draggedSeat = event.dataTransfer.getData("text");
                const oldSeatNumber = Number(draggedSeat.replace("seat-", ""));
                const newSeatNumber = Number(seat.id.replace("seat-", ""));

                let reservationIndex = -1;
                let seatReserved = false;

                for (let j = 0; j < reservations.length; j++) {
                    if (Number(reservations[j].seat) === oldSeatNumber) {
                        reservationIndex = j;
                    }

                    if (Number(reservations[j].seat) === newSeatNumber) {
                        seatReserved = true;
                    }
                }

                if (reservationIndex === -1 || seatReserved) {
                    return;
                }

                reservations[reservationIndex].seat = newSeatNumber;

                trip.reservations = reservations;

                displayReservations();
            });
        }
    }

    displayReservations();
}