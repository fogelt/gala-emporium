export function appendLoginButton() { //Denna kallas från main varje pageLoad för att lägga till login knappen
  if (document.getElementById('login-button')) return;

  const btn = document.createElement('button');
  btn.id = 'login-button';
  if (sessionStorage.getItem('loggedInUser')) { //Kolla om användaren är inloggad redan här så man kan refresha sidan utan problem
    btn.textContent = 'Logout';
  } else { btn.textContent = `Admin Login`; }

  document.body.appendChild(btn);

  btn.addEventListener('click', () => handleLogin(btn)); //Kalla på handleLogin när knappen trycks ner
}

async function handleLogin(btn) {
  if (sessionStorage.getItem('loggedInUser')) { //Om man redan är inloggad returnerar vi tidigt och loggar ut
    sessionStorage.removeItem('loggedInUser');
    document.dispatchEvent(new Event('loginStatusChanged')); //Här skickar vi en signal som tas upp i main för att ladda om sidan
    btn.textContent = 'Admin Login';
    return;
  }
  const username = prompt('Username:');
  const password = prompt('Password:');
  const user = await checkLogin(username, password); //Kolla med 'handleLogin' om det finns en match finns i databasen

  if (user) {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user)); // Spara i minnet om användaren är inloggad
    document.dispatchEvent(new Event('loginStatusChanged')); //Här skickar vi en signal som tas upp i main för att ladda om sidan
    btn.textContent = `Logout`; //om användaren finns ändra texten på knappen
  } else { alert('Invalid username or password.'); }
}

async function checkLogin(username, password) {
  const res = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
  const data = await res.json();

  if (data.length > 0) {
    return data[0]; //Här returnerar vi den första matchen i databasen vi hittar när vi söker på username och password som skrivits in i input
  } else {
    return null;
  }
}