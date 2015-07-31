import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'js/endpoints';

function get(url) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = () => {
      const response = JSON.parse(req.response);
      resolve(response);
    };
    req.send();
  });
}

function getParallel(urls) {
  return Promise.all(urls.map(get));
}

function fetchRandomWord() {
  return get(randomWordEndpoint).then(([{word}]) => word);
}
function fetchMovieStubsFromSearch(word) {
  const url = movieSearchEndpoint + encodeURIComponent(word);
  return get(url).then(({Search: movieStubs}) => movieStubs);
}
function fetchMovies(movieStubs) {
  const urls = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
  return getParallel(urls);
}

function launchMovieSearch() {
  return fetchRandomWord().then(word => {
    return fetchMovieStubsFromSearch(word).then(movieStubs => ({word, movieStubs}));
  }).then(({word, movieStubs}) => {
    if (movieStubs) {
      const generateFinalResults = movies => ({word, movies});
      return fetchMovies(movieStubs).then(generateFinalResults);
    }
    else {
      return launchMovieSearch();
    }
  });
}

export default { launchMovieSearch };
