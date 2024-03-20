import { BASE_URL } from './config.js'

export const apiCall = (method, path, body, token) => {
  const payloadBody = {
    method,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body)
  }
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + path, payloadBody)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      })
  })
}

export const getCall = (path, token) => {
  const body = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  }
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + path, body)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      })
  })
}

export const postCall = async (path, body, token) => {
  const postBody = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + path, postBody)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      })
  })
}

export const putCall = (path, body, token) => {
  console.log('body:');
  console.log(body);
  return apiCall('PUT', path, body, token);
}

export const deleteCall = (path, token) => {
  const body = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  };

  return new Promise((resolve, reject) => {
    fetch(BASE_URL + path, body)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          reject(new Error(data.error));
        } else {
          resolve(data);
        }
      })
      .catch(error => reject(error));
  });
}
