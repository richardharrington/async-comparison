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
  const getMovieSearchPath = () => {
    return new Promise(resolve => {
      get(randomWordEndpoint).then(response => {
        const [{word}] = response;
        const encodedWord = encodeURIComponent(word);
        const searchPath = movieSearchEndpoint + encodedWord;
        resolve(searchPath, word);
      });
    });
  };
  const getMoviePaths = (searchPath, word) => {
    return new Promise(resolve => {
      get(searchPath).then(response => {
        const {Search: movieStubs, Error: err} = response;
        if (err) {
          fetchMovies().then(resolve);
        }
        else {
          const movieIds = movieStubs.map(movieStub => movieStub.imdbID);
          const moviePaths = movieIds.map(id => "http://www.omdbapi.com/?i=" + id);
          resolve(moviePaths, word);
        }
      });
    });
  };
  const getMovies = (moviePaths, word) => {
    return new Promise(resolve => {
      parallelGet(moviePaths).then(response => {
        const movies = response;
        resolve({word, movies});
      });
    });
  };
  return getMovieSearchPath().then(getMoviePaths).then(getMovies);
}

export default { fetchMovies };