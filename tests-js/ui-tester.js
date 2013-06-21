(function( window, undefined ) {
    "strict mode";
    var $,
        // UI iterator
        TestSuiteCollection = function( data ) {
            var _index = 0,
                _data = data,
                _length = _data.length;
            return {
                next: function() {
                    _index++;
                },
                current: function() {
                    return _data[ _index ];
                },
                isValid: function() {
                    return _index < _length && _index >= 0;
                }
            }
        },
        // Callback, which when invoked in the test suit scope, extends qUnit assertion methods
        extendQUnit = function( $ ) {
            $.extend( window, {
                testNodes : function( queue ) {
                    var assertions =  {
                        exists: function() {
                            return this.length;
                        },
                        visible: function() {
                            return this.is( ":visible" );
                        },
                        hidden: function() {
                            return this.is( ":hidden" );
                        },
                        checked: function() {
                            return this.is( ":checked" );
                        }
                    }
                    $.each(queue, function(inx, request) {
                        var node = $(request.node);
                        ok( assertions[ request.assert ].call( node ), request.msg );
                    });
                }
            });
        };
        // Application runner
        window.UiTester = (function() {
            var $playground,
                _wwwRoot,
                _collection;
            return {
                init: function( jQuery, config ) {
                    _wwwRoot = config.wwwRoot;
                    $ = jQuery; // Obtain local copy of jQuery
                    this.checkForDependencies();
                    _collection = TestSuiteCollection( config.testsuites );
                    $playground = $( "#playground" ); // '$' prefix hints at jQuery object
                    this.testNextUI();
                },
                checkForDependencies: function() {
                    var dependencies = ["TestSuit", "QUnit"],
                        i = 0,
                        len = dependencies.length;
                    for( ; i < len; i++ ) {
                        if ( window[dependencies[ i ]] === undefined ) {
                            throw new ReferenceError( dependencies[ i ] + " is not defined" );
                        }
                    }
                },
                // Continue on the UI iterator
                proceed: function() {
                    _collection.next();
                    _collection.isValid() && this.testNextUI();
                },
                // Load next UI (page) into the iframe on the playground node
                testNextUI: function() {
                    var current = _collection.current();
                    $playground.empty();
                    $('<iframe src="' + _wwwRoot + "/" + current.url
                        + '"></iframe>')
                        .appendTo($playground)
                        .bind("load", $.proxy( this.runTestSuit, this )); // runTestSuit in the context of Runner
                },
                // Run the corresponding test suit on the loaded UI
                runTestSuit: function() {
                    var current = _collection.current(),
                        uiJQuery = window.frames[0].jQuery;
                    extendQUnit( uiJQuery );
                    window.TestSuite(
                        uiJQuery, // UI's jQuery instance
                        $.proxy( this.proceed, this ) // Proceed callback in the context of Runner
                    )[ current.suit ]();
                }
            }
    }());


}( window));