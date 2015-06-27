import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function responseHandler(req, callback) {
  return () => {
    const success = (req.status >= 200 && req.status < 400);
    const response = success ? JSON.parse(req.response) : {Error: "bad things"};
    callback(response);
  }
}

function get(route) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', route, true);
    req.onload = responseHandler(req, resolve);
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

function fetchMovies() {
  return new Promise(resolve => {
    return getRandomWord().then(word => {
      getMovieStubs(word).then(movieStubs => {
        if (movieStubs) {
          getMovies(movieStubs).then(movies => ({word, movies})).then(resolve);
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