import start from './pages/start.js';
import { buildAdminClubList } from './utils/admin-functions.js';
import { loadClub } from './pages/router.js';
import { setupAdminClicks } from './utils/admin-functions.js';
import { appendLoginButton } from './utils/admin-login.js';
import { showEventDetails, setupEventCardClicks } from './utils/event-info.js';
import { setupSearch, filterAndRenderEvents } from './utils/search.js';
import { updateMembershipDisplay, eraseMemberButton, appendMemberButton } from './utils/membership.js'; //1 importera


const staticPages = {
  "start": { label: "Start", function: start }
};

async function createMenu() { // skapar vi menyn
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  const isAdmin = loggedInUser && loggedInUser.role === 'admin';

  const res = await fetch('http://localhost:3000/clubs');
  const clubs = await res.json();

  const links = [

    ...Object.entries(staticPages).map(([urlHash, { label }]) => `<a href="#${urlHash}">${label}</a>`),

    ...clubs.map(club => `
      <span class="club-item">
        <a href="#${club.id}">${club.name}</a>
        ${isAdmin ? `<button id="delete-club-btn" data-id="${club.id}" title="Ta bort klubb">x</button>` : ''}
      </span>
    `)
  ].join('');

  const adminButton = isAdmin
    ? `<button id="add-club-nav-btn" title="Lägg till ny klubb">+</button>`
    : '';

  return links + adminButton;
}

async function loadPageContent() {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  const isAdmin = loggedInUser?.role === 'admin'; // laddas inneh

  document.querySelector('header nav').innerHTML = await createMenu();

  if (location.hash === '') location.replace('#start');

  const clubId = location.hash.slice(1);
  document.body.setAttribute('class', clubId);

  let pageFunction;
  if (staticPages[clubId]) {
    pageFunction = staticPages[clubId].function; // hamta funktion menyn
  } else {
    pageFunction = () => loadClub(clubId);
  }

  const { html, events } = await pageFunction(); // vanta funktionen klart
  document.querySelector('main').innerHTML = html;

  if (isAdmin) {
    document.querySelector('main').innerHTML += await buildAdminClubList();
  }

  updateMembershipDisplay(clubId);
  appendLoginButton();
  eraseMemberButton();
  if (events?.length) setupSearch(events);
  if (clubId !== 'start') appendMemberButton(clubId);
  setupEventCardClicks();
}

setupAdminClicks();
await loadPageContent(); // ladda
window.onhashchange = await loadPageContent; // ladda ny sida

document.addEventListener('loginStatusChanged', async () => {
});