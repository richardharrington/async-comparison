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
  return (movies) => ({word, movies});
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

function fetchMoviesOld() {
  return new Promise(resolve => {
    get(randomWordEndpoint).then(([{word}]) => {
      const movieSearchPath = movieSearchEndpoint + encodeURIComponent(word);
      get(movieSearchPath).then(({Search: movieStubs, Error: err}) => {
        if (err) {
          // try again; probably too obscure of a word
          fetchMoviesOld().then(resolve);
        }
        else {
          const movieIds = movieStubs.map(movieStub => movieStub.imdbID);
          const moviePaths = movieIds.map(id => movieEndpoint + id);
          parallelGet(moviePaths).then(movies => {
            resolve({word, movies});
          });
        }
      })
    });
  });
}


export default { fetchMovies, fetchMoviesOld };