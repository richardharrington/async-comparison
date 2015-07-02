import AjaxMocker from 'test/helpers/AjaxMocker';
import callbacksVersion from 'js/callbacksVersion';
import { randomWordEndpoint, movieSearchEndpoint, movieEndpoint } from 'js/endpoints';

describe("Ajax", () => {
  beforeEach(() => AjaxMocker.install());
  afterEach(() => AjaxMocker.uninstall());

  it("get gets the thing we wanted", (done) => {
    AjaxMocker.registerUrlResponsePairs(
      ["gimme", {data: "what I want"}]
    );
    callbacksVersion.get('gimme', (response) => {
      expect(response).toEqual({data: 'what I want'});
      done();
    });
  });

  it("getParallel gets a bunch of things we wanted", (done) => {
    AjaxMocker.registerUrlResponsePairs(
      ["gimme", {data: "what I want"}],
      ["gimme also", {data: "what else I want"}],
      ["gimme furthermore", {data: "the last thing I want"}]
    );
    callbacksVersion.getParallel(['gimme', 'gimme also', 'gimme furthermore'], (response) => {
      expect(response).toEqual([
        {data: "what I want"},
        {data: "what else I want"},
        {data: "the last thing I want"}
      ]);
      done();
    });
  });
});

describe("basic fetch building blocks", () => {

  // each of these functions should have 2 tests: one that
  // makes sure that the right url got pinged, and one that
  // makes sure that the response is processed correctly.

  // TODO: another test showing that the right url got pinged.

  it("fetches a random word", (done) => {
    spyOn(callbacksVersion, "get").and.callFake((_, callback) => {
      callback([{word: "aardvark"}]);
    });
    callbacksVersion.fetchRandomWord((word) => {
      expect(word).toEqual("aardvark");
      done();
    });
  });

  // TODO: another test showing that the right url got pinged.

  it("fetches movie stubs", (done) => {
    spyOn(callbacksVersion, "get").and.callFake((_, callback) => {
      callback({Search: "Hi I'm the movie stubs you're looking for"});
    });
    callbacksVersion.fetchMovieStubsFromSearch("aardvark", (movieStubs) => {
      expect(movieStubs).toEqual("Hi I'm the movie stubs you're looking for");
      done();
    });
  });

  // TODO: another test (the only useful test, really) showing that the right url got pinged.

  it("fetches movies", (done) => {
    // const movieStubs = [{imdbID: "a"}, {imdbID: "b"}, {imdbID: "c"}];
    // AjaxMocker.registerUrlResponsePairs(
    //   [movieEndpoint + "a", {movie: "I'm A movie."}],
    //   [movieEndpoint + "b", {movie: "I'm B movie."}],
    //   [movieEndpoint + "c", {movie: "I'm C movie."}]
    // );
    spyOn(callbacksVersion, "getParallel").and.callFake((_, callback) => {
      callback([{movie: "I'm A movie."}, {movie: "I'm B movie."}, {movie: "I'm C movie."}])
    });
    callbacksVersion.fetchMovies(["this is an irrelevant arg"], (movies) => {
      expect(movies).toEqual([{movie: "I'm A movie."}, {movie: "I'm B movie."}, {movie: "I'm C movie."}]);
      done();
    });
  });

});




