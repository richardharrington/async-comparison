import AjaxMocker from 'test/helpers/AjaxMocker';
import callbacksVersion from 'js/callbacksVersion';

const {get, getParallel} = callbacksVersion;

describe("Ajax", () => {
  beforeEach(() => AjaxMocker.install());
  afterEach(() => AjaxMocker.uninstall());

  describe("get", () =>
    it("gets the thing we wanted", (done) => {
      AjaxMocker.registerUrlResponsePairs({
        "gimme": {data: "what I want"}
      });
      setTimeout(() => {
        get('gimme', (response) => {
          expect(response).toEqual({data: 'what I want'});
          done();
        })
      }, 0);
    })
  );

  describe("getParallel", () =>
    it("gets a bunch of things we wanted", (done) => {
      AjaxMocker.registerUrlResponsePairs({
        "gimme": {data: "what I want"},
        "gimme also": {data: "what else I want"},
        "gimme furthermore": {data: "the last thing I want"}
      });
      setTimeout(() => {
        getParallel(['gimme', 'gimme also', 'gimme furthermore'], (response) => {
          expect(response).toEqual([
            {data: "what I want"},
            {data: "what else I want"},
            {data: "the last thing I want"}
          ]);
          done();
        })
      }, 0);
    })
  );
});
