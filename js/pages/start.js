import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function start() {
  const { html: eventHtml, events } = await clubInfoAndEvents();
  return {
    html: `
      <h1>Alla kommande events på Gala</h1>
      <p>Gala är en samlingsplats för olika musikklubbar.</p>
      ${eventHtml}
    `,
    events // return events array for search
  };
}