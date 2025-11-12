export default async function clubInfoAndEvents(clubId, extraHTML = '') {
  let name = '', description = '';
  let url = 'http://localhost:3000/events'; // bas-url för att hämta events

  if (clubId) {
    const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
    name = clubData.name;
    description = clubData.description;
    url += '?clubId=' + clubId;
  }

  const events = await (await fetch(url)).json();

  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')); //Här kollar vi om någon är inloggad i(som vi sparat i sessionstorage)
  const isAdmin = loggedInUser && loggedInUser.role === 'admin';

  const html = `
    ${extraHTML}
    ${clubId ? `<h1>${name}</h1><p>${description}</p>` : ''}
    <input type="text" id="eventSearch" placeholder="Sök efter event..." class="search-bar">
    <div id="eventsContainer" class="events-section">
      ${events.map(({ id, date, name, description, club, image, alt, price }) => `
        <article class="event-card" id="event-card-finished" data-event="${encodeURIComponent(JSON.stringify({ id, date, name, description, club, image, alt, price }))}">
          ${image ? `<img src="${image}" alt="${alt || name}" title="${alt || name}">` : ''}
          <div class="event-card-content">
            <h3>${name}</h3>
            <p>${description}</p>
            <div class="event-meta">
              <span class="event-date">${date}</span>
              ${club ? `<span class="event-club">${club}</span>` : ''}
            </div>
          </div>
        </article>
      `).join('')}

      ${isAdmin ? `
        <article class="event-card add-event-card" id="add-event-card">
          <div class="event-card-content">
            <h3>+ Lägg till nytt event</h3>
          </div>
        </article>
      ` : ''}
    </div>
  `;

  return { html, events };
}
