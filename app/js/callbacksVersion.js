import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'js/endpoints';

const callbacksVersion = {

  get(url, callback) {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = () => {
      const response = JSON.parse(req.response);
      callback(response);
    };
    req.send();
  },

  getParallel(urls, callback) {
    let counter = urls.length;
    let responses = [];
    urls.forEach(url => {
      this.get(url, (response) => {
        responses.push(response);
        counter--;
        if (counter === 0) {
          callback(responses);
        }
      })
    });
  },

  fetchRandomWord(callback) {
    this.get(randomWordEndpoint, ([{word}]) => callback(word));
  },

  fetchMovieStubsFromSearch(word, callback) {
    const url = movieSearchEndpoint + encodeURIComponent(word);
    this.get(url, ({Search: movieStubs}) => callback(movieStubs));
  },

  fetchMovies(movieStubs, callback) {
    const urls = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
    this.getParallel(urls, callback);
  },

  launchMovieSearch(callback) {
    fetchRandomWord(word => {
      this.fetchMovieStubsFromSearch(word, movieStubs => {
        if (movieStubs) {
          const callbackFinalResults = movies => callback({word, movies});
          this.fetchMovies(movieStubs, callbackFinalResults);
        }
        else {
          this.launchMovieSearch(callback);
        }
      });
    });
  }
};

export default callbacksVersion;
