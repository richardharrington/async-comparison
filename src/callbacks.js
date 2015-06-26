import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function responseHandler(req, callback) {
  return () => {
    if (req.status >= 200 && req.status < 400) {
      const response = JSON.parse(req.response);
      callback(response);
    }
    else {

      callback({Error: "bad things"});
    }
  }
}

function get(route, callback) {
  const req = new XMLHttpRequest();
  req.open('GET', route, true);
  req.onload = responseHandler(req, callback);
  req.send();
}

function parallelGet(routes, callback) {
  let counter = routes.length;
  let responses = [];
  routes.forEach(route =>
    get(route, (response) => {
      responses.push(response);
      counter--;
      if (counter === 0) {
        callback(responses);
      }
    })
  );
}

function fetchMovies(callback) {
  get(randomWordEndpoint, (([{word}]) => {
    const movieSearchPath = movieSearchEndpoint + encodeURIComponent(word);
    get(movieSearchPath, (({Search: movieStubs, Error: err}) => {
      if (err) {
        // try again; probably too obscure of a word
        fetchMovies(callback);
      }
      else {
        const movieIds = movieStubs.map(movieStub => movieStub.imdbID);
        const routes = movieIds.map(id => "http://www.omdbapi.com/?i=" + id);
        parallelGet(routes, (response => {
          const movies = response;
          callback({word, movies});
        }));
      }
    }));
  }));
}

export default { fetchMovies };
