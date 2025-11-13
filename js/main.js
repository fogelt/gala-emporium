import start from './pages/start.js';
import { buildAdminClubList } from './utils/admin-functions.js';
import { loadClub } from './pages/router.js';
import { setupAdminClicks } from './utils/admin-functions.js';
import { appendLoginButton } from './utils/admin-login.js';
import { showEventDetails, setupEventCardClicks } from './utils/event-info.js';
import { setupSearch, filterAndRenderEvents } from './utils/search.js';
import { updateMembershipDisplay, eraseMemberButton, appendMemberButton } from './utils/membership.js'; // importera alla funktioner vi behöver komma åt i main.js

/*Pages är nu dynamiska och vi ladder in dom i runtime, detta krävs för att vi ska kunna uppdatera
menyn med nya skapade klubbar, (Start page fungerar som förut)*/
const staticPages = {
  "start": { label: "Start", function: start } //statisk page
};

async function createMenu() {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  const isAdmin = loggedInUser && loggedInUser.role === 'admin'; //Kolla om användaren är inloggad och är admin

  const res = await fetch('http://localhost:3000/clubs');
  const clubs = await res.json(); //Hämta klubbar från databaen (så vi kan uppdatera den)

  const links = [
    // "..." tar alla värden i arrayen och lägger in dem här istället för att skapa en array inuti en array
    // T.ex. [1, 2] och [3, 4] blir [...[1,2], ...[3,4]] > [1,2,3,4]
    ...Object.entries(staticPages).map(([urlHash, { label }]) => `<a href="#${urlHash}">${label}</a>`),
    // Lägg till alla klubbar i menyn
    ...clubs.map(club => `
      <span class="club-item">
        <a href="#${club.id}">${club.name}</a>
        ${isAdmin ? `<button id="delete-club-btn" data-id="${club.id}" title="Ta bort klubb">x</button>` : ''}
      </span>
    `) //medans vi loopar så gör vi en delete knapp för varje klubb om man är admin
  ].join(''); // Sedan lägger vi ihop alla strängar till en enda HTML-sträng

  const adminButton = isAdmin
    ? `<button id="add-club-nav-btn" title="Lägg till ny klubb">+</button>` //Lägg till en knapp för att skapa klubbar om man är admin
    : '';

  return links + adminButton;
}

async function loadPageContent() {
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  const isAdmin = loggedInUser?.role === 'admin'; // Kolla om admin

  document.querySelector('header nav').innerHTML = await createMenu();

  if (location.hash === '') location.replace('#start'); //Om hashen är tom gör vi om den till #start

  const clubId = location.hash.slice(1); //cludId sparas här som T.ex. start istället för #start
  document.body.setAttribute('class', clubId);

  let pageFunction;
  if (staticPages[clubId]) {
    pageFunction = staticPages[clubId].function; //Om vi är på en static page
  } else {
    pageFunction = () => loadClub(clubId); //Om vi är på en klubbsida skickar vi det till router.js nu istället för att ha massa olika scripts
  }

  const { html, events } = await pageFunction();
  document.querySelector('main').innerHTML = html;

  if (isAdmin) {
    document.querySelector('main').innerHTML += await buildAdminClubList(); //Lägg till id lista om admin
  }

  updateMembershipDisplay(clubId); //Uppdatera medlemsknappen beroende på vilken hash vi står på T.ex. Jazz-klubben
  appendLoginButton(); //Här lägger vi till inloggningsknappen
  eraseMemberButton(); //Vi tar alltid bort medlemskaps-knappen
  if (events?.length) setupSearch(events); //Lägg till sökfältet
  if (clubId !== 'start') appendMemberButton(clubId); //Om vi inte är på start så lägger vi till den igen
  setupEventCardClicks(); //Här börjar vi lyssna efter om användaren klickar på ett event från event-info.js
}

setupAdminClicks(); //Koppla samman admin clicks
await loadPageContent();
window.onhashchange = await loadPageContent; //Ladda sidan varje gång hash förändras

document.addEventListener('loginStatusChanged', async () => { //Här lyssnar vi efter om login status har förändrats i admin-login.js
  await loadPageContent();
});