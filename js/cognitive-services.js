class ImageAnalyzer {

    constructor(endpoint, subcriptionKey) {
       this.endpoint  = endpoint;
       this.subcriptionKey = subcriptionKey;
    }

    processImage(imageUrl, success, error) {

        var uriBase = this.endpoint + "vision/v2.1/analyze";

        // Request parameters.
        var params = {
            "visualFeatures": "Categories,Description,Color",
            "details": "",
            "language": "en",
        };

        let subkey = this.subcriptionKey;
        
        // Make the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader(
                    "Ocp-Apim-Subscription-Key", subkey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + imageUrl + '"}',
        })

        .done(success)
        .fail(error);
    };
}