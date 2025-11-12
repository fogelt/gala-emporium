import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import metalClub from './pages/metal-club.js';
import punkClub from './pages/punk-club.js';
import eightyClub from './pages/80srock-club.js';
import pianoClub from './pages/piano-club.js';
import { showEventDetails, setupEventCardClicks } from './utils/event-info.js';
import { setupSearch, filterAndRenderEvents } from './utils/search.js';
import { updateMembershipDisplay, eraseMemberButton, appendMemberButton } from './utils/membership.js'; // importera alla funktioner vi behöver komma åt i main.js

const menu = {
  "start": { label: 'Start', function: start },
  "jazz-klubben": { label: 'Jazz-klubben', function: jazzClub },
  "metal-klubben": { label: 'Metal-klubben', function: metalClub },
  "80s-rock-klubben": { label: 'Rock-klubben', function: eightyClub },
  "punk-klubben": { label: 'Punk-klubben', function: punkClub },
  "piano-klubben": { label: 'Piano-klubben', function: pianoClub }
};

function createMenu() { //här skapar vi menyn och sätter namn och url
  return Object.entries(menu)
    .map(([urlHash, { label }]) => `
      <a href="#${urlHash}">${label}</a>
    `)
    .join('');
}

async function loadPageContent() {
  if (location.hash === '') { location.replace('#start'); }
 //laddar inehåll baserat på hash
  let club = location.hash.slice(1); //ta bort # club är nu t.ex. "start" istället för "#start"
  document.body.setAttribute('class', club); // sätt body class för css

  const functionToRun = menu[club].function; // hämta rätt funktion från menyn
  const { html, events } = await functionToRun(); //vänta på att funktionen ska köra klart
  document.querySelector('main').innerHTML = html;

  updateMembershipDisplay(club);

  eraseMemberButton(); // vi tar alltid bort knappen först (membership.js)
  if (events?.length) {
    setupSearch(events);
  }
  if (club !== 'start') {
    appendMemberButton(club); //vi lägger till knappen om vi inte är på startsidan
  }
  setupEventCardClicks();
}

loadPageContent(); //ladda in första sidan
window.onhashchange = loadPageContent; //ladda in ny sida när hash ändras
document.querySelector('header nav').innerHTML = createMenu();