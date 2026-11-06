export async function initialiser() {
    const data = localStorage.getItem("trips");

    if (data !== null) {
        return JSON.parse(data);
    } else {
        try {
            const res = await fetch("./data/trips.json");
            const trips = await res.json();

            sauvegarder(trips);

            return trips;
        } catch (err) {
            console.log("Error: " + err);
            return [];
        }
    }
}

export function sauvegarder(trips) {
    localStorage.setItem("trips", JSON.stringify(trips));
}