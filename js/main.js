import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import metalClub from './pages/metal-club.js';
import punkClub from './pages/punk-club.js';
import eightyClub from './pages/80srock-club.js';
import pianoClub from './pages/piano-club.js';
import { setupAdminClicks } from './utils/admin-functions.js';
import { appendLoginButton } from './utils/admin-login.js';
import { showEventDetails, setupEventCardClicks } from './utils/event-info.js';
import { setupSearch, filterAndRenderEvents } from './utils/search.js';
import { updateMembershipDisplay, eraseMemberButton, appendMemberButton } from './utils/membership.js';

let menu = {
  "start": { label: 'Start', function: start },
  "jazz-klubben": { label: 'Jazz-klubben', function: jazzClub },
  "metal-klubben": { label: 'Metal-klubben', function: metalClub },
  "80s-rock-klubben": { label: 'Rock-klubben', function: eightyClub },
  "punk-klubben": { label: 'Punk-klubben', function: punkClub },
  "piano-klubben": { label: 'Piano-klubben', function: pianoClub }
};

function createMenu() {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')); // Kolla om admin är inloggad
  const isAdmin = loggedInUser && loggedInUser.role === 'admin';

  const links = Object.entries(menu)
    .map(([urlHash, { label }]) => `<a href="#${urlHash}">${label}</a>`) //Inget nytt här
    .join('');

  const adminButton = isAdmin
    ? `<button id="add-club-nav-btn" title="Lägg till ny klubb">+</button>` //om admin är inloggad lägger vi till en knapp
    : '';

  return links + adminButton;
}

async function loadPageContent() {
  document.querySelector('header nav').innerHTML = createMenu(); //Denna måste nu kallas varje load för vi gör om menyn om admin är inloggad
  if (location.hash === '') { location.replace('#start'); }

  let club = location.hash.slice(1);
  document.body.setAttribute('class', club);

  const functionToRun = menu[club].function;
  const { html, events } = await functionToRun();
  document.querySelector('main').innerHTML = html;


  updateMembershipDisplay(club); // Här lägger vi till globala moduler (håll logiken i sitt egna script)
  appendLoginButton();

  eraseMemberButton();
  if (events?.length) {
    setupSearch(events);
  }
  if (club !== 'start') {
    appendMemberButton(club);
  }
  setupEventCardClicks();
}

setupAdminClicks();
loadPageContent();
window.onhashchange = loadPageContent;

document.addEventListener('loginStatusChanged', () => { //Här lyssnar vi efter om login status har förändrats i admin-login.js
  loadPageContent();
});