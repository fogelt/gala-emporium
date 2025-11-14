let userMemberships = []; //tom lista
export function updateMembershipDisplay(club) {
  const toggleBtn = document.querySelector('#toggle-member');

  if (!toggleBtn) return;

  let isMember = userMemberships.includes(club); // klubb Na F listan
  toggleBtn.textContent = isMember ? 'Lämna klubben' : 'Gå med i klubben'; //uppdatera knapptexten Me
}

export function appendMemberButton(club) {
  let toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-member'; // sätt ett id 
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    if (userMemberships.includes(club)) {
      userMemberships = userMemberships.filter(c => c !== club);
    } else {
      userMemberships.push(club);
    }
    updateMembershipDisplay(club); //kallas funktion upda
  });

  updateMembershipDisplay(club);
}

export function eraseMemberButton() { // bort medlemsknap
  document.querySelector('#member-text')?.remove();
  document.querySelector('#toggle-member')?.remove();
}