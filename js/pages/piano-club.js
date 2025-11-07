import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function pianoClub() {
  const info = await clubInfoAndEvents('k92m');

  const pianohtml = `
  <h1>HEJ</h1>`;

  return {
    pianohtml
  };
}