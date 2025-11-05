import start from './pages/start.js';
import jazzClub from './pages/jazz-club.js';
import metalClub from './pages/metal-club.js';
import punkClub from './pages/punk-club.js';


let userMemberships = [];
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
  if (location.hash === '') { location.replace('#start'); }

  let club = location.hash.slice(1);
  document.body.setAttribute('class', club);

  const functionToRun = menu[club].function;
  const html = await functionToRun();
  document.querySelector('main').innerHTML = html;


  document.querySelector('#member-text')?.remove();
  document.querySelector('#toggle-member')?.remove();
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

  // Initial render
  updateMembershipDisplay();
}


// call loadPageContent once on page load
loadPageContent();

// and then on every hash change of the url/location
window.onhashchange = loadPageContent;

// create the menu and display it
document.querySelector('header nav').innerHTML = createMenu();