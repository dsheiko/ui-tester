"strict mode";
var TestSuit =  function( $, proceed, extendQUnit ) {
    extendQUnit( $ );
    return {
         example2: function() {

            module( "Page integrity" );
            test( "Components availability", function() {
                testNodes([
                    {node: "section.example",
                        assert: "exists",
                        msg: "Body contains section.example"
                    },
                    {node: "section.a-mondatory-widget",
                        assert: "exists",
                        msg: "Body contains section.a-mondatory-widget"
                    },
                    {node: "header > h1",
                        assert: "exists",
                        msg: "Page title appears as intended"
                    },
                    {node: "section.example .summary",
                        assert: "exists",
                        msg: "At least one of details/summary bloks available"
                    },
                ]);
            });
            test( "Details/summary emulation", function() {
                // The nodes, we are going to deal with within the test
                var $testItem = $( $( "section.example .summary" )[0] ),
                    $summary = $testItem.find("> span"),
                    $details = $testItem.find("> .details");

                    notEqual( $details.is(":visible"), true, "Initialy details not visible" );
                    $summary.click();
                    equal( $details.is(":visible"), true, "Details visible after the first click" );
                    $summary.click();
                    notEqual( $details.is(":visible"), true,
                        "Back to invisible after the second click" );
            });
            proceed();
        },

        example1: function() {
            // The nodes, we are going to deal with in the tests
            var $form = $( "section.example form.signup-example" ),
                $email = $form.find( "input[name=email]" ),
                $emailLog = $email.find( "+ span" ),
                $password = $form.find( "input[name=password]" ),
                $passwordLog = $password.find( "+ span" ),
                $btn = $form.find( "button[type=submit]" );

            module( "Page integrity" );
            test( "Components availability", function() {
                testNodes([
                    {node: "section.example",
                        assert: "exists",
                        msg: "Body contains section.example"
                    },
                    {node: "section.a-mondatory-widget",
                        assert: "exists",
                        msg: "Body contains section.a-mondatory-widget"
                    },
                    {node: "header > h1",
                        assert: "exists",
                        msg: "Page title appears as intended"
                    },
                    {node: $form,
                        assert: "exists",
                        msg: "Section.example contains form"
                    },
                ]);
            });

            module( "Form handling" );

            asyncTest( "When incorrent email given", 4, function() {
                $email.val( "incorrect email" );
                $password.val( "ValidPassword" );
                equal( $emailLog.is(":hidden"), true, "Error message block hidden" );
                equal( $emailLog.text().length, 0, "..and contains no text" );
                $form.on("validated.example", function(){
                    equal( $emailLog.is(":visible"), true, "Error message block visible" );
                    notEqual( $emailLog.text().length, 0, "..and contains a text message" );
                    start();
                });
                $form.submit();
            });
            asyncTest( "When incorrent password given", 4, function() {
                $password.val( "short" );
                equal( $passwordLog.is(":hidden"), true, "Error message block hidden" );
                equal( $passwordLog.text().length, 0, "..and contains no text" );
                // Resubscribe
                $form.off("validated.example").on("validated.example", function(){
                    equal( $passwordLog.is(":visible"), true, "Error message block visible" );
                    notEqual( $passwordLog.text().length, 0, "..and contains a text message" );
                    start();
                });
                $form.submit();
            });
            asyncTest( "Submit button indicates loading while form waits server response", 4,
                function() {
                equal( $btn.text(), "OK", "Button is in the initial state" );
                notEqual( $btn.is(":disabled"), true, "..and enabled" );
                $form.on("submit", function() {
                    // Checking with a slight latency. The button is expected to change
                    // state right after onSubmit event hapens (but not before)
                    window.setTimeout(function() {
                        notEqual( $btn.text(), "OK", "Button is in the loading state" );
                        equal( $btn.is(":disabled"), true, "..and disabled" );
                        start();
                    }, 10);
                });
                $form.submit();
            });
            asyncTest( "The button resets to the initial state after server response received", 2,
                function() {
                // Resubscribe
                $form.off("validated.example").on("validated.example", function(){
                    equal( $btn.text(), "OK", "Button is in the initial state" );
                    notEqual( $btn.is(":disabled"), true, "..and enabled" );
                    start();
                });
                $form.submit();
            });

            // Workaround to pipe the un-deferred aynchronous tests
            module( null );
            test( null, function() {
                ok( true, "Set of async tests performed");
                proceed();
            });
        }

    }
};