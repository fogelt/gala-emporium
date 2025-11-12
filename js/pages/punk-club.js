import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function punkClub() {
  const extraHTML = `
    <section class="club-extra punk-theme">
      
    
    </section>
  `;
  return clubInfoAndEvents('f78d', extraHTML);
}