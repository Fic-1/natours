/* eslint-disable */
import axios from 'axios';
import { displayMap } from './leaflet';

const locations = JSON.parse(document.getElementById('map').dataset.locations);

displayMap(locations);

const form = document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
