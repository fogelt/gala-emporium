let userMemberships = [];

export function updateMembershipDisplay(club) {
  const memberText = document.querySelector('#member-text');
  const toggleBtn = document.querySelector('#toggle-member');

  if (!memberText || !toggleBtn) return;

  let isMember = userMemberships.includes(club);
  memberText.textContent = isMember ? 'Medlem' : 'Du har inte gått med i denna klubben';
  toggleBtn.textContent = isMember ? 'Lämna klubben' : 'Gå med i klubben';
}

export function appendMemberButton(club) {
  const memberText = document.createElement('div');
  memberText.id = 'member-text';
  document.body.appendChild(memberText);

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