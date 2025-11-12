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
        <button class="book-btn">Boka biljett</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('.book-btn').addEventListener('click', e => renderBookingMenu(event, modal));

  // Close when clicking outside content
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove();
  });
}

export function setupEventCardClicks() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  container.addEventListener('click', e => {
    const card = e.target.closest('#event-card-finished');
    if (!card) return;

    const eventData = JSON.parse(decodeURIComponent(card.dataset.event));
    showEventDetails(eventData);
  });
}

function renderBookingMenu(event, modal) {
  let ticketAmount = 1;
  const price = event.price ?? 0;

  const updateModal = () => {
    modal.querySelector('.modal-content').innerHTML = `
      <button class="close-btn" aria-label="Close">&times;</button>
      ${event.image ? `<img src="${event.image}" alt="${event.name}" class="event-image-large">` : ''}
      <div class="event-details">
        <h2>${event.name}</h2>
        <p>Biljett pris: ${price} x ${ticketAmount}</p>
        <p>Total pris: ${price * ticketAmount}</p>
        <div class="ticket-controls">
          <button class="decrease-btn" ${ticketAmount === 1 ? 'disabled' : ''}>-</button>
          <button class="increase-btn">+</button>
        </div>
        <button class="book-btn">Fortsätt till betalning</button>
      </div>
    `;

    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.increase-btn').addEventListener('click', () => { ticketAmount++; updateModal(); });
    modal.querySelector('.decrease-btn').addEventListener('click', () => { ticketAmount = Math.max(1, ticketAmount - 1); updateModal(); });
    modal.querySelector('.book-btn').addEventListener('click', async () => {
      try {
        const res = await fetch('http://localhost:3001/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: event.id,
            eventName: event.name,
            price: price,
            quantity: ticketAmount
          })
        });
        const data = await res.json();
        window.location.href = data.url; // redirect to Stripe checkout
      } catch (err) {
        console.error('Stripe checkout error', err);
      }
    });
  };

  updateModal();
};
