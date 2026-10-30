export function placeLibres(trip) {
   return trip.capacity - trip.reservations.length;
}
export function estComplet(trip){
    return placeLibres(trip) === 0 
}