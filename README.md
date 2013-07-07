jQuery Dialog v1.0.0
====================

Dialog in jQuery: Show, hide, repaint and destroy DOM content in an interactive overlay.

## Usage

### Include

Include the dialog plugin file after jQuery on your HTML page.

```html
<script src="jquery.min.js"></script>
<script src="jquery.dialog-1.0.0.min.js"></script>
```

### Invoke

* Initilize without an object of options:
```
$('.element').dialog();
```
* Initilize extending the default options:
```
$('.element').dialog({
  close: elementModal.find('.js-close'),
  class: 'jquery-dialog-overlay',
  overlay: function () {
    return '<div id="js-overlay" class="' + settings.class + '"></div>';
  }
});
```
* Initilize and callback:
```
$('.element').dialog('open', callback, options);
```
* Close and callback:
```
$('.element').dialog('close', callback, options);
```
* Removes the modal element and the overlay and callback:
```
$('.element').dialog('destroy', callback, options);
```
* Initilizes and caches the $(this) object initial state as a string to repain itself after close and a callback:
```
$('.element').dialog('repaint', callback, options);
```

## Autors

* Virginia Blesa
* Víctor García: [git.io/gcv](https://github.com/gc-victor), [@gcv](http://twitter.com/gcv)

## Licencia

Public domain: [http://unlicense.org/](http://unlicense.org/)