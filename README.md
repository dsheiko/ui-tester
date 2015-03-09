# Functional testing with qUnit

The project site: https://github.com/dsheiko/ui-tester

With this tool you can simply test UI of your jQuery-based site simulating user behaviour.

### How to use

#### Configuration

Unpack ui-tester (tests-js folder) anywhere within the same domain of your site. Specify testing
configuration in index.html
```
    UiTester.init( $, {
        testsuites : [
            {suite : example1, url: "../ui-form-example.html"},
            {suite : example2, url: "../ui-widget-example.html"}
        ]
    });
```
Whereas example 1 and example 2 functions running a suite of tests.

#### Writing tests

```

    var example1: function( $ ) {
           // qUnit tests
           this.proceed();
        },
        example2: function( $ ) {
           // qUnit tests
           this.proceed();
        };
```
Within the scope of every UI test-suit function you can write generic qUnit tests.
Besides, using assert.nodes QUnit plugin you can write multiple assertions on
nodes like that:
```
    test( "Test DOM", function( assert ) {
        assert.nodes([
            {   node: "selector",
                assert: "exists",
                message: "Selector found"
            },
            {   node: "selector",
                assert: "visible",
                message: "Selector visible"
            },
            {   node: "selector",
                assert: "checked",
                message: "Selector checked"
            }
        ]);
    });
```
Calling this.proceed() at the end of every UI test-suit, tells the system where to switch to the next UI.

#### Asynchronous tests

Writing asynchronous tests (e.g. checking UI reaction on XHRs caused by user action), you
follow the qUnit way (http://qunitjs.com/cookbook/). Just don't forget to call proceed() (next
to start()) as the last test of the suit performed

[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/ui-tester)](http://githalytics.com/dsheiko/ui-tester)