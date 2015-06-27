import csp from 'js-csp';
import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function get(route) {
  const outChan = csp.chan();
  const req = new XMLHttpRequest();
  req.open('GET', route, true);
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

function parallelGet(routes) {
  const {into, merge} = csp.operations;
  return into([], merge(routes.map(get)));
}

function getRandomWord() {
  return csp.go(function*() {
    const [{word}] = yield get(randomWordEndpoint);
    return word;
  });
}

function getMovieStubs(word) {
  return csp.go(function*() {
    const movieSearchPath = movieSearchEndpoint + encodeURIComponent(word);
    const {Search: movieStubs} = yield get(movieSearchPath);
    return movieStubs;
  });
}

function getMovies(movieStubs) {
  return csp.go(function*() {
    const moviePaths = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
    return yield parallelGet(moviePaths);
  });
}

function fetchMovies() {
  return csp.go(function*() {
    const word = yield getRandomWord();
    const movieStubs = yield getMovieStubs(word);
    if (movieStubs) {
      const movies = yield getMovies(movieStubs);
      return {word, movies};
    }
    else {
      return yield fetchMovies();
    }
  });
}

export default { fetchMovies };
