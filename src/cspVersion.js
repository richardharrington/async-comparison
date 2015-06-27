import csp from 'js-csp';
import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function responseHandler(req, outChan) {
  return () => {
    const success = (req.status >= 200 && req.status < 400);
    const response = success ? JSON.parse(req.response) : {Error: "bad things"};
    csp.go(function*() {
      yield csp.put(outChan, response);
      outChan.close();
    });
  };
}

function get(route) {
  const outChan = csp.chan();
  const req = new XMLHttpRequest();
  req.open('GET', route, true);
  req.onload = responseHandler(req, outChan);
  req.send();
  return outChan;
}

function parallelGet(routes) {
  const {into, merge} = csp.operations;
  return into([], merge(routes.map(get)));
}

function fetchMovies() {
  return csp.go(function*() {
    const [{word}] = yield get(randomWordEndpoint);
    const movieSearchPath = movieSearchEndpoint + encodeURIComponent(word);
    const {Search: movieStubs, Error: err} = yield get(movieSearchPath);
    if (err) {
      // try again; probably too obscure of a word
      return yield fetchMovies();
    }
    const moviePaths = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
    const movies = yield parallelGet(moviePaths);
    return {word, movies};
  });
}

export default { fetchMovies };
