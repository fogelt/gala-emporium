import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function punkClub() {
  const extraHTML = `
    <section class="club-extra punk-theme">
      <h2>Här kan man skriva html</h2>
      <p>och lägga till vad som helst</p>
    </section>
  `;
  return clubInfoAndEvents('f78d', extraHTML);
}