const API_URL = 'http://localhost:3000';
const CLUB_ID = 'e80s';

export default async function eightyClub() {
  // Fetch club and events
  const [clubRes, eventsRes] = await Promise.all([
    fetch(`${API_URL}/clubs/${CLUB_ID}`),
    fetch(`${API_URL}/events?clubId=${CLUB_ID}`)
  ]);

  const club = clubRes.ok ? await clubRes.json() : { name: "Rock-klubben", description: '' };
  const events = eventsRes.ok ? await eventsRes.json() : [];

  // Build page HTML
  const html = `
    <h1>${club.name}</h1>
    <p class="club-intro">${club.description}</p>
    ${club.image ? `<img src="${club.image}" alt="${club.name}" class="club-image">` : ''}

    <section id="events">
      <h2>Kommande evenemang</h2>
      <ul id="event-list"></ul>
    </section>

    <section id="book">
      <h2>Boka biljetter</h2>
      <form id="booking-form">
        <label for="name">Namn:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">E-post:</label>
        <input type="email" id="email" name="email" required>
        <label for="event">Välj evenemang:</label>
        <select id="event" name="event" required>
          <option value="">-- Välj ett evenemang --</option>
        </select>
        <button type="submit">Boka</button>
      </form>
      <p id="booking-confirmation" aria-live="polite"></p>
    </section>
  `;

  // Wire up interactivity after DOM insertion
  const observer = new MutationObserver((mutations, obs) => {
    const eventList = document.getElementById('event-list');
    const eventSelect = document.getElementById('event');
    const bookingForm = document.getElementById('booking-form');
    const bookingConfirmation = document.getElementById('booking-confirmation');

    if (!eventList || !eventSelect || !bookingForm) return;

    // Populate event list and select
    events.forEach(ev => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${ev.name}</strong> — ${ev.date}
        <p>${ev.description}</p>
        ${ev.image ? `<img src="${ev.image}" alt="${ev.name}">` : ''}
      `;
      li.addEventListener('click', () => {
        eventSelect.value = ev.id;
        bookingForm.scrollIntoView({ behavior: 'smooth' });
      });
      eventList.appendChild(li);

      const option = document.createElement('option');
      option.value = ev.id;
      option.textContent = `${ev.name} — ${ev.date}`;
      eventSelect.appendChild(option);
    });

    // Handle booking submission
    bookingForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const eventId = parseInt(eventSelect.value);
      const bookingNumber = Math.floor(Math.random() * 100000);

      try {
        const res = await fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, eventId, bookingNumber })
        });

        if (res.ok) {
          const bookedEvent = events.find(ev => ev.id === eventId);
          bookingConfirmation.textContent = `Tack ${name}! Du har bokat "${bookedEvent.name}". Bokningsnummer: ${bookingNumber}`;
          bookingForm.reset();
        } else {
          bookingConfirmation.textContent = 'Något gick fel. Försök igen!';
        }
      } catch (err) {
        console.error('Booking error:', err);
        bookingConfirmation.textContent = 'Något gick fel. Försök igen!';
      }
    });

    obs.disconnect();
  });

  const mainEl = document.querySelector('main');
  if (mainEl) observer.observe(mainEl, { childList: true, subtree: true });

  return { html, events };
}
