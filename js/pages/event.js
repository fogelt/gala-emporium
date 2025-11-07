export default async function eventPage() {
  // Try to get selected event from sessionStorage (set when clicking an event-card on start page)
  let selected = null;
  try {
    const raw = sessionStorage.getItem('selectedEvent');
    if (raw) selected = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse selectedEvent', err);
  }

  // If not in sessionStorage, try to parse id from hash and fetch from API
  if (!selected) {
    const hash = location.hash || '';
    const match = hash.match(/^#event-(.+)$/);
    if (match) {
      const id = match[1];
      try {
        const res = await fetch('http://localhost:3000/events/' + id);
        if (res.ok) selected = await res.json();
      } catch (err) {
        console.error('Failed to fetch event by id', err);
      }
    }
  }

  if (!selected) {
    return { html: `<section class="event-details"><p class="no-events">Kunde inte hitta evenemanget.</p></section>`, events: [] };
  }

  // Build HTML for event details + booking form
  const { id, name, date, description, club, image } = selected;
  const html = `
    <section class="event-details">
      <div class="event-hero">
        <img src="${image || ''}" alt="${name}" class="event-hero-img">
      </div>
      <div class="event-layout">
        <div class="event-info">
          <h2>${name}</h2>
          <div class="club-name">${club || ''}</div>
          <div class="event-meta"><span>${date}</span></div>
          <p>${description || ''}</p>
        </div>

        <aside>
          <form class="booking-form" id="booking-form">
            <h3>Boka nu</h3>
            <div class="form-grid">
              <div>
                <label for="bk-name">Namn</label>
                <input id="bk-name" name="name" type="text" required>
              </div>
              <div>
                <label for="bk-phone">Telefonnummer</label>
                <input id="bk-phone" name="phone" type="tel" required>
              </div>
              <div class="full">
                <label for="bk-time">Välj tid</label>
                <select id="bk-time" name="time" required>
                  <option value="">Välj tid</option>
                  <option>19:00</option>
                  <option>21:00</option>
                  <option>23:00</option>
                </select>
              </div>
            </div>
            <div class="actions">
              <button type="submit">Skicka bokning</button>
            </div>
            <div id="booking-confirm" class="confirmation-message" style="display:none"></div>
          </form>
        </aside>
      </div>
    </section>
  `;
  
  return { html, events: [] };
}
