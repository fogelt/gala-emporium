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
    <h2>Events</h2>
    <div id="eventsContainer">
      ${events
      .toSorted((a, b) => a.date > b.date ? 1 : -1)
      .map(ev => `
          <article class="event">
            <h3>${ev.name} ${ev.date}</h3>
            <p>${ev.description}</p>
          </article>
        `)
      .join('')}
    </div>
  `;

  return { html, events };
}
