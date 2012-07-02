# Functional testing with qUnit

The project site: https://github.com/dsheiko/ui-tester

With this tool you can simply test UI of your jQuery-based site simulating user behaviour.

### How to use

#### Configuration

Unpack ui-tester (tests-js folder) anywhere within the same domain of your site. Specify testing
configuration in index.html

    UiTester.init( $, {
        testsuites : [
            {suit : "example1", url: "example1.html"},
            {suit : "example2", url: "example2.html"}
        ],
        wwwRoot : "./../"
    });

Where *testsuites* contains all the site pages you intend to test (*suit* - test suit variable,
defined in *tests.js* and url is the page address relative to *wwwRoot*).

#### Writing tests

Test-suits per site page (UIs) are expected in retuirn object of TestSuit function:

    var TestSuit =  function( $, proceed, extendQUnit ) {
        extendQUnit( $ );
        return {
             example1: function() {
                // qUnit tests
                proceed();
             },
             example2: function() {
                // qUnit tests
                proceed();
             },
        }
    };

Within the scope of every UI test-suit function you can write generic qUnit tests.
Besides, extendQUnit declares testNodes assertion helper, which makes on-DOM assertions more readable:

    test( "Test DOM", function() {
        testNodes([
            {node: "selector",
                assert: "exists",
                msg: "Selector found"
            },
            {node: "selector",
                assert: "visible",
                msg: "Selector visible"
            },
            {node: "selector",
                assert: "checked",
                msg: "Selector checked"
            }
        ]);
    });

Calling proceed() at the end of every UI test-suit, tells the system where to switch to the next UI.

#### Asynchronous tests

Writing asynchronous tests (e.g. checking UI reaction on XHRs caused by user action), you
follow the qUnit way (http://qunitjs.com/cookbook/). Just don't forget to call proceed() (next
to start()) as the last test of the suit performed