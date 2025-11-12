import clubInfoAndEvents from "../utils/club-info-and-events.js";

export default async function jazzClub() {
// == Konfiguration ==
const API_URL = "http://localhost:3000"; // JSON-server körs på port 3000

// == Skapa hela sidans struktur dynamiskt ==
document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  // Header
  const header = document.createElement("header");
  header.innerHTML = `
    <h1>🎸 80's Rock Club 🎸</h1>
    <nav>
      <a href="#events">Evenemang</a>
      <a href="#book">Boka</a>
    </nav>
  `;
  app.appendChild(header);

  // Beskrivning
  const desc = document.createElement("section");
  desc.id = "description";
  desc.innerHTML = `
    <h2>Om klubben</h2>
    <p>Välkommen till 80's Rock Club – där nostalgisk rock lever vidare! 
    Vi erbjuder liveframträdanden med allt från klassiska hits till coverband som får dig att känna dig som på 80-talet igen.</p>
    <img src="images/80s-band.jpg" alt="80-tals rockband på scen">
  `;
  app.appendChild(desc);

  // Evenemang
  const eventsSection = document.createElement("section");
  eventsSection.id = "events";
  eventsSection.innerHTML = `<h2>Kommande evenemang</h2><ul id="event-list"></ul>`;
  app.appendChild(eventsSection);

  // Bokningsformulär
  const bookingSection = document.createElement("section");
  bookingSection.id = "book";
  bookingSection.innerHTML = `
    <h2>Boka biljetter</h2>
    <form id="booking-form">
      <label for="name">Namn:</label>
      <input type="text" id="name" name="name" required>

      <label for="email">E-post:</label>
      <input type="email" id="email" name="email" required>

      <label for="event">Välj evenemang:</label>
      <select id="event" name="event" required></select>

      <button type="submit">Boka</button>
    </form>
    <p id="booking-confirmation"></p>
  `;
  app.appendChild(bookingSection);

  // Footer
  const footer = document.createElement("footer");
  footer.innerHTML = `<p>&copy; 2025 Gala Emporium - 80's Rock Club</p>`;
  app.appendChild(footer);

  // Hämta evenemang från JSON-server
  const events = await fetch(`${API_URL}/events`).then(res => res.json());

  const eventList = document.getElementById("event-list");
  const eventSelect = document.getElementById("event");

  events.forEach(event => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${event.name}</strong> - ${event.date}
      <p>${event.description}</p>
      ${event.image ? `<img src="${event.image}" alt="${event.name}" />` : ""}
    `;
    li.addEventListener("click", () => {
      eventSelect.value = event.id;
      document.getElementById("booking-form").scrollIntoView({ behavior: "smooth" });
    });
    eventList.appendChild(li);

    const option = document.createElement("option");
    option.value = event.id;
    option.textContent = `${event.name} (${event.date})`;
    eventSelect.appendChild(option);
  });

  // Hantera bokningar
  const bookingForm = document.getElementById("booking-form");
  const bookingConfirmation = document.getElementById("booking-confirmation");

  bookingForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const eventId = parseInt(eventSelect.value);
    const bookingNumber = Math.floor(Math.random() * 100000);

    // Skicka bokningen till JSON-servern
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, eventId, bookingNumber })
    });

    if (res.ok) {
      const bookedEvent = events.find(ev => ev.id === eventId);
      bookingConfirmation.textContent = `Tack ${name}! Du har bokat biljetter till "${bookedEvent.name}". Ditt bokningsnummer är ${bookingNumber}.`;
      bookingForm.reset();
    } else {
      bookingConfirmation.textContent = "Något gick fel vid bokningen. Försök igen!";
    }
  });
});


  return clubInfoAndEvents('a37c');
}