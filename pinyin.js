var is_chinese = new RegExp('[⺀-⺙⺛-⻳⼀-⿕々〇〡-〩〸-〺〻㐀-䶵一-鿃豈-鶴侮-頻並-龎]');

function styleTextNodes(latest_known, element) {
  var blank_span = document.createElement('span');
  var container_div = document.createElement('div');
  container_div.style = 'display: inline-block; text-align:center'
  var pinyin_div = document.createElement('div');
  pinyin_div.style = 'font-size: 60%; color: #c00; width: 100%; line-height: normal'
  var char_div = document.createElement('div');
  char_div.style = 'line-height: normal'

  // Delete all chars we already know from the map.
  for (var key in chars) {
    if (!chars.hasOwnProperty(key)) {
      continue;
    }
    delete chars[key];
    if (key == latest_known) {
      break;
    }
  }


  // Recursively walk through the childs, and push text nodes in the list
  var text_nodes = [];
  (function recursiveWalk(node) {
    if (node) {
      node = node.firstChild;
      while (node != null) {
        if (node.nodeType == 3) {
          // Text node, do something, eg:
          text_nodes.push(node);
        } else if (node.nodeType == 1) {
          recursiveWalk(node);
        }
        node = node.nextSibling;
      }
    }
  })(element);
  
  // innerText for old IE versions.
  var textContent = 'textContent' in element ? 'textContent' : 'innerText';
  for (var i=text_nodes.length-1; i>=0; i--) {
    var dummy = document.createDocumentFragment()
    , node = text_nodes[i]
    , text = node[textContent], tmp;
    for (var j=0; j<text.length; j++) {
      if (is_chinese.test(text[j]) && text[j] in chars) {
	tmp = container_div.cloneNode(true);
	pinyin = pinyin_div.cloneNode(true);
	pinyin[textContent] = chars[text[j]]
	tmp.appendChild(pinyin);
	char = char_div.cloneNode(true);
	char[textContent] = text[j]
	tmp.appendChild(char);
	dummy.appendChild(tmp);     // append div.
      } else {
	tmp = blank_span.cloneNode(true);
	tmp[textContent] = text[j];
	dummy.appendChild(tmp);
      }
    }
    node.parentNode.replaceChild(dummy, node); // Replace text node
  }
}

// Get the latest character from options.
chrome.storage.sync.get({
    latest_character: '前',
  }, function(items) {
    styleTextNodes(items.latest_character,document.body);
  });



