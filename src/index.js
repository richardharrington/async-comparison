import csp from 'js-csp';
import co from 'co';

import callbacksVersion from 'callbacksVersion';
import promisesVersion from 'promisesVersion';
import cspVersion from 'cspVersion';
import coVersion from 'coVersion';
import asyncAwaitVersion from 'asyncAwaitVersion';

const log = console.log.bind(console);

callbacksVersion.launchMovieSearch(result => log("callbacks:", result));
promisesVersion.launchMovieSearch().then(result => log("promises:", result));
csp.go(function*() {
  log("csp:", yield cspVersion.launchMovieSearch());
});
co(function*() {
  log("co:", yield coVersion.launchMovieSearch());
});
(async function() {
  log("async/await:", await asyncAwaitVersion.launchMovieSearch());
})();

// Something's wrong with this. Async/await seems to be working
// but is returning promises, not movies.

// ok, working now but had to put Promise.all in getParallel.
// is there a better way using async/await?


