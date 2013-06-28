[![browser support](http://ci.testling.com/yr/style.png)](http://ci.testling.com/yr/style)

Cross-browser css manipulation.

## Usage
```javascript
var style = require('style');

var el = document.getElementById('myEl');
var bgColor = style.getStyle(el, 'background-color'); // => '#ffffff'
var left = style.getNumericStyle(el, 'left'); // => [75, 'px']
style.setStyle(el, 'left', 80);
style.clearStyle(el, 'left');
```