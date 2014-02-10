var currentEntry = null;

function init(entry) {
  $('#open').click(open);
  $('#save').click(save);
  $('#saveas').click(saveAs);
  chrome.runtime.getBackgroundPage(function(bg) {
    if (bg.entryToLoad)
      loadEntry(bg.entryToLoad);
  });
}

function open() {
  chrome.fileSystem.chooseEntry({'type': 'openWritableFile'}, loadEntry);
}

function save() {
  if (currentEntry) {
    saveToEntry(currentEntry);
  } else {
    saveAs();
  }
}

function saveAs() {
  chrome.fileSystem.chooseEntry({'type': 'saveFile'}, saveToEntry);
}

function setTitle() {
  chrome.fileSystem.getDisplayPath(
      currentEntry,
      function(path) {
        document.title = path + ' - Simple Text';
      });
}

function loadEntry(entry) {
  currentEntry = entry;
  setTitle();
  entry.file(readFile);
}

function readFile(file) {
  var reader = new FileReader();
  reader.onloadend = function(e) {
    $('textarea').val(this.result);
  };
  reader.readAsText(file);
}

function saveToEntry(entry) {
  currentEntry = entry;
  setTitle();

  var blob = new Blob([$('textarea').val()], {type: 'text/plain'});
  entry.createWriter(function(writer) {
    writer.onwrite = function() {
      writer.onwrite = null;
      writer.write(blob);
    }
    writer.truncate(blob.size);
  });
}

$(document).ready(init);
