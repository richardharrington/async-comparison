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

function fetchMovies() {
  return new Promise(resolve => {
    get(randomWordEndpoint).then(([{word}]) => {
      const movieSearchPath = movieSearchEndpoint + encodeURIComponent(word);
      get(movieSearchPath).then(({Search: movieStubs, Error: err}) => {
        if (err) {
          // try again; probably too obscure of a word
          fetchMovies().then(resolve);
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

export default { fetchMovies };