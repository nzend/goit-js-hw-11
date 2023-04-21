export default function fetchCards(searchQuery) {
  let page = 1;
  const axios = require('axios');
  const URl = ``;
  const options = {
    key: '',
  };
  return fetch(URl, options).then(responce => {
    responce.json();
  });
}
