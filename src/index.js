import './css/styles.css';
import fetchCards from './fetch-cards';
import { debounce } from 'debounce';
import Notiflix from 'notiflix';

// console.log(fetchCards);
const DEBOUNCE_DELAY = 1000;

const refs = {
  form: document.querySelector('.search-form'),
  searchBtn: document.querySelector('.search-form button'),
  input: document.querySelector('.search-form input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let searchImg = '';
let currentPage = 1;
// let page = 1;

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
refs.form.addEventListener('submit', onSearchBtn);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

refs.searchBtn.disabled = true;

function onLoadMoreBtn(event) {
  event.preventDefault();
  currentPage += 1;
  fetchCards(searchImg, currentPage).then(response => {
    if (response.total === 0) {
      clearData();
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    cardsMurkup(response);
  });
}

function onSearchBtn(event) {
  event.preventDefault();
  refs.searchBtn.disabled = false;

  fetchCards(searchImg).then(response => {
    clearData();
    if (response.total === 0) {
      clearData();
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      refs.loadMoreBtn.classList.toggle('is-visible');
    }

    refs.searchBtn.disabled = true;

    refs.loadMoreBtn.classList.toggle('is-visible');
    const total = response.total;

    const totalPages = Math.ceil(response.totalHits / response.hits.length);

    if (response.page >= totalPages) {
      refs.loadMoreBtn.classList.remove('is-visible');
    }

    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

    cardsMurkup(response);
  });
}

function onInputChange() {
  searchImg = refs.input.value.trim();
  if (searchImg === '') {
    refs.loadMoreBtn.classList.remove('is-visible');
    currentPage = 1;

    clearData();
    refs.searchBtn.disabled = true;

    Notiflix.Notify.info('Введіть для пошуку');
    return;
  }
  refs.searchBtn.disabled = false;
}

function cardsMurkup({ hits }) {
  const cards = hits
    .map(
      card =>
        // console.log(card);
        `
    <div class="photo-card">
        <img src="${card.webformatURL}" alt="" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${card.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${card.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${card.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${card.downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', cards);
}

function clearData() {
  refs.gallery.innerHTML = '';
  refs.gallery.innerHTML = '';
}
