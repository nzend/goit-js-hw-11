import './css/styles.css';
import fetchCards from './fetch-cards';
import { debounce } from 'debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('.search-form'),
  searchBtn: document.querySelector('.search-form button'),
  input: document.querySelector('.search-form input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let searchImg = '';
let currentPage = 1;
let perPage = 40;

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));
refs.form.addEventListener('submit', onSearchBtn);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

refs.searchBtn.disabled = true;

function onLoadMoreBtn(event) {
  event.preventDefault();
  currentPage += 1;

  fetchCards(searchImg, currentPage, perPage).then(response => {
    if (response.total === 0) {
      clearData();
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (response.hits.length < 40) {
      refs.loadMoreBtn.classList.remove('is-visible');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
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
    if (response.total === 0 || response.hits === []) {
      clearData();
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      refs.loadMoreBtn.classList.remove('is-visible');
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${response.totalHits} images.`);
    refs.searchBtn.disabled = true;

    refs.loadMoreBtn.classList.toggle('is-visible');

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

    Notiflix.Notify.info('Type to search');
    return;
  }
  refs.searchBtn.disabled = false;
}

function cardsMurkup({ hits }) {
  const cards = hits
    .map(
      card =>
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
