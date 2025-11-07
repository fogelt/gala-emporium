export default function filterAndRenderEvents(events, searchTerm = '') {
  const term = searchTerm.toLowerCase();

  const filtered = events.filter(ev =>
    ev.name.toLowerCase().includes(term) ||
    ev.date.toLowerCase().includes(term)
  );

  return filtered
    .toSorted((a, b) => a.date > b.date ? 1 : -1)
    .map(({ name, description, date }) => `
      <article class="event">
        <h3>${name} ${date}</h3>
        <p>${description}</p>
      </article>
    `)
    .join('');
}

export function createSearch() {
  return `
    <input
      type="text"
      id="eventSearch"
      placeholder="Sök efter event..."
      class="search-bar"
    >
  `;
}
