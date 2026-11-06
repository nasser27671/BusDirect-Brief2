export function placeLibres(trip) {
    return trip.capacity - trip.reservations.length;
}

export function price(trip) {
    return trip.price;
}

export function departureTime(trip) {
    return trip.departureTime;
}

export function arrivTime(trip) {
    return trip.arrivalTime;
}

export function estComplet(trip) {
    return placeLibres(trip) === 0;
}

export function prixSiege(trip, seat) {
    if (seat <= 4) {
        return trip.price * 1.10;
    }

    return trip.price;
}