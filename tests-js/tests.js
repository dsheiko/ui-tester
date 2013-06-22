/*
 * @package UI Tester
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
"strict mode";
var TestSuites = {
         example2: function( $ ) {
            QUnit.module("Widget UI Example");
            QUnit.test( "Components availability", function( assert ) {
                assert.nodes([
                    {node: $("section.example"),
                        assert: "exists",
                        message: "Body contains section.example"
                    },
                    {node: $("section.a-mondatory-widget"),
                        assert: "exists",
                        message: "Body contains section.a-mondatory-widget"
                    },
                    {node: $("header > h1"),
                        assert: "exists",
                        message: "Page title appears as intended"
                    },
                    {node: $("section.example .summary"),
                        assert: "exists",
                        message: "At least one of details/summary bloks available"
                    }
                ]);
            });
            QUnit.test( "Details/summary emulation", function() {
                // The nodes, we are going to deal with within the test
                var $testItem = $( $("section.example .summary")[ 0 ] ),
                    $summary = $testItem.find("> span"),
                    $details = $testItem.find("> .details");

                    notEqual( $details.is(":visible"), true, "Initialy details not visible" );
                    $summary.click();
                    equal( $details.is(":visible"), true, "Details visible after the first click" );
                    $summary.click();
                    notEqual( $details.is(":visible"), true,
                        "Back to invisible after the second click");
            });
            this.proceed();
        },

        example1: function( $ ) {
                // The nodes, we are going to deal with in the tests
            var $form = $("section.example form.signup-example"),
                $email = $form.find("input[name=email]"),
                $emailLog = $email.find("+ span"),
                $password = $form.find("input[name=password]"),
                $passwordLog = $password.find("+ span"),
                $btn = $form.find("button[type=submit]"),
                that = this;

            QUnit.module("Form UI Example");
            
             
            QUnit.test( "Components availability", function( assert ) {
                assert.nodes([
                    {node: "section.example",
                        assert: "exists",
                        message: "Body contains section.example"
                    },
                    {node: "section.a-mondatory-widget",
                        assert: "exists",
                        message: "Body contains section.a-mondatory-widget"
                    },
                    {node: "header > h1",
                        assert: "exists",
                        message: "Page title appears as intended"
                    },
                    {node: $form,
                        assert: "exists",
                        message: "Section.example contains form"
                    }
                ]);
            });

            QUnit.asyncTest( "Form handling: When incorrent email given", 4, function() {
                $email.val("incorrect email");
                $password.val("ValidPassword");
                QUnit.equal( $emailLog.is(":hidden"), true, "Error message block hidden" );
                QUnit.equal( $emailLog.text().length, 0, "..and contains no text" );
                $form.on( "validated.example", function(){
                    QUnit.equal( $emailLog.is(":visible"), true, "Error message block visible" );
                    QUnit.notEqual( $emailLog.text().length, 0, "..and contains a text message" );
                    QUnit.start();
                });
                $form.submit();
            });
            QUnit.asyncTest( "Form handling: When incorrent password given", 4, function() {
                $password.val("short");
                QUnit.equal( $passwordLog.is(":hidden"), true, "Error message block hidden" );
                QUnit.equal( $passwordLog.text().length, 0, "..and contains no text" );
                // Resubscribe
                $form.off("validated.example").on( "validated.example", function(){
                    QUnit.equal( $passwordLog.is(":visible"), true, "Error message block visible" );
                    QUnit.notEqual( $passwordLog.text().length, 0, "..and contains a text message" );
                    QUnit.start();
                });
                $form.submit();
            });

            QUnit.asyncTest( "Form handling: The button resets to the initial state after " + 
                "server response received", 2, function() {
                // Resubscribe
                $form.off("validated.example").on( "validated.example", function(){
                    QUnit.equal( $btn.text(), "OK", "Button is in the initial state" );
                    QUnit.notEqual( $btn.is(":disabled"), true, "..and enabled" );
                    QUnit.start();
                    // Pay attention proceed() must be called as the last test of the suit performed
                    that.proceed();
                });
                $form.submit();
            });
        }
};