import csp from 'js-csp';
import callbacks from 'callbacks';
import promises from 'promises';
import cspVersion from 'csp';

const log = console.log.bind(console);

callbacks.fetchMovies(movie => log("callbacks:", movie));
promises.fetchMovies().then(movie => log("promises:", movie));
csp.go(function*() {
  log("csp:", yield cspVersion.fetchMovies());
});
