/**
 * @license http://unlicense.org/ Released under Unlicense
 *
 * jQuery Dialog v.1.0.0
 * jquery.dialog-1.0.0.min.js
 *
 * @version v.1.0.0
 * @author V\u00edctor Garc\u00eda
 *         Twitter: @gcv
 *         GitHub: git.io/gcv (gc-victor)
 *
 * @param {string} open, {function}, {object} options
 * @param {string} close, {function}, {object} options
 * @param {string} destroy, {function}, {object} options
 * @param {string} repaint, {function}, {object} options
 * @param {object} options extends default settings (close, class and overlay)
 *
 * @example $('.element').dialog();
 * @description Initilize without an object of options
 *
 * @example $('.element').dialog({
 *            close: elementModal.find('.js-close'),
 *            class: 'jquery-dialog-overlay',
 *            overlay: function () {
 *              return '<div id="js-overlay" class="' + settings.class + '"></div>';
 *            }
 *          });
 * @description Initilize with an object of options
 *
 * @example $('.element').dialog('open', callback, options);
 * @description Initilize and callback
 *
 * @example $('.element').dialog('close', callback, options);
 * @description Close and callback
 *
 * @example $('.element').dialog('destroy', callback, options);
 * @description Removes the modal element and the overlay and callback
 *
 * @example $('.element').dialog('repaint', callback, options);
 * @description Repaint: initilizes and caches the $(this) object initial state
 *              as a string to repain itself after close and a callback
 */

(function ($) {

  'use strict';

  $.fn.dialog = function (method) {
    var initialize,

      // DOM Elements
      elementWindow,
      elementBody,
      elementModal,
      elementCached,
      elementOverlay,

      // Default options
      settings,

      // List of events
      eventHandlerKey,
      eventOff,
      eventOnKey,
      eventOnKeyDownESC,

      // What is going to be done
      actionCreate,
      actionCenter,
      actionShow,
      actionHide,
      actionReplace,
      actionThen,

      // Object of public methods
      methods;

    /**
     * Element
     * @description Cached DOM Elements
     * @private
     */
    elementWindow = $(window);
    elementBody = $('body');
    // Modal container
    elementModal = $(this);

    // If the modal container don't exist
    if (!elementModal.length) {

      return;
    }

    // Add ARIA attributes to be cached by elementCached
    elementModal.attr('role', 'alertdialog')
      .attr('tabindex', -1)
      .attr('aria-hidden', true);
    // Initial modal state as a string to repaint itself
    elementCached = elementModal[0].outerHTML;
    // elementOverlay once is created
    elementOverlay = $('#js-overlay');

    /**
     * Settings
     * @description Customizable options
     * @public
     */
    settings = {

      close: elementModal.find('.js-close'),
      overlayClass: 'jquery-dialog-overlay',
      overlay: function () {

        return '<div id="js-overlay" class="' + settings.overlayClass + '"></div>';
      }
    };

    /**
     * Events
     * @description Events used to invoke actions
     * @private
     */

    // A function to execute when the event is triggered
    eventHandlerKey = function (event) {

      var data = event.data;

      if (event.keyCode === data.key) {

        data.callback({
          element: data.element,
          event: event,
          extra: data.extra
        });
      }
    };

    // Remove an event handler
    eventOff = function (event, element) {

      element.off(event);
    };

    // Attach eventsHandlerOnKey for one or more events to the selected element.
    eventOnKey = function (event, key, element, callback, extra) {

      element.on(
        event,
        {
          key: key,
          element: element,
          callback: callback,
          extra: extra
        },
        eventHandlerKey
      );
    };

    // On "ESC" keydown
    eventOnKeyDownESC = function (element, callback, extra) {

      // Namespace dialogESC
      eventOnKey('keydown.dialogESC', 27, element, callback, extra);
    };

    /**
     * Action
     * @description What the plugin is going to do
     * @private
     */

    // Creates the overlay
    actionCreate = function () {

      elementBody.append(settings.overlay);
    };

    // Center the model window
    actionCenter = function () {

      var winwWidth, winwHeight, modalWidth, modalHeight, left, top;

      winwWidth = elementWindow.width();
      winwHeight = elementWindow.height();

      modalWidth = elementModal.prop('scrollWidth');
      modalHeight = elementModal.prop('scrollHeight');

      left = (winwWidth - modalWidth) / 2;
      top = (winwHeight - modalHeight) / 2;

      elementModal.css({
        'left': left,
        'margin': 0,
        'top': top
      });
    };

    // Shows the modal and the overlay
    actionShow = function () {

      // Checks the jQuery object data.hide state
      if (elementModal.data('hide')) {

        elementOverlay.show();

        elementModal.show()
          .data('hide', 0)
          .attr('tabindex', 0)
          .attr('aria-hidden', false)
          .css('visibility', 'visible');
      }
    };

    // Hides the modal and the overlay
    actionHide = function () {

      // Checks the jQuery object data.hide state
      if (!elementModal.data('hide')) {

        elementOverlay.fadeOut(350);

        elementModal.fadeOut(250, function () {

          $(this).trigger('isClosed');

          // Adds to the jQuery object data.hide the state 1 (true) and ARIA
          // attributes values
          elementModal.data('hide', 1)
            .attr('tabindex', -1)
            .attr('aria-hidden', true);

          eventOff('keydown.dialogESC', elementBody);
        });
      }
    };

    actionReplace = function () {

      elementModal.replaceWith(elementCached);
    };

    // Invokes the remaining action and applying events to the DOM
    actionThen = function () {

      // Adds to the jQuery object data.hide the state 1 (true)
      elementModal.data('hide', 1);

      // If overlay don't exists create it
      if (!elementOverlay.length) {

        actionCreate();

        // After create it on the DOM we get it
        elementOverlay = $('#js-overlay');
      }

      // Show an center the modal window
      actionShow();
      actionCenter();

      // Center when the window is resized
      elementWindow.resize(function () {

        actionCenter();
      });

      // Hide on click the close button
      settings.close.off();
      settings.close.on('click', actionHide);

      // Hide on click the overlay layer
      elementOverlay.on('click', actionHide);

      // Hide on keydown "ESC"
      eventOnKeyDownESC(elementBody, actionHide);
    };

    /**
     * Methods
     * @description Methods invoked as options
     * @public
     */
    methods = {

      // @constructor
      init: function (options) {

        if (options) {

          // Extends deafult settings
          settings = $.extend(settings, options);
        }

        return actionThen();
      },

      open: function (callback, options) {

        methods.init(options);

        return callback ? callback() : '';
      },

      close: function (callback, options) {

        actionHide();

        return callback ? callback() : '';
      },

      repaint: function (callback, options) {

        methods.init(options);

        elementModal.on('isClosed', actionReplace);

        return callback ? callback() : '';
      },

      destroy: function (callback, options) {

        elementModal.remove();
        elementOverlay.remove();

        return callback ? callback() : '';
      }
    };

    initialize = function (args) {

      var array;

      if (methods[method]) {

        array = [].slice.call(args, 1);

        return methods[method].apply(this, array);

      } else {

        if (typeof method === 'object' || !method) {

          return methods.init.apply(this, args);

        } else {

          $.error('Error: ' + elementModal);
        }
      }
    };

    return initialize(arguments);
  };
}(window.jQuery));
