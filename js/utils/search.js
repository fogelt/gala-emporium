export default function filterAndRenderEvents(events, searchTerm = '') {
  const term = searchTerm.toLowerCase().trim();

  const filtered = events.filter(ev =>
    ev.name.toLowerCase().includes(term) ||
    ev.date.toLowerCase().includes(term) ||
    (ev.description && ev.description.toLowerCase().includes(term)) ||
    (ev.club && ev.club.toLowerCase().includes(term))
  );

  return filtered
    .toSorted((a, b) => new Date(a.date) - new Date(b.date))
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
    .join('');
}

export function setupSearch(events) {
  const input = document.querySelector('#eventSearch');
  const container = document.querySelector('#eventsContainer');
  if (!input || !container) return;

  input.addEventListener('input', (e) => {
    container.innerHTML = filterAndRenderEvents(events, e.target.value);
  });
}