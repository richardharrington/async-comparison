let model = {responseMap: {}};
let cachedXMLHttpRequest = window.XMLHttpRequest;

function MockXMLHttpRequest() {
}

MockXMLHttpRequest.prototype = {
  open(_, url) {
    const response = model.responseMap[url];
    if (typeof response === 'undefined') {
      throw new Error('call to unregistered url; you need to register url and response with AjaxMocker.registerUrlResponsePairs');
    }
    this.response = response;
  },
  send() {
    setTimeout(() => this.onload(this.response), 0);
  }
}

function registerUrlResponsePairs(responsePairs) {
  for (let url in responsePairs) {
    model.responseMap[url] = JSON.stringify(responsePairs[url]);
  }
}

function install() {
  model.responseMap = {};
  window.XMLHttpRequest = MockXMLHttpRequest;
}

function uninstall() {
  window.XMLHttpRequest = cachedXMLHttpRequest;
}

export default { registerUrlResponsePairs, install, uninstall };
