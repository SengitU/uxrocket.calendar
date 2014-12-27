/**
 * UX Rocket
 * jQueryUI Calendar, UX Rocket plugin wrapper
 * @author Bilal Cinarli
 * @dependency jQueryUI DatePicker
 */

;(function($){
	var ux, // local shorthand

		defaults = {
			showOtherMonths: true,
			selectOtherMonths: true,
			changeMonth: true,
			changeYear: true,
            limitedDate : false,

            // callbacks
            onReady: false,
            onSelect: false,
            onClose : false
		};


	// constructor method
	var Calendar = function(el, options, selector){
		var opts = $.extend({}, defaults, options, $(el).data(), {'selector': selector}),


			// cached variables
			$el = $(el);

            // callback data options
            $.each(opts, function(index){
                var callData = index;
                if( index.indexOf('on') == 0 ){
                    opts[callData] = callback(opts[callData]);
                }
            });

        setLayout($el, opts);

        callback(opts.onReady);

        bindActions($el, opts);
    };

	var setLayout = function($el, opts){
    	var columns = '';

    	columns = ' ' + $el.context.className.replace('uxitd-calendar-ready', '');
	
    	if(opts.selector.charAt(0) == '.') {
        	columns = columns.replace(' ' + opts.selector.substr(1), '');
    	}

        if($el.parent().is('.uxitd-plugin-wrap')){
            $el.parent().addClass('uxitd-calendar-wrap' + columns + ' group');
        }
        else {
            $el.wrap('<span class="uxitd-plugin-wrap uxitd-calendar-wrap' + columns + ' group"></span>');
        }

		$el.after('<i class="icon-calendar"></i>');

		$el.next('.icon-calendar').on('click', function(){
			$el.focus();
		});
	};


	var bindActions = function($el, opts){
		var $before,
			$after;

        var onClose = opts.onClose;

		if(opts.calendarBefore != undefined){
			$before = $(opts.calendarBefore);

			opts.onClose = function(selectedDate) {
				$before.datepicker("option", "maxDate", selectedDate);
                if(typeof onClose == 'function'){
                    onClose();
                }
			}
		}


        if(opts.limitedDate){
            opts.beforeShowDay = function(date){
                var day = date.getDay();
                return [(day != 1 && day != 3 && day != 5 && day != 6 && day != 7 && day != 0)];
            }
        }

		if(opts.calendarAfter != undefined){
			$after = $(opts.calendarAfter);

			opts.onClose = function(selectedDate) {
				$after.datepicker("option", "minDate", selectedDate);
				$after.datepicker('show');
                if(typeof onClose == 'function'){
                    onClose();
                };
			}
		}

        if(opts.time == true){
            $el.datetimepicker(opts);
        }else if(opts.timeOnly){
            $el.timepicker(opts);
        }else{
            $el.datepicker(opts, $.datepicker.regional['tr']);
        }
	};

    // global callback
    var callback = function(fn){
        // if callback string is function call it directly
        if(typeof fn === 'function'){
            return fn;
        }

        // if callback defined via data-attribute, call it via new Function
        else {
            if(fn !== false){
                return new Function('return ' + fn);
            }
        }
    };

	// jquery bindings
	ux = $.fn.calendar = $.uxcalendar = function(options){
		var selector = this.selector;
		
		return this.each(function(){
			var $el = $(this),
				calendar;

            if($el.hasClass('uxitd-calendar-ready') || $el.hasClass('uxitd-plugin-wrap')){
				return;
			}

			$el.addClass('uxitd-calendar-ready');
			calendar = new Calendar(this, options, selector);
		});
	};

	// version
	ux.version = "0.8.0";

	// settings
	ux.settings = defaults;
})(jQuery);