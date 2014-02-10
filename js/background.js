function init(launchData) {
  var fileEntry = null
  if (launchData && launchData['items'] && launchData['items'].length > 0) {
    fileEntry = launchData['items'][0]['entry']
  }

  var options = {
    frame: 'chrome',
    minWidth: 400,
    minHeight: 400,
    width: 700,
    height: 700
  };

  chrome.app.window.create(
      'index.html', options,
      function(win) {
        if (fileEntry)
          win.contentWindow.load(fileEntry);
      });
}

chrome.app.runtime.onLaunched.addListener(init);
