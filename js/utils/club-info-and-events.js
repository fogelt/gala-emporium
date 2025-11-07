export default async function clubInfoAndEvents(clubId) {

  let events = [];
  let name = '';
  let description = '';

  if (clubId) {
    // Om vi är på en klubbsida, hämta klubbens events från API
    const clubUrl = 'http://localhost:3000/clubs/' + clubId;
    const eventsUrl = 'http://localhost:3000/events?clubId=' + clubId;
    try {
      const clubRes = await fetch(clubUrl);
      if (!clubRes.ok) throw new Error('Club fetch failed: ' + clubRes.status);
      const clubData = await clubRes.json();
      name = clubData.name || '';
      description = clubData.description || '';

      const eventsRes = await fetch(eventsUrl);
      if (!eventsRes.ok) throw new Error('Events fetch failed: ' + eventsRes.status);
      events = await eventsRes.json() || [];
    } catch (err) {
      // If fetching fails (API down, CORS, etc.) ensure we do NOT fall back to demo events
      console.error('Failed to fetch club data or events', err);
      events = [];
      name = name || '';
      description = description || 'Kunde inte ladda klubbdata just nu.';
    }
  }

  if (clubId) {
    const html = `
      <h1>${name}</h1>
      <p>${description}</p>
      <input type="text" id="eventSearch" placeholder="Sök efter event..." class="search-bar">
      <h2>Events</h2>
      <div id="eventsContainer">
        ${events && events.length > 0 ? [...events]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(({ id, date, name, description }) => `
            <article class="event">
              <a href="#" data-event-id="${id}" class="event-link">
                <h3>${name} ${date}</h3>
                <p>${description}</p>
              </a>
            </article>
          `)
        .join('') : `<p class="no-events">Inga kommande evenemang för den här klubben.</p>`}
      </div>
    `;
    return { html, events };
  } else {
    // Layout för startsidan med de tre exemplen
    const html = `
      <section class="events-section">
        ${events.map(({ id, date, name, description, club, image }) => `
          <article class="event-card" data-event='${encodeURIComponent(JSON.stringify({ id, date, name, description, club, image }))}'>
            <img src="${image}" alt="${name}">
            <div class="event-card-content">
              <h3>${name}</h3>
              <p>${description}</p>
              <div class="event-meta">
                <span class="event-date">${date}</span>
                <span class="event-club">${club}</span>
              </div>
            </div>
          </article>
        `).join('')}
      </section>
    `;
    return { html, events: [] };
  }
}