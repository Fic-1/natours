/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51OAC2FIZO6q4xj6WZJ7rYxMBHwmoUSN4PK4z5NV9rjlmnvdTsTFaFh0lESBAiL1MiOjxIVBMI1HMLwT4ihygAYAo00OS7vxkjH',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get the session from the API endpoint
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
};
