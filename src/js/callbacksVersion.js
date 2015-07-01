import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'js/endpoints';

function get(url, callback) {
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = () => {
    const response = JSON.parse(req.response);
    callback(response);
  };
  req.send();
}

function getParallel(urls, callback) {
  let counter = urls.length;
  let responses = [];
  urls.forEach(url =>
    get(url, (response) => {
      responses.push(response);
      counter--;
      if (counter === 0) {
        callback(responses);
      }
    })
  );
}

function fetchRandomWord(callback) {
  get(randomWordEndpoint, ([{word}]) => callback(word));
}

function fetchMovieStubsFromSearch(word, callback) {
  const url = movieSearchEndpoint + encodeURIComponent(word);
  get(url, ({Search: movieStubs}) => callback(movieStubs));
}

function fetchMovies(movieStubs, callback) {
  const urls = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
  getParallel(urls, callback);
}

function launchMovieSearch(callback) {
  fetchRandomWord(word => {
    fetchMovieStubsFromSearch(word, movieStubs => {
      if (movieStubs) {
        const callbackFinalResults = movies => callback({word, movies});
        fetchMovies(movieStubs, callbackFinalResults);
      }
      else {
        launchMovieSearch(callback);
      }
    });
  });
}

export default { launchMovieSearch };
