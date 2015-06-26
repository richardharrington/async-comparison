import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function responseHandler(req, resolve) {
  return () => {
    if (req.status >= 200 && req.status < 400) {
      let response = JSON.parse(req.response);
      resolve(response);
    }
    else {
      resolve({Error: "bad things"});
    }
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

  function getMoviePaths() {
    return new Promise(resolve => {
      get(randomWordEndpoint).then(([{word}]) => {
        const encodedWord = encodeURIComponent(word);
        const movieSearchPath = movieSearchEndpoint + encodedWord;
        get(movieSearchPath).then(({Search: movieStubs, Error: err}) => {
          if (err) {
            // try again; probably too obscure of a word
            getMoviePaths().then(resolve);
          }
          else {
            const movieIds = movieStubs.map(movieStub => movieStub.imdbID);
            const moviePaths = movieIds.map(id => movieEndpoint + id);
            resolve({word, moviePaths});
          }
        })
      });
    });
  }

  function getMovies({word, moviePaths}) {
    return new Promise(resolve => {
      parallelGet(moviePaths).then(response => {
        const movies = response;
        resolve({word, movies});
      });
    });
  }

  return new Promise(resolve => {
    getMoviePaths().then(response => {
      getMovies(response).then(response => {
        resolve(response);
      });
    });
  });
}

export default { fetchMovies };