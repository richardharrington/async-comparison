import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function get(route, callback) {
  const req = new XMLHttpRequest();
  req.open('GET', route, true);
  req.onload = () => {
    const response = JSON.parse(req.response);
    callback(response);
  };
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
        const moviePaths = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
        parallelGet(moviePaths, (movies => {
          callback({word, movies});
        }));
      }
    }));
  }));
}

export default { fetchMovies };
