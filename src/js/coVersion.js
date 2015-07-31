import co from 'co';

import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'js/endpoints';

function get(url) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = () => {
      const response = JSON.parse(req.response);
      resolve(response);
    };
    req.send();
  });
}

function getParallel(urls) {
  return co(function*() {
    return yield urls.map(get);
  });
}

function fetchRandomWord() {
  return co(function*() {
    const [{word}] = yield get(randomWordEndpoint);
    return word;
  });
}

function fetchMovieStubsFromSearch(word) {
  return co(function*() {
    const url = movieSearchEndpoint + encodeURIComponent(word);
    const {Search: movieStubs} = yield get(url);
    return movieStubs;
  });
}

function fetchMovies(movieStubs) {
  const urls = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
  return getParallel(urls);
}

function launchMovieSearch() {
  return co(function*() {
    const word = yield fetchRandomWord();
    const movieStubs = yield fetchMovieStubsFromSearch(word);
    if (movieStubs) {
      const movies = yield fetchMovies(movieStubs);
      const finalResults = {word, movies};
      return finalResults;
    }
    else {
      return yield launchMovieSearch();
    }
  });
}

export default { launchMovieSearch };
