import axios from 'axios';
const options = {
  baseUrl: 'https://pixabay.com/api/',
  key: '35630597-0391cfe0949186f41cbd4414f',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  order: 'popular',
  page: 1,
  per_page: '4',
};

export default async function fetchCards(searchImg) {
  options.page += 1;
  const {
    baseUrl,
    key,
    image_type,
    orientation,
    safesearch,
    order,
    page,
    per_page,
  } = options;

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${searchImg}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&order=${order}&page=${page}&per_page=${per_page}`
  );
  const results = response.data;
  return results;
}
