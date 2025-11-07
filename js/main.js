import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import metalClub from './pages/metal-club.js';
import punkClub from './pages/punk-club.js';
import eightyClub from './pages/80srock-club.js';
import filterAndRenderEvents from './utils/search.js';
import { setupSearch } from './utils/search.js';
import { updateMembershipDisplay, eraseMemberButton, appendMemberButton } from './utils/membership.js';

const menu = {
  "start": { label: 'Start', function: start },
  "jazz-klubben": { label: 'Jazz-klubben', function: jazzClub },
  "metal-klubben": { label: 'Metal-klubben', function: metalClub },
  "80s-rock": { label: 'Rock-klubben', function: eightyClub },
  "punk-klubben": { label: 'Punk-klubben', function: punkClub }
};

function createMenu() {
  return Object.entries(menu)
    .map(([urlHash, { label }]) => `
      <a href="#${urlHash}">${label}</a>
    `)
    .join('');
}

async function loadPageContent() {
  if (location.hash === '') { location.replace('#start'); }

  let club = location.hash.slice(1);
  document.body.setAttribute('class', club);

  const functionToRun = menu[club].function;
  const { html, events } = await functionToRun();
  document.querySelector('main').innerHTML = html;


  updateMembershipDisplay(club);

  eraseMemberButton();
  if (events?.length) {
    setupSearch(events);
  }
  if (club !== 'start') {
    appendMemberButton(club);
  }
}

loadPageContent();
window.onhashchange = loadPageContent;
document.querySelector('header nav').innerHTML = createMenu();