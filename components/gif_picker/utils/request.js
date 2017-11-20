// This is a modified version of the code found in the gfycat-sdk project.
// Supported values for options: timeout, method, url, file, payload
export default function(options) {
  return new Promise(function(resolve, reject) {
    var timeout = options.timeout || 30000;

    var timer = setTimeout(function() {
      xhr.abort();
      reject(new Error('API request exceeded timeout of', timeout));
    }, timeout);

    var xhr = new XMLHttpRequest();

    function handleError(err) {
      clearTimeout(timer);
      err = err || new Error('API request failed');
      reject(err);
    }

    function handleResponse(res) {
      clearTimeout(timer);

      if (xhr.status >= 400) return reject(xhr.status);

      var body = xhr.response;
      try {
        body = JSON.parse(body);
        resolve(body)
      } catch (e) {
        resolve({})
      }
    }

    xhr.addEventListener('error', handleError);
    xhr.addEventListener('abort', handleError);
    xhr.addEventListener('load', handleResponse);

    xhr.open(options.method, options.url, true);

    var headers = options.headers || null;
    if (headers) {
      Object.keys(headers).forEach(function(header) {
        xhr.setRequestHeader(header, headers[header])
      })
    }

    if (options.file) {
      xhr.send(options.file);
    } else {
      var data = JSON.stringify(options.payload) || null;

      if (!data) {
        xhr.send();
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
      }
    }
  })
}
