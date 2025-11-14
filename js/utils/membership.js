let userMemberships = []; //tom lista
export function updateMembershipDisplay(club) {
  const toggleBtn = document.querySelector('#toggle-member');

  if (!toggleBtn) return;

  let isMember = userMemberships.includes(club); // klubb namnet i listan
  toggleBtn.textContent = isMember ? 'Lämna klubben' : 'Gå med i klubben'; //uppdatera knapptexten beroende på medlemskap
}

export function appendMemberButton(club) {
  let toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-member'; // sätt ett id för att kunna hitta knappen senare
  document.body.appendChild(toggleBtn); // lägg till knappen i body

  toggleBtn.addEventListener('click', () => { //lyssna efter klick 
    if (userMemberships.includes(club)) {
      userMemberships = userMemberships.filter(c => c !== club); // om användaren är medlem, ta bort klubben från listan 
    } else {
      userMemberships.push(club); // om användaren inte är medlem, lägg till klubben i listan 
    }
    updateMembershipDisplay(club); //kallar på funktionen för att uppdatera knapptexten efter ändring
  });

  updateMembershipDisplay(club);
}

export function eraseMemberButton() { // ta bort medlemsknappen om den finns
  document.querySelector('#member-text')?.remove();
  document.querySelector('#toggle-member')?.remove();
}