import './sass/main.scss';
import NewsApiService from './js/news-api-service';
import markupCards from './templates/markupCards.hbs';
import Notiflix from 'notiflix';

Notiflix.Notify.init({ width: '400px', position: 'right-top', fontSize: '17px' });

const refs = {
  formEl: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  cardEl: document.querySelector('.photo-card'),
  spinnerEl: document.querySelector('.spinner'),
  targetEl: document.querySelector('#borderMark'),
};

const newsApiService = new NewsApiService();

refs.formEl.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim('');

  if (newsApiService.query === '') {
    return Notiflix.Notify.failure('Please, input your request.');
  }

  newsApiService.resetPage();
  try {
    await newsApiService.getPictures().then(hits => {
      clearGalleryContainer();
      appendCardsMarkup(hits);
      newsApiService.incrementPage();
      loadMore();
    });
  } catch (error) {
    console.log('No congruence');
  }
}

function appendCardsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', markupCards(hits));
  smoothScroll();
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
    behavior: 'smooth',
  });
}

async function loadMore() {
  const onEntry = entries => {
    entries.forEach(entry => {
      console.log(entry)
      if (entry.isIntersecting && newsApiService.query !== '') {
        newsApiService.getPictures().then(hits => {
          if (hits.lenght !== 0) {
          appendCardsMarkup(hits);
          newsApiService.incrementPage(); 
          }
          return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        });
      }
    });
  };
  
  const options = {
    rootMargin: '100px',
  };
  const observer = new IntersectionObserver(onEntry, options);
  observer.observe(refs.targetEl);
}

// if (hits === []) {
//             
//           }

//console.log(document.getElementById('.gallery').children.length)
