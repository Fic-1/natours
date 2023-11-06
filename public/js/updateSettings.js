/* eslint-disable */
// Update data function

import axios from 'axios';
import { showAlert } from './alerts';

//* Type: 'password' || 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'Success') {
      showAlert('success', `${type.toUpperCase()} changed successfuly!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
