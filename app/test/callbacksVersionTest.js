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
  describe("fetchRandomWord", () => {
    beforeEach(() => spyOn(callbacksVersion, 'get'));

    it("makes the right call", () => {
      callbacksVersion.fetchRandomWord(() => {});
      expect(callbacksVersion.get).toHaveBeenCalledWith(randomWordEndpoint, jasmine.any(Function));
    });

    it("processes the result correctly", (done) => {
      callbacksVersion.get.and.callFake((_, callback) => {
        callback([{word: "aardvark"}]);
      });
      callbacksVersion.fetchRandomWord((word) => {
        expect(word).toEqual("aardvark");
        done();
      });
    });
  });

  describe("fetchMovieStubsFromSearch", () => {
    beforeEach(() => spyOn(callbacksVersion, 'get'));

    it("makes the right call", () => {
      callbacksVersion.fetchMovieStubsFromSearch('aardvark', () => {});
      expect(callbacksVersion.get).toHaveBeenCalledWith(movieSearchEndpoint + 'aardvark', jasmine.any(Function));
    });

    it("processes the results correctly", (done) => {
      callbacksVersion.get.and.callFake((_, callback) => {
        callback({Search: "Hi I'm the movie stubs you're looking for"});
      });
      callbacksVersion.fetchMovieStubsFromSearch("aardvark", (movieStubs) => {
        expect(movieStubs).toEqual("Hi I'm the movie stubs you're looking for");
        done();
      });
    });

  });

  describe("fetchMovies", () => {
    beforeEach(() => spyOn(callbacksVersion, 'getParallel'));

    it("makes the correct call", () => {
      const movieStubs = [{imdbID: "abc"}, {imdbID: "def"}, {imdbID: "ghi"}];
      callbacksVersion.fetchMovies(movieStubs, () => {});
      const urls = ["abc", "def", "ghi"].map(id => movieEndpoint + id);
      expect(callbacksVersion.getParallel).toHaveBeenCalledWith(urls, jasmine.any(Function));
    });

    it("processes the results correctly (i.e. not at all)", (done) => {
      callbacksVersion.getParallel.and.callFake((_, callback) => {
        callback("the bare results");
      });
      callbacksVersion.fetchMovies([], (movies) => {
        expect(movies).toEqual("the bare results");
        done();
      });
    });

  });

});




