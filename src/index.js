import csp from 'js-csp';

import callbacksVersion from 'callbacksVersion';
import promisesVersion from 'promisesVersion';
import cspVersion from 'cspVersion';

const log = console.log.bind(console);

callbacksVersion.fetchMovies(movie => log("callbacks:", movie));
promisesVersion.fetchMovies().then(movie => log("promises:", movie));
csp.go(function*() {
  log("csp:", yield cspVersion.fetchMovies());
});
