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

function getRandomWord(callback) {
  get(randomWordEndpoint, ([{word}]) => callback(word));
}

function getMovieStubs(word, callback) {
  const movieSearchPath = movieSearchEndpoint + encodeURIComponent(word);
  get(movieSearchPath, ({Search: movieStubs}) => callback(movieStubs));
}

function getMovies(movieStubs, callback) {
  const moviePaths = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
  parallelGet(moviePaths, callback);
}

function fetchMovies(callback) {
  getRandomWord(word => {
    getMovieStubs(word, movieStubs => {
      if (movieStubs) {
        const callbackFinalResults = movies => callback({word, movies});
        getMovies(movieStubs, callbackFinalResults);
      }
      else {
        fetchMovies(callback);
      }
    });
  });
}

export default { fetchMovies };
