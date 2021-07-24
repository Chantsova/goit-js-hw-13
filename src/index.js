import './sass/main.scss';
import NewsApiService from './js/news-api-service.js';
import markupCards from './templates/markupCards.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import '../node_modules/simplelightbox/dist/simple-lightbox.min.css'

Notiflix.Notify.init({ width: '400px', position: 'right-top', fontSize: '17px' });

const refs = {
  formEl: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  cardEl: document.querySelector('.photo-card'),
  spinnerEl: document.querySelector('.spinner'),
  targetEl: document.querySelector('#borderMark'),
  bodyEl: document.querySelector('body')
};

var lightbox = new SimpleLightbox('.gallery a');
const newsApiService = new NewsApiService();


refs.formEl.addEventListener('submit', onSearch);
refs.bodyEl.addEventListener('wheel', smoothScroll)

async function onSearch(e) {
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim('');

  if (newsApiService.query === '') {
    return Notiflix.Notify.failure('Please, input your request.');
  }
  newsApiService.resetPage();

  try {
    let hits = await newsApiService.getPictures();

      clearGalleryContainer();
      appendCardsMarkup(hits);
    newsApiService.incrementPage();
    loadMore();

  }
  catch (error) {
    console.log('No congruence');
  }
}

async function getNewPage() {
  let hits = await newsApiService.getPictures();
  console.log(hits)
  
  if (hits.length === 0) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  appendCardsMarkup(hits);
  newsApiService.incrementPage();
}

async function appendCardsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', await markupCards(hits));
  lightbox.refresh();
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  
  window.scrollBy({
    top: cardHeight * 2,
    bottom: cardHeight * 2,
    behavior: 'smooth',
  });
}

function loadMore() {
  const onEntry = entries => {
    entries.forEach(entry => {
      
      if (entry.isIntersecting && newsApiService.query !== '') {
        getNewPage();
      }    
    })
  }

  const options = {
    rootMargin: "330px",
  };
  const observer = new IntersectionObserver(onEntry, options);
  observer.observe(refs.targetEl);
}