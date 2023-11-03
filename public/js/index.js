/* eslint-disable */
import { displayMap } from './leaflet';
import { login } from './login';

//DOM ELEMENTS
const leafletMap = document.getElementById('map');
const loginForm = document.querySelector('.form')
//VALUES
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

//DELEGATION
IdleDeadline(leafletMap){
const locations = JSON.parse(document.getElementById('map').dataset.locations);
displayMap(locations);
}
if(loginForm)
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login(email, password);
});
