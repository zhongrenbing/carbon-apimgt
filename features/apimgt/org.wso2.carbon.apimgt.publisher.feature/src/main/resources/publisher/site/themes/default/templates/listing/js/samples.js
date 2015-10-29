function APISamples(defaultTier) {
    this.sample1_swagger = "{\"paths\":{\"/add\":{\"get\":{\"summary\":\"add x and y\", " +
    "\"x-auth-type\":\"Application & Application User\",\"x-throttling-tier\":\"Unlimited\", " +
    "\"produces\":\"application/json\",\"parameters\":[{\"name\":\"x\",\"required\":true, " +
    "\"type\":\"string\",\"in\":\"query\"},{\"name\":\"y\",\"required\":true,\"type\": " +
    "\"string\",\"in\":\"query\"}],\"responses\":{\"200\":{}}}},\"/subtract\":{\"get\":{ " +
    "\"summary\":\"subtract y from x\",\"x-auth-type\":\"Application & Application User\", " +
    "\"x-throttling-tier\":\"Unlimited\",\"produces\":\"application/json\",\"parameters\":[{ " +
    "\"name\":\"x\",\"required\":true,\"type\":\"string\",\"in\":\"query\"},{\"name\":\"y\", " +
    "\"required\":true,\"type\":\"string\",\"in\":\"query\"}],\"responses\":{\"200\":{}}}}," +
    "\"/multiply\":{\"get\":{\"summary\": \"multiply x by y\",\"x-auth-type\":" +
    "\"Application & Application User\", \"x-throttling-tier\":\"Unlimited\",\"produces\":" +
    "\"application/json\",\"parameters\":[{ \"name\":\"x\",\"required\":true,\"type\":" +
    "\"string\",\"in\":\"query\"},{\"name\":\"y\", \"required\":true,\"type\":\"string\"," +
    "\"in\":\"query\"}],\"responses\":{\"200\":{}}}}, \"/divide\":{\"get\":{\"summary\":" +
    "\"divide x by y\",\"x-auth-type\": \"Application & Application User\"," +
    "\"x-throttling-tier\":\"Unlimited\",\"produces\": \"application/json\",\"parameters\":[{ " +
    "\"name\":\"x\",\"required\":true,\"type\": \"string\",\"in\":\"query\"},{\"name\":\"y\", " +
    "\"required\":true,\"type\":\"string\",\"in\": \"query\"}],\"responses\":{\"200\":{}}}}}, " +
    "\"swagger\":\"2.0\",\"info\":{\"title\": \"Calculator\",\"description\": " +
    "\"Simple calculator API to perform addition, subtraction, multiplication and division.\", " +
    "\"version\":\"1.0\"},\"basePath\":\"/calc/1.0\",\"host\":\"localhost:8243\"}";
}


APISamples.prototype.deploySample1 = function (defaultTier) {
    var addAPIUrl = "/site/blocks/item-design/ajax/add.jag";
    var addAPIData = {action: 'sampleDesign', name: 'CalculatorAPI', provider: username,
        version: '1.0', description: 'Simple calculator API to perform addition, subtraction, ' +
        'multiplication and division.', tags: 'calculator', visibility: 'public', context: 'calc',
        swagger: this.sample1_swagger, apiThumb: '/site/themes/default/images/calculatorAPI.png'};

    jagg.message({
        content:"" ,
        type:"info",
        title:""
    });
    $('#messageModal').modal({backdrop: 'static', keyboard: false });
    $(".modal-header .close").hide();
    $(".modal-footer").html("");
    $(".modal-title").html("Please wait");
    $(".modal-body").addClass("loadingButton");
    $(".modal-body").css({"margin-left": 25});
    $(".modal-body").html("Sample API is Deploying");
    $(".modal").css({width: 550});

    //add the sample api
    jagg.post(addAPIUrl, addAPIData,
        function (apiAddResult) {
            if (!apiAddResult.error) {
                var urlDesign = '/site/blocks/item-design/ajax/add.jag';
                jagg.post(urlDesign, {action: "implement", name: "CalculatorAPI", version: "1.0",
                provider: username,  implementation_methods: "endpoint", endpoint_type: "http",
                endpoint_config: '{"production_endpoints":{"url": ' +
                '"http://localhost:9763/apimgt-calculator-api/api","config":null}, ' +
                '"sandbox_endpoints":{"url":"http://localhost:9763/apimgt-calculator-api/api", ' +
                '"config":null}, "endpoint_type":"http"}', production_endpoints:
                "http://localhost:9763/apimgt-calculator-api/api", sandbox_endpoints:
                "http://localhost:9763/apimgt-calculator-api/api", endpointType: "nonsecured",
                swagger: this.sample1_swagger},
                    function (result) {
                        jagg.post(urlDesign, {action: "manage", name: "CalculatorAPI",
                            provider: username, version: "1.0", default_version_checked: " ",
                            tier: defaultTier, tiersCollection: defaultTier,
                            transport_http: "http", transport_https: "https",
                            swagger: this.sample1_swagger},
                            function (result) {
                                if (isPublishPermitted) {
                                    var urlPublished = "/site/blocks/life-cycles/ajax/life-cycles.jag";
                                    var result2 = jagg.post(urlPublished, {action: "updateStatus",
                                        name: "CalculatorAPI", version: "1.0", provider: username,
                                        status: "Publish", publishToGateway: true,
                                        requireResubscription: true},
                                        function (result) {
                                            if (!result.error) {
                                                window.location.assign(siteContext + "/site/pages/index.jag");
                                                $(".modal-body").removeClass("loadingButton");
                                                jagg.message({
                                                    content: "Sample CalculatorAPI is Deployed Successfully",
                                                    type: "info",
                                                    title: "Success"
                                                });
                                            }
                                        }, 'json');
                                } else {
                                    window.location.assign(siteContext + "/site/pages/index.jag");
                                    $(".modal-body").removeClass("loadingButton");
                                    jagg.message({
                                        content: "Sample CalculatorAPI is Deployed Successfully",
                                        type: "info",
                                        title: "Success"
                                    });
                                }
                            }, 'json');
                    }, 'json');
            } else {
                $(".modal-body").removeClass("loadingButton");
                jagg.message({
                    content: "Error occurred while adding sample API",
                    type: "error",
                    title: "Error"
                });
            }
        }, 'json');
};

var deploySampleApi = function (defaultTier) {
    var deployer = new APISamples(defaultTier);
    deployer.deploySample1(defaultTier);
};