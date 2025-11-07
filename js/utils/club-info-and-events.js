export default async function clubInfoAndEvents(clubId) {
  let name = '', description = '';
  let url = 'http://localhost:3000/events';

  if (clubId) {
    const clubData = await (await fetch('http://localhost:3000/clubs/' + clubId)).json();
    name = clubData.name;
    description = clubData.description;
    url += '?clubId=' + clubId;
  }

  const events = await (await fetch(url)).json();

  const html = `
    ${clubId ? `<h1>${name}</h1><p>${description}</p>` : ''}
    <input type="text" id="eventSearch" placeholder="Sök efter event..." class="search-bar">
    <div id="eventsContainer" class="events-section">
      ${events.map(({ id, date, name, description, club, image }) => `
        <article class="event-card" data-event='${encodeURIComponent(JSON.stringify({ id, date, name, description, club, image }))}'>
          ${image ? `<img src="${image}" alt="${name}">` : ''}
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
    </div>
  `;

  return { html, events };
}
