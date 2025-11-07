import clubInfoAndEvents from "../utils/club-info-and-events.js";

// Make this page module follow the same SPA pattern as the other clubs.
// It returns the club info and events for the 80s club (id: e80s).
export default async function eightyClub() {
  return clubInfoAndEvents('e80s');
}
