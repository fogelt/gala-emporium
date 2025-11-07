import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import metalClub from './pages/metal-club.js';
import punkClub from './pages/punk-club.js';
import eventPage from './pages/event.js';

// Our menu: label to display in menu and 
// function to run on menu choice
const menu = {
  "start": { label: 'Start', function: start },
  "jazz-klubben": { label: 'Jazz-klubben', function: jazzClub },
  "metal-klubben": { label: 'Metal-klubben', function: metalClub },
  "punk-klubben": { label: 'Punk-klubben', function: punkClub }
};

function createMenu() {
  // Object.entries -> convert object to array
  // then map to create a-tags (links)
  // then join everything into one big string
  return Object.entries(menu)
    .map(([urlHash, { label }]) => `
      <a href="#${urlHash}">${label}</a>
    `)
    .join('');
}

async function loadPageContent() {
  // if no hash redirect to #start
  if (location.hash === '') { location.replace('#start'); }
  // add a class on body so that we can style differnt pages differently
  document.body.setAttribute('class', location.hash.slice(1));
  // choose page renderer depending on hash
  let functionToRun;
  if (location.hash.startsWith('#event')) {
    functionToRun = eventPage;
  } else {
    functionToRun = menu[location.hash.slice(1)] && menu[location.hash.slice(1)].function;
  }
  // run the function and expect it return a html string
  const html = functionToRun ? await functionToRun() : '<p>Innehåll saknas</p>';
  // replace the contents of the main element
  document.querySelector('main').innerHTML = html;
  // attach handlers for event cards (start page) and links
  attachEventCardListeners();
  // if we just rendered an event page, wire up the booking form handlers
  if (functionToRun === eventPage) initEventPageHandlers();
}

// call loadPageContent once on page load
loadPageContent();

// and then on every hash change of the url/location
window.onhashchange = loadPageContent;

// create the menu and display it
document.querySelector('header nav').innerHTML = createMenu();

function attachEventCardListeners() {
  // Start-page cards with embedded data-event
  document.querySelectorAll('.event-card').forEach(card => {
    const payload = card.getAttribute('data-event');
    if (!payload) return;
    try {
      const eventObj = JSON.parse(decodeURIComponent(payload));
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        sessionStorage.setItem('selectedEvent', JSON.stringify(eventObj));
        location.hash = '#event';
      });
    } catch (err) {
      console.error('invalid event payload', err);
    }
  });

  // Club page links that include data-event-id
  document.querySelectorAll('.event-link').forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-event-id');
      if (!id) return;
      try {
        const res = await fetch('http://localhost:3000/events/' + id);
        if (!res.ok) throw new Error('fetch failed');
        const eventObj = await res.json();
        sessionStorage.setItem('selectedEvent', JSON.stringify(eventObj));
        location.hash = '#event';
      } catch (err) {
        console.error('Failed to load event', err);
        alert('Kunde inte ladda evenemanget.');
      }
    });
  });
}

function initEventPageHandlers() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  const confirmEl = document.getElementById('booking-confirm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // simple validation
    const name = form.querySelector('[name="name"]');
    const phone = form.querySelector('[name="phone"]');
    const time = form.querySelector('[name="time"]');
    let ok = true;
    [name, phone, time].forEach(el => el.classList.remove('error'));
    if (!name.value.trim()) { name.classList.add('error'); ok = false; }
    if (!phone.value.trim()) { phone.classList.add('error'); ok = false; }
    if (!time.value.trim()) { time.classList.add('error'); ok = false; }
    if (!ok) return;

    // Build booking object
    const eventData = JSON.parse(sessionStorage.getItem('selectedEvent') || '{}');
    const booking = {
      eventId: eventData.id || null,
      eventName: eventData.name || '',
      name: name.value.trim(),
      phone: phone.value.trim(),
      time: time.value,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage as a simple mock backend
    try {
      const existing = JSON.parse(localStorage.getItem('bookings') || '[]');
      existing.push(booking);
      localStorage.setItem('bookings', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save booking', err);
    }

    // Show confirmation
    if (confirmEl) {
      confirmEl.style.display = 'block';
      confirmEl.textContent = `Tack! Bokning mottagen för ${booking.eventName} kl. ${booking.time}. Vi kontaktar dig på ${booking.phone}.`;
    }
    form.reset();
  });
}