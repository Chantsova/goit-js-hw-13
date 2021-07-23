import Notiflix from 'notiflix';
import axios from 'axios';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getPictures() {
    const axios = require('axios');
    return await axios
      .get('https://pixabay.com/api/', {
        params: {
          key: '22538110-4c245d53289541016fd72dadc',
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          per_page: 40,
          page: this.page,
        },
      })
      .then(response => {
        if (this.page === 1) {
          if (response.data.totalHits === 0) {
            throw new Error(
              Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
              ),
            );
          }
          if (response.data.totalHits !== 0) {
            Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
          }
        }
        const hits = response.data.hits;
        return hits;
      })
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}