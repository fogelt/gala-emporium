export function setupAdminClicks() {
  document.addEventListener('click', (event) => {
    if (event.target.closest('#add-event-card')) {
      createNewEvent();
    }

    if (event.target.closest('#add-club-nav-btn')) {
      createNewClub();
    }
  });
}

function createNewEvent() {
  const modal = document.createElement('div');
  modal.className = 'event-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" aria-label="Close">&times;</button>
      <h2>Skapa nytt event</h2>
      <form class="modal-form" id="new-event-form">
        <label>
          Eventnamn:
          <input type="text" name="name" placeholder="Ex: Pianofeber" required>
        </label>
        <label>
          Beskrivning:
          <textarea name="description" placeholder="Kort beskrivning av eventet" required></textarea>
        </label>
        <label>
          Datum (YYYY-MM-DD HH:mm):
          <input type="datetime-local" name="date" placeholder="2025-12-21T19:00" required>
        </label>
        <label>
          Bild URL:
          <input type="text" name="image" placeholder="Ex: https://example.com/bild.jpg">
        </label>
        <label>
          Pris:
          <input type="text" name="price" placeholder="Ex: 250" required>
        </label>
        <label>
          Klubb ID:
          <input type="text" name="clubId" placeholder="Ex: k92m" required>
        </label>
        <button type="submit">Spara event</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal); //Lägg till modal i bodyn

  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove()); //Ta bort modal om vi klickar på kryss

  modal.querySelector('#new-event-form').addEventListener('submit', async (input) => {
    input.preventDefault(); //Prevent default för att inte ladda om sidan

    const formData = new FormData(input.target); //Här gör vi om det vi får i inputs till ett objekt
    const newEvent = {
      name: formData.get('name'),
      description: formData.get('description'), //här hämtar vi properties från objektet för att kunna skicka det i JSON format
      date: formData.get('date'),
      image: formData.get('image'),
      alt: formData.get('name'),
      title: formData.get('name'),
      clubId: formData.get('clubId'),
      price: parseFloat(formData.get('price'))
    };

    const res = await fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent), //När alla fält är ifyllda skickar vi det till databasen
    });

    modal.remove(); //Ta bort modal när vi är klara
  });
}

function createNewClub() { //Vi gör klubbar på samma sätt
  const modal = document.createElement('div');
  modal.className = 'event-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-btn" aria-label="Close">&times;</button>
      <h2>Skapa ny klubb</h2>
      <form class="modal-form" id="new-club-form">
        <label>
          Klubbnamn:
          <input type="text" name="name" placeholder="Ex: Jazz-klubben" required>
        </label>
        <label>
          Beskrivning:
          <textarea name="description" placeholder="Kort beskrivning av klubben" required></textarea>
        </label>
        <label>
          Klubb ID:
          <input type="text" name="clubId" placeholder="Ex: a78n" required>
        </label>
        <button type="submit">Spara klubb</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());

  modal.querySelector('#new-club-form').addEventListener('submit', async (e) => {
    e.preventDefault(); //Prevent default för att inte ladda om sidan

    const formData = new FormData(e.target); //Gör om inputs till ett objekt
    const newClub = {
      name: formData.get('name'),
      description: formData.get('description'), //Ta objektets properties
      clubId: formData.get('clubId')
    };

    const res = await fetch('http://localhost:3000/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClub) //Skicka till servern
    });

    modal.remove(); //Ta bort fönstret när vi är klara

  });
}

