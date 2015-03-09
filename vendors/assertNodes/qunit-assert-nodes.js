/*
 * @package Nodes assertion - QUnit plugin
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
(function( global ){
    "strict mode";
    var $ = global.jQuery,
        QUnit = global.QUnit,
        /**
         * Assertion methods
         * @namespace
         */
        assertions = {
            /**
             * Assert that the node (this) exists
             * @return {boolean}
             */
            exists: function() {
                return !!this.length;
            },
            /**
             * Assert that the node (this) is visible
             * @return {boolean}
             */
            visible: function() {
                return this.is(":visible");
            },
            /**
             * Assert that the node (this) is hidden
             * @return {boolean}
             */
            hidden: function() {
                return this.is(":hidden");
            },
            /**
             * Assert that the control (this) is in the checked state
             * @return {boolean}
             */
            checked: function() {
                return this.is(":checked");
            }
        };
    
    QUnit.extend( QUnit.assert, {
        /**
         * Compare two snippets of HTML for equality after normalization.
         *
         * @example assert.nodes([
         * { node: "#el1", assert: "exists", message: "element exists" },
         * { node: "#el2", assert: "visible", message: "element is visible" }
         * ]);
         * @param {object} query of assertions.
         */
        nodes: function( queue ) {
            var that = this;
            if ( !$.isArray( queue ) ) {
                    throw new TypeError("query parameter must be an array");
            }
            $.each( queue, function( i ){
                if ( !queue[ i ].node || !queue[ i ].assert ) {
                    throw new TypeError("query element is invalid. Must be { node: '', assert: '', message: ''}");
            }
            }); 
            $.each( queue, function( inx, request ) {
                that.ok( assertions[ request.assert ].call( request.node ), request.message );
            });
        }
    });
}( this ));