let model = {responseStackMap: {}};
let cachedXMLHttpRequest = window.XMLHttpRequest;

function MockXMLHttpRequest() {
}

MockXMLHttpRequest.prototype = {
  open(_, url) {
    const responseStack = model.responseStackMap[url];
    if (!responseStack || responseStack.length === 0) {
      throw new Error('call to unregistered url; you need to register url and response with AjaxMocker.registerUrlResponsePairs');
    }
    this.response = responseStack.pop();
  },
  send() {
    setTimeout(() => this.onload(this.response), 0);
  }
}

function registerUrlResponsePairs(...responsePairs) {
  responsePairs.forEach(([url, response]) => {
    model.responseStackMap[url] = model.responseStackMap[url] || [];
    model.responseStackMap[url].push(JSON.stringify(response));
  });
}

function install() {
  model.responseStackMap = {};
  window.XMLHttpRequest = MockXMLHttpRequest;
}

function uninstall() {
  window.XMLHttpRequest = cachedXMLHttpRequest;
}

export default { registerUrlResponsePairs, install, uninstall };
