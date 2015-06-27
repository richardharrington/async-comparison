import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function get(route) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', route, true);
    req.onload = () => {
      const response = JSON.parse(req.response);
      resolve(response);
    };
    req.send();
  });
}

function parallelGet(routes) {
  return Promise.all(routes.map(get));
}

function getRandomWord() {
  return get(randomWordEndpoint).then(([{word}]) => word);
}
function getMovieStubs(word) {
  const movieSearchPath = movieSearchEndpoint + encodeURIComponent(word);
  return get(movieSearchPath).then(({Search: movieStubs}) => movieStubs);
}
function getMovies(movieStubs) {
  const moviePaths = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
  return parallelGet(moviePaths);
}

function includeWordWithResults(word) {
  return movies => ({word, movies});
}

function fetchMovies() {
  return new Promise(resolve => {
    return getRandomWord().then(word => {
      getMovieStubs(word).then(movieStubs => {
        if (movieStubs) {
          getMovies(movieStubs).then(includeWordWithResults(word)).then(resolve);
        }
        else {
          fetchMovies().then(resolve);
        }
      });
    });
  });
}

export default { fetchMovies };