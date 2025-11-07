import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import metalClub from './pages/metal-club.js';
import punkClub from './pages/punk-club.js';
import eightyClub from './pages/80srock-club.js';
import eventPage from './pages/event.js';
import filterAndRenderEvents from './utils/search.js';

let userMemberships = [];

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

function setupSearch(events) {
  const input = document.querySelector('#eventSearch');
  const container = document.querySelector('#eventsContainer');
  if (!input || !container) return;

  input.addEventListener('input', (e) => {
    container.innerHTML = filterAndRenderEvents(events, e.target.value);
  });
}

async function loadPageContent() {
  if (location.hash === '') { location.replace('#start'); }

  let club = location.hash.slice(1);
  document.body.setAttribute('class', club);

  const functionToRun = menu[club].function;
  const { html, events } = await functionToRun();
  document.querySelector('main').innerHTML = html;


  document.querySelector('#member-text')?.remove();
  document.querySelector('#toggle-member')?.remove();
  // Only setup search if events exist
  if (events?.length) {
    setupSearch(events);
  }
  if (club === 'start') {
    return;
  }

  const memberText = document.createElement('div');
  memberText.id = 'member-text';
  document.body.appendChild(memberText);

  let toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-member';
  document.body.appendChild(toggleBtn);

  function updateMembershipDisplay() {
    let isMember = userMemberships.includes(club);
    memberText.textContent = isMember ? 'Medlem' : 'Du har inte gått med i denna klubben';
    toggleBtn.textContent = isMember ? 'Lämna klubben' : 'Gå med i klubben';
  }

  toggleBtn.addEventListener('click', () => {
    if (userMemberships.includes(club)) {
      userMemberships = userMemberships.filter(c => c !== club);
    } else {
      userMemberships.push(club);
    }
    updateMembershipDisplay();
  });

  updateMembershipDisplay();

}


loadPageContent();
window.onhashchange = loadPageContent;
document.querySelector('header nav').innerHTML = createMenu();