/*
 * @package UI Tester
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
(function( global ) {
    "strict mode";
        /* @var {object} */
    var $,
        /**
         * UI iterator
         * @class
         * @param {object} data
         */
        TestSuiteCollection = function( data ) {
            var _index = 0,
                _data = data,
                _length = _data.length;
            return {
                /**
                 * @public
                 */
                next: function() {
                    _index++;
                },
                /**
                 * @public
                 * @return {object}
                 */
                current: function() {
                    return _data[ _index ];
                },
                /**
                 * @public
                 * @return {boolean}
                 */
                isValid: function() {
                    return _index < _length && _index >= 0;
                }
            };
        };
        /**
         * Application runner
         * @return {object}
         */ 
        global.UiTester = (function() {
            var $playground,
                _collection;
            return {
                /**
                 * @public
                 * @param {object} jQuery instance
                 * @param {object} config
                 */
                init: function( jQuery, config ) {
                    $ = jQuery; // Obtain local copy of jQuery
                    _collection = TestSuiteCollection( config.testsuites );
                    $playground = $("#playground"); // '$' prefix hints at jQuery object
                    this.testNextUI();
                },
                /**
                 * Continue on the UI iterator
                 * @public
                 */ 
                proceed: function() {
                    _collection.next();
                    _collection.isValid() && this.testNextUI();
                },
                /** 
                 * Load next UI (page) into the iframe on the playground node
                 * @private
                 */ 
                testNextUI: function() {
                    var current = _collection.current();
                    $playground.empty();
                    $( '<iframe src="' + current.url + 
                        '"></iframe>' )
                        .appendTo( $playground )
                        // runTestSuite in the context of Runner
                        .bind( "load", $.proxy( this.runTestSuite, this ) ); 
                },
                /** 
                 * Run the corresponding test suit on the loaded UI
                 * @private
                 */  
                runTestSuite: function() {
                    var current = _collection.current(),
                        uiJQuery = global.frames[ 0 ].jQuery;
                    // Calling next suite in the context of the runner
                    // which gives us the access to proceed method from the test
                    current.suite.apply( this, [ uiJQuery ] );
                    //current.suite(uiJQuery);
                }
            };
    }());
    
    

}( this ));