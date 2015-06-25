import csp from 'js-csp';
import callbacks from 'callbacks';
import promises from 'promises';

const log = console.log.bind(console);

callbacks.fetchMovies(movie => log("callbacks:", movie));
promises.fetchMovies().then(movie => log("promises:", movie));
