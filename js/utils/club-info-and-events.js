export default async function clubInfoAndEvents(clubId) {
  // Exempel på evenemang för startsidan
  const demoEvents = [
    {
      id: 'nebula',
      name: "Nebula Nights",
      date: "21 november 2025",
      club: "Electro Nebula",
      description: "En kväll med elektronisk musik och visuella upplevelser",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
    },
    {
      id: 'midnight-jazz',
      name: "Midnight Jazz Jam",
      date: "28 november 2025",
      club: "Jazz Atelier",
      description: "Improviserad jazz med stadens bästa musiker",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80"
    },
    {
      id: 'comedy-carousel',
      name: "Comedy Carousel",
      date: "5 december 2025",
      club: "Laugh Lounge",
      description: "En kväll fylld med skratt och underhållning",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80"
    }
  ];

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
  } else {
    // Om vi är på startsidan, visa demo-evenemangen
    events = demoEvents;
  }
  
  if (clubId) {
    // Layout för klubbsidor med sökfält
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
          <article class="event-card" data-event='${encodeURIComponent(JSON.stringify({id, date, name, description, club, image}))}'>
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