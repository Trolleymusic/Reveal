// Reveal
// http://github.com/Trolleymusic/Reveal
(function( $ ) {
	$.fn.Reveal = (function (settings) {
		var Reveal = function (element, settings) {
			var _offsets,
				_elements,
				_scrollPadding,
				_hideClass;
				
			this.Init = function (element, settings) {
				var r,
					selector,
					windowH,
					threshold;
				
				r = this;
				
				settings = settings || {};
				
				_hideClass = settings.hideClass || 'waiting-for-reveal';
				_scrollPadding = settings.scrollPadding || -50;

				selector = $((element || (settings.selector || '[data-reveal]')));
				
				_elements = [];
				_offsets = [];
				
				windowH = $(window).height();
				
				threshold = this.Threshold($(window).scrollTop(), windowH);

				// Fill _elements with the elements that have to reveal
				//   and fill _offsets with their coresponding offsets
				selector.each(function () {
					// get the element offset.top
					var offset = $(this).offset().top;
					
					// If it's already on the screen, don't bother hiding it
					if (offset < threshold) { return; }
					
					// Add the element to _elements
					_elements.push($(this));
					// Add the offset().top to _offsets
					_offsets.push(offset);
					// Add a class to all the element
					$(this).addClass(_hideClass);
				});
				
				// If there are no elements to scroll, there's no point in sorting
				//	the arrays or binding the elements
				if (!_offsets.length) { return; }
				
				// Sort the arrays by offset to optimise them
				// yes... todo...
				
				// Reverse the arrays so that onScroll can use pop
				_elements.reverse();
				_offsets.reverse();

				$(window).on('scroll', function () {
					// I'm passing these now so that we don't have to reference $(window) again
					r.onScroll($(this).scrollTop(), $(this).height());
				});
			}
			
			this.Threshold = function (scrollTop, windowH) {
				return scrollTop + windowH + (_scrollPadding || 0);
			}
			
			this.onScroll = function (scrollTop, windowH) {
				var i,
					elements,
					scrollH;
				
				// If there's nothing in the _offsets array, return;
				if (!_offsets.length) { return; }
					
				// Create object so that we can remove all the classes on one line
				elements = $();
				
				// What's the scrollTop + windowH so that we reveal the elements just as they've
				//	crossed the scroll line -- take into account any _scrollPadding
				scrollH = this.Threshold(scrollTop, windowH);
				
				// find matches in _offsets
				for (var i = _offsets.length; i >= 0; i--) {
					// If the _offset is > scrollH
					if (_offsets[i] < scrollH) {
						// find corresponding matches in _elements
						// remove the entry from _offsets & _elements
						elements = elements.add(_elements.pop())
						_offsets.pop();
					}
				}
				
				// add or remove a class (probably remove)
				elements.removeClass(_hideClass);

			}
			
			this.Init(element, settings);
					
		}
		return new Reveal(this, settings);
	});
})( jQuery );