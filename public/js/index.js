/* eslint-disable */
import { login, logout } from './login';
import { displayMap } from './leaflet';

// console.log('running index.js');

const logOutBtn = document.querySelector('.nav__el--logoutbtn');

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
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
