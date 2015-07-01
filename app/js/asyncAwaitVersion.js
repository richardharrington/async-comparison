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

async function fetchRandomWord() {
  const [{word}] = await get(randomWordEndpoint);
  return word;
}

async function fetchMovieStubsFromSearch(word) {
  const url = movieSearchEndpoint + encodeURIComponent(word);
  const {Search: movieStubs} = await get(url);
  return movieStubs;
}

async function fetchMovies(movieStubs) {
  const urls = movieStubs.map(movieStub => movieEndpoint + movieStub.imdbID);
  return await getParallel(urls);
}

async function launchMovieSearch() {
  const word = await fetchRandomWord();
  const movieStubs = await fetchMovieStubsFromSearch(word);
  if (movieStubs) {
    const movies = await fetchMovies(movieStubs);
    const finalResults = {word, movies};
    return finalResults;
  }
  else {
    return await launchMovieSearch();
  }
}

export default { launchMovieSearch };
