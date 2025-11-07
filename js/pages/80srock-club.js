// Evenemangsdata
const events = [
  { id: 1, name: "80's Classic Night", date: "2025-11-20", description: "Spela klassiska 80-tals hits med liveband!" },
  { id: 2, name: "Rock Covers", date: "2025-12-05", description: "Lokala band spelar dina favoritlåtar från 80-talet." },
  { id: 3, name: "Glam Rock Party", date: "2025-12-18", description: "Färgglad glam rock och dans hela natten!" }
];

// Elementreferenser
const eventList = document.getElementById("event-list");
const eventSelect = document.getElementById("event");
const bookingForm = document.getElementById("booking-form");
const bookingConfirmation = document.getElementById("booking-confirmation");

// Rendera evenemang på sidan och i bokningsformuläret
events.forEach(event => {
  // Lista
  const li = document.createElement("li");
  li.innerHTML = `<strong>${event.name}</strong> - ${event.date}<p>${event.description}</p>`;
  li.style.cursor = "pointer"; // visa att man kan klicka
  eventList.appendChild(li);

  // Klickbar funktion: fyll bokningsformulär med detta evenemang
  li.addEventListener("click", () => {
    eventSelect.value = event.id;
    bookingForm.scrollIntoView({ behavior: "smooth" });
  });

  // Lägg till i bokningsformuläret
  const option = document.createElement("option");
  option.value = event.id;
  option.textContent = `${event.name} (${event.date})`;
  eventSelect.appendChild(option);
});

// Hantera bokning
bookingForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const selectedEvent = events.find(ev => ev.id == eventSelect.value);
  const bookingNumber = Math.floor(Math.random() * 100000);
  bookingConfirmation.textContent = `Tack ${name}! Du har bokat biljetter till "${selectedEvent.name}". Ditt bokningsnummer: ${bookingNumber}`;
  bookingForm.reset();
});
