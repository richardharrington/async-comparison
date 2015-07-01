import csp from 'js-csp';
import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'js/endpoints';

function get(url) {
  const outChan = csp.chan();
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = () => {
    csp.go(function*() {
      const response = JSON.parse(req.response);
      yield csp.put(outChan, response);
      outChan.close();
    })
  };
  req.send();
  return outChan;
}

function getParallel(urls) {
  const {into, merge} = csp.operations;
  return into([], merge(urls.map(get)));
}

function fetchRandomWord() {
  return csp.go(function*() {
    const [{word}] = yield get(randomWordEndpoint);
    return word;
  });
}

function fetchMovieStubsFromSearch(word) {
  return csp.go(function*() {
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
  return csp.go(function*() {
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
