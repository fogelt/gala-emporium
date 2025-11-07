let userMemberships = [];

export function updateMembershipDisplay(club) {
  const toggleBtn = document.querySelector('#toggle-member');

  if (!toggleBtn) return;

  let isMember = userMemberships.includes(club);
  toggleBtn.textContent = isMember ? 'Lämna klubben' : 'Gå med i klubben';
}

export function appendMemberButton(club) {
  let toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggle-member';
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    if (userMemberships.includes(club)) {
      userMemberships = userMemberships.filter(c => c !== club);
    } else {
      userMemberships.push(club);
    }
    updateMembershipDisplay(club);
  });

  updateMembershipDisplay(club);
}

export function eraseMemberButton() {
  document.querySelector('#member-text')?.remove();
  document.querySelector('#toggle-member')?.remove();
}