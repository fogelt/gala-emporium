export function showEventDetails(event) {
  const modal = document.createElement('div');
  modal.className = 'event-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" aria-label="Close">&times;</button>
      ${event.image ? `<img src="${event.image}" alt="${event.name}" class="event-image-large">` : ''}
      <div class="event-details">
        <h2>${event.name}</h2>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <button>Boka</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());

  // Close when clicking outside content
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove();
  });
}

export function setupEventCardClicks() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  container.addEventListener('click', e => {
    const card = e.target.closest('.event-card');
    if (!card) return;

    const eventData = JSON.parse(decodeURIComponent(card.dataset.event));
    showEventDetails(eventData);
  });
}
