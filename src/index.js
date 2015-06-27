import csp from 'js-csp';

import callbacksVersion from 'callbacksVersion';
import promisesVersion from 'promisesVersion';
import cspVersion from 'cspVersion';

const log = console.log.bind(console);

callbacksVersion.fetchMovies(result => log("callbacks:", result));
promisesVersion.fetchMoviesOld().then(result => log("promises old:", result));
promisesVersion.fetchMovies().then(result => log("promises new:", result));
csp.go(function*() {
  log("csp:", yield cspVersion.fetchMovies());
});
