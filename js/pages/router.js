import clubInfoAndEvents from "../utils/club-info-and-events.js";

export async function loadClub(clubId) {
  return await clubInfoAndEvents(clubId);
}