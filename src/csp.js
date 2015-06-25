import csp from 'js-csp';
import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'routes';

function responseHandler(req, outChan) {
  return () => {
    if (req.status >= 200 && req.status < 400) {
      let response = JSON.parse(req.response);
      csp.go(function*() {
        yield csp.put(outChan, response);
        outChan.close();
      })
      callback(response);
    }
    else {
      callback({Error: "bad things"});
    }
  }
}


//       csp.go(function*() {
//         yield csp.put(outChan, response);
//         outChan.close();
//       });


function get(route, callback) {
  const req = new XMLHttpRequest();
  req.open('GET', route, true);
  req.onload = responseHandler(req, callback);
  req.send();
}

function parallelGet(routes, callback) {
  let counter = routes.length;
  let responses = [];
  routes.forEach(route =>
    get(route, (response) => {
      responses.push(response);
      counter--;
      if (counter === 0) {
        callback(responses);
      }
    })
  );
}

function fetchMovies(callback) {
  get(randomWordEndpoint, (response => {
    const [{word}] = response;
    const encodedWord = encodeURIComponent(word);
    get(movieSearchEndpoint + encodedWord, (response => {
      const {Search: movieStubs, Error: err} = response;
      if (err) {
        // try again; probably too obscure of a word
        fetchMovies(callback);
      }
      else {
        const movieIds = movieStubs.map(movieStub => movieStub.imdbID);
        const routes = movieIds.map(id => "http://www.omdbapi.com/?i=" + id);
        parallelGet(routes, (response => {
          const movies = response;
          callback({word, movies});
        }));
      }
    }));
  }));
}

export default { fetchMovies };




// import csp from 'js-csp';

// const responseHandler = (req, outChan) =>
//   () => {
//     const response = JSON.parse(req.response);
//     if (req.status >= 200 && req.status < 400) {
//       csp.go(function*() {
//         yield csp.put(outChan, response);
//         outChan.close();
//       });
//     }
//     else {
//       console.error("" + req.status + " error: " + response.error);
//     }
//   }

// const get = route => {
//   const outChan = csp.chan();
//   const req = new XMLHttpRequest();
//   req.open('GET', route, true);
//   req.onload = responseHandler(req, outChan);
//   req.onerror = reportConnectionError;
//   req.send();
//   return outChan;
// }

// const parallelGet = routes => {
//   const {merge, into} = csp.operations;
//   const responseChans = routes.map(get);
//   return into([], merge(responseChans));
// }

// const fetchMoviesFromSearch = searchStr =>
//   csp.go(function*() {
//     const encodedSearchStr = encodeURIComponent(searchStr);
//     const response = yield get(`http://www.omdbapi.com/?type=movie&s=${encodedSearchStr}`);
//     const movieStubs = response.Search;
//     const movieIds = movieStubs.map(movieStub => movieStub.imdbID);
//     const routes = movieIds.map(id => `http://www.omdbapi.com/?i=${id}`);
//     return yield parallelGet(routes);
//   });

// const fetchMoviesFromSearch = searchStr =>
//   new Promise(resolve => {
//     const encodedSearchStr = encodeURIComponent(searchStr);
//     get(`http://www.omdbapi.com/?type=movie&s=${encodedSearchStr}`)
//     .then(response => {
//       const movieStubs = response.Search;
//       const movieIds = movieStubs.map(movieStub => movieStub.imdbID);
//       const routes = movieIds.map(id => `http://www.omdbapi.com/?i=${id}`);
//       resolve(routes);
//     });
//   })
//   .then(parallelGet);
