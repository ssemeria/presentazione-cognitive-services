class ImageAnalyzer {

    constructor(endpoint, subcriptionKey) {
       this.endpoint  = endpoint;
       this.subcriptionKey = subcriptionKey;
    }

    getBaseUriWithFeatures(){
        var uriBase = this.endpoint + "vision/v2.1/analyze";

        // Request parameters.
        var params = {
            "visualFeatures": "Categories,Description,Color",
            "details": "",
            "language": "en",
        };

        return uriBase + "?" + $.param(params)

    }

    processImage(imageUrl, success, error) {

        let subkey = this.subcriptionKey;
        
        // Make the REST API call.
        $.ajax({
            url: this.getBaseUriWithFeatures(),

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
    }

   
    uploadImage(imageFile, success, error) {

        let subkey = this.subcriptionKey;

        fetch(this.getBaseUriWithFeatures(), { // Your POST endpoint
        method: 'POST',
        headers: {
          // Content-Type may need to be completely **omitted**
          // or you may need something
          "Content-Type": "application/octet-stream",
          "Ocp-Apim-Subscription-Key": subkey
        },
        body: imageFile // This is your file object
      }).then(function(response) {
        var contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          return response.json();
        }
        throw new Error("Errore Codice " + response.status + ": " + response.statusText);
      })
      .then(success)
      .catch(error);
    }
}

function makeblob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}


class CameraHelper {

    constructor() {}

    streamToVideoElement(videoElement) {
        const constraints = {
          video: true

        };
      
        navigator.mediaDevices.getUserMedia(constraints)
          .then(function(stream) {
            videoElement.srcObject = stream;
          });

    }

    takeSnaphotToCanvas(canvas, video) {
        const context = canvas.getContext('2d');    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.srcObject.getVideoTracks().forEach(track => track.stop());
    }
}


class TextExtractor {
 
  constructor(endpoint, subcriptionKey) {
    this.endpoint  = endpoint;
    this.subcriptionKey = subcriptionKey;
 }

 getBaseUriWithFeatures(){

  const uriBase = this.endpoint + "vision/v2.1/ocr";
  return uriBase 
}

 convertResponseToTextString(data) {
  let textString = '';  
  data.regions.forEach(function(region) {
    region.lines.forEach(function(line){
      line.words.forEach(function(word) {
          textString += word.text;
          textString +=  " ";
      });
      textString += "<br>";
    });
  });
  return textString;
 }

 extractText(imageUrl, success, error) {

  let subkey = this.subcriptionKey;
  
  // Make the REST API call.
  $.ajax({
      url: this.getBaseUriWithFeatures(),

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
}

extractTextFromImage(image, success, error) {
  let subkey = this.subcriptionKey;

  fetch(this.getBaseUriWithFeatures(), { // Your POST endpoint
  method: 'POST',
  headers: {
    // Content-Type may need to be completely **omitted**
    // or you may need something
    "Content-Type": "application/octet-stream",
    "Ocp-Apim-Subscription-Key": subkey
  },
  body: image // This is your file object
}).then(function(response) {
  var contentType = response.headers.get("content-type");
  if(contentType && contentType.includes("application/json")) {
    return response.json();
  }
  throw new Error("Errore Codice " + response.status + ": " + response.statusText);
})
.then(success)
.catch(error);
}


}

class TextAnalyzer {

    constructor(endpoint, subcriptionKey) {
        this.endpoint  = endpoint;
        this.subcriptionKey = subcriptionKey;
    }

    getBaseUriLanguage() {
      const uriBase = this.endpoint + "/text/analytics/v2.1/languages";
      return uriBase
    }

    getBaseUriSentiment() {
      const uriBase = this.endpoint + "/text/analytics/v2.1/sentiment";
      return uriBase
    }


    getBaseUriKeyPhrases() {
      const uriBase = this.endpoint + "/text/analytics/v2.1/keyPhrases";
      return uriBase
    }


    detectTextLanguage(text, success, error) {
      let subkey = this.subcriptionKey;
        
      // Make the REST API call.
      $.ajax({
          url: this.getBaseUriLanguage(),

          // Request headers.
          beforeSend: function(xhrObj){
              xhrObj.setRequestHeader("Content-Type","application/json");
              xhrObj.setRequestHeader(
                  "Ocp-Apim-Subscription-Key", subkey);
          },
          type: "POST",
          // Request body.
          data: '{"documents": [{"id": 1,"text": "' +text +'"}]}'
      })
      .done(success)
      .fail(error);
    }

    detectTextSentiment(text, success, error) {
      let subkey = this.subcriptionKey;
        
      // Make the REST API call.
      $.ajax({
          url: this.getBaseUriSentiment(),

          // Request headers.
          beforeSend: function(xhrObj){
              xhrObj.setRequestHeader("Content-Type","application/json");
              xhrObj.setRequestHeader(
                  "Ocp-Apim-Subscription-Key", subkey);
          },
          type: "POST",
          // Request body.
          data: '{"documents": [{ "language": "it", "id": 1,"text": "' +text +'"}]}'
      })
      .done(success)
      .fail(error);
    }

    detectTextKeyPhrases(text, success, error) {
      let subkey = this.subcriptionKey;
        
      // Make the REST API call.
      $.ajax({
          url: this.getBaseUriKeyPhrases(),

          // Request headers.
          beforeSend: function(xhrObj){
              xhrObj.setRequestHeader("Content-Type","application/json");
              xhrObj.setRequestHeader(
                  "Ocp-Apim-Subscription-Key", subkey);
          },
          type: "POST",
          // Request body.
          data: '{"documents": [{ "language": "it", "id": 1,"text": "' +text +'"}]}'
      })
      .done(success)
      .fail(error);
    }
}