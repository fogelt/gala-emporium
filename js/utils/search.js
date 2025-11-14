
export function filterAndRenderEvents(events, searchTerm = '') {
  const term = searchTerm.toLowerCase().trim();

   // Filtrerar fram event där sökordet matchar namn, datum, beskrivning eller klubb
  const filtered = events.filter(ev =>
    ev.name.toLowerCase().includes(term) || //filtrerar bort events som matchar sökordet
    ev.date.toLowerCase().includes(term) || //filtrerar bort events som matchar sökordet
    (ev.description && ev.description.toLowerCase().includes(term)) ||
    (ev.club && ev.club.toLowerCase().includes(term))
  );
  //Sorterar och gör HTML av eventen
  return filtered 
  // tosorted sorterar efter datum från tidigast till senast
    .toSorted((a, b) => new Date(a.date) - new Date(b.date)) 
     // Omvandlar varje event till ett HTML
    .map(({ id, name, description, date, club, image }) => `
      <article class="event-card" data-event='${encodeURIComponent(JSON.stringify({ id, name, description, date, club, image }))}'>
        ${image ? `<img src="${image}" alt="${name}">` : ''}
        <div class="event-card-content">
          <h3>${name}</h3>
          <p>${description || ''}</p>
          <div class="event-meta">
            <span class="event-date">${date}</span>
            ${club ? `<span class="event-club">${club}</span>` : ''}
          </div>
        </div>
      </article>
    `)
    // Slår ihop alla HTML strängar till en enda stor sträng
    .join('');
}
// Den kopplar ihop sökrutan med filtreringsfunktionen 
 //så att eventen uppdateras direkt när man skriver 
export function setupSearch(events) { // skapar en lyssnare på sökfältet
  // Hämta sökfältet och containern där event ska visas
  const input = document.querySelector('#eventSearch');
  const container = document.querySelector('#eventsContainer');
  if (!input || !container) return;

  input.addEventListener('input', (e) => {
    container.innerHTML = filterAndRenderEvents(events, e.target.value);
  });
}