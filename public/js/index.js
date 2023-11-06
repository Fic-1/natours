/* eslint-disable */
import { login, logout } from './login';
import { displayMap } from './leaflet';
import { updateData } from './updateSettings';
import { countDocuments } from '../../models/tourModel';

// console.log('running index.js');

const logOutBtn = document.querySelector('.nav__el--logoutbtn');
const userDataForm = document.querySelector('.form-user-data');

const locData = document.getElementById('map');
if (locData) {
  const locations = JSON.parse(locData.dataset.locations);
  displayMap(locations);
}

const loginForm = document.querySelector('.form--login');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
