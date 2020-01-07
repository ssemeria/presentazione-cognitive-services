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


class SpeechAnalyzer {
  
  constructor(subcriptionKey) {
    this.subcriptionKey = subcriptionKey;
  }

  getBaseUriSpeech() {
    return "https://westeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=it-IT&format=detailed"
  }

  analyzeSpeech(audio, success, error) {
    let subkey = this.subcriptionKey;
        
    fetch(this.getBaseUriSpeech(), { // Your POST endpoint
      method: 'POST',
      headers: {
        // Content-Type may need to be completely **omitted**
        // or you may need something
        "Content-Type": "audio/wav; codecs=audio/pcm",
        "Accept": "application/json",
        "Ocp-Apim-Subscription-Key": subkey
      },
      body: audio // This is your file object
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


class SpeechSynthesizer {
  constructor(subcriptionKey) {
    this.subcriptionKey = subcriptionKey;
  }


  getBaseUriSpeech() {
    return "https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1"
  }


  speak(text, success, error) {
    var that = this;
    let subkey = this.subcriptionKey;
    var authUrl = "https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken";

     // Make the REST API call.
     $.ajax({
      url: authUrl,

      // Request headers.
      beforeSend: function(xhrObj){
        //  xhrObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subkey);
      },
      type: "POST",
    })
  .done(function(token) {
      
    fetch(that.getBaseUriSpeech(), { // Your POST endpoint
      method: 'POST',
      headers: {
        // Content-Type may need to be completely **omitted**
        // or you may need something
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
        "Authorization": "Bearer " + token
      },
      body: "<speak version='1.0' xml:lang='it-IT'><voice xml:lang='it-IT' xml:gender='Female' name='it-IT-ElsaNeural'>" +
              text +
            "</voice></speak>"
    }).then(function(response) {
       return response.blob();
    })
    .then(success)
    .catch(error);    
  })
  .fail(error); 

  }

}