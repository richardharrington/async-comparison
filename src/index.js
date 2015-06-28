import csp from 'js-csp';
import co from 'co';

import callbacksVersion from 'callbacksVersion';
import promisesVersion from 'promisesVersion';
import cspVersion from 'cspVersion';
import coVersion from 'coVersion';

const log = console.log.bind(console);

callbacksVersion.launchMovieSearch(result => log("callbacks:", result));
promisesVersion.launchMovieSearch().then(result => log("promises:", result));
csp.go(function*() {
  log("csp:", yield cspVersion.launchMovieSearch());
});
co(function*() {
  log("co:", yield coVersion.launchMovieSearch());
})
