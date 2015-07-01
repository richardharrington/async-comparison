import csp from 'js-csp';
import co from 'co';

import callbacksVersion from 'js/callbacksVersion';
import promisesVersion from 'js/promisesVersion';
import cspVersion from 'js/cspVersion';
import coVersion from 'js/coVersion';
import asyncAwaitVersion from 'js/asyncAwaitVersion';

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
