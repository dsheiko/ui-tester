var TestSuit =  function( $, proceed, extendQUnit ) {
    extendQUnit( $ );
    return {
        example1: function() {
            module( "Front page" );
            test( "Front page widgets", function() {
                testNodes([
                      { node: "section.form-example",
                        assert: "exists",
                        msg: "At least one slide is present on the promo-bar"}
                ]);
            });

//            module( "Front page asynchronuously" );
//            asyncTest( "Smart-search", 1, function() {
//                $.get("/internal/smart-search.php?keys=Crytek", function(data) {
//                    ok( data.length > 0,
//                        "Smart-search for Crytek returned results" );
//                    start();
//                });
//            });

            // Workaround to pipe the un-deferred aynchronous tests
            test( null, function() {
                ok( true, "Set of async test performed");
                proceed();
            });
        }
    }
};