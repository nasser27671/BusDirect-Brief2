const submitButton = document.getElementById("submit-button");
const modifyButton = document.getElementById("modify-button");
const deleteButton = document.getElementById("delete-button");
const nameInput = document.getElementById("reservation-name");
const seatNumber = document.getElementById("seat-number");
const modifySeat = document.getElementById("modify-seat");
const deleteSeat = document.getElementById("delete-seat");
const newName = document.getElementById("new-name");
const newSeat = document.getElementById("new-seat");
const nameError = document.getElementById("nameError");
const addMessage = document.getElementById("addMessage");
const modifyMessage = document.getElementById("modifyMessage");
const deleteMessage = document.getElementById("deleteMessage");

let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

function displayReservations() {
  localStorage.setItem("reservtions", JSON.stringify(reservations));
  const ticketsTotal = document.getElementById("tickets-total");
  ticketsTotal.textContent = reservations.length * 80;

  for (let i = 0; i <= 20; i++) {
    const seat = document.getElementById("seat-" + i);

    if (seat) {
      seat.textContent = i;
      seat.style.backgroundColor = "#C0AD07";
    }
  }

  for (let i = 0; i < reservations.length; i++) {
    const seat = document.getElementById("seat-" + reservations[i].seat);

    if (seat !== null) {
      seat.textContent = reservations[i].seat + " - " + reservations[i].name;
      seat.style.backgroundColor = "#c60000";
    }
  }

  modifySeat.innerHTML = '<option value="">Choisir votre prénom</option>';
  deleteSeat.innerHTML = '<option value="">Choisir une réservation</option>';

  for (let i = 0; i < reservations.length; i++) {
    const option1 = document.createElement("option");

    option1.value = reservations[i].seat;
    option1.textContent =
      reservations[i].name + " - Siège " + reservations[i]._;

    modifySeat.appendChild(option1);

    const option2 = document.createElement("option");

    option2.value = reservations[i].seat;
    option2.textContent =
      reservations[i].name + " - Siège " + reservations[i].seat;

    deleteSeat.appendChild(option2);
  }

  localStorage.setItem("reservations", JSON.stringify(reservations));
}

submitButton.addEventListener("click", function () {
  const name = nameInput.value.trim();
  const seat = seatNumber.value;

  nameError.textContent = "";
  addMessage.textContent = "";

  if (name === "") {
    nameError.textContent = "Veuillez saisir votre prénom.";
    return;
  }

  reservations.forEach((reservation) => {
    if (reservation.name.toLowerCase() === name.toLowerCase()) {
      nameError.textContent = "Vous avez deja une reservation avec ce prenom";
      return;
    }
  });

  let seatReserved = false;

  for (let i = 0; i < reservations.length; i++) {
    if (Number(reservations[i].seat) === Number(seat)) {
      seatReserved = true;
      break;
    }
  }

  if (seatReserved) {
    addMessage.textContent = "Ce siège est déjà réservé.";
    return;
  }

  reservations.push({ name: name, seat: Number(seat) });

  displayReservations();

  nameInput.value = "";

  addMessage.textContent = "Réservation ajoutée avec succès.";
});

modifyButton.addEventListener("click", function () {
  const seat = modifySeat.value;
  const name = newName.value.trim();
  const seatChange = newSeat.value;

  modifyMessage.textContent = "";

  if (seat === "") {
    modifyMessage.textContent = "Veuillez choisir une réservation.";
    return;
  }

  if (name === "") {
    modifyMessage.textContent = "Veuillez saisir le nouveau prénom.";
    return;
  }

  let seatReserved = false;

  for (let i = 0; i < reservations.length; i++) {
    if (
      Number(reservations[i].seat) === Number(seatChange) &&
      Number(reservations[i].seat) !== Number(seat)
    ) {
      seatReserved = true;
      break;
    }
  }

  if (seatReserved) {
    modifyMessage.textContent = "Ce siège est déjà réservé.";
    return;
  }

  for (let i = 0; i < reservations.length; i++) {
    if (Number(reservations[i].seat) === Number(seat)) {
      reservations[i].name = name;
      reservations[i].seat = Number(seatChange);
      break;
    }
  }

  displayReservations();

  newName.value = "";
  modifySeat.value = seatChange;

  modifyMessage.textContent = "Réservation modifiée avec succès.";
});

deleteButton.addEventListener("click", function () {
  const seat = deleteSeat.value;

  deleteMessage.textContent = "";

  if (seat === "") {
    deleteMessage.textContent = "Veuillez choisir une réservation.";
    return;
  }

  for (let i = 0; i < reservations.length; i++) {
    if (Number(reservations[i].seat) === Number(seat)) {
      reservations.splice(i, 1);
      break;
    }
  }

  displayReservations();

  deleteMessage.textContent = "Réservation supprimée avec succès.";
});

displayReservations();

for (let i = 1; i <= 20; i++) {
  const seat = document.getElementById("seat-" + i);

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

    if (reservationIndex === -1) {
      return;
    }

    if (seatReserved) {
      alert("Ce siège est déjà réservé !");
      return;
    }

    reservations[reservationIndex].seat = newSeatNumber;

    displayReservations();
  });
}
