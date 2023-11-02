/* eslint-disable */
import { login } from './login';
import { displayMap } from './leaflet';

console.log('running index.js');

const locData = document.getElementById('map');
if (locData) {
  const locations = JSON.parse(locData.dataset.locations);
  displayMap(locations);
}

const loginForm = document.querySelector('.form');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });
}
