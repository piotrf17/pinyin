// Saves options to chrome.storage.sync.
function save_options() {
  var character = document.getElementById('character').value;
  chrome.storage.sync.set({
    latest_character: character,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  var select = document.getElementById('character')
  var i = 1
  for (var key in chars) {
    if (!chars.hasOwnProperty(key)) {
      continue;
    }
    var option = document.createElement("option");
    option.value = key;
    option.text = i.toString() + ' - ' + key;
    select.add(option);
    i++;
  }

  chrome.storage.sync.get({
    latest_character: '前',
  }, function(items) {
    document.getElementById('character').value = items.latest_character;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
