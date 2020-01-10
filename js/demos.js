function showDialog(title, message) {
    $('#modal-title').text(title);
    $('#modal-message').html(message);
    $('#modal-dialog.modal').modal();
    $('#modal-dialog.modal').modal('open');
}

function initDemoAnalisiImmagine() {
    $('#input_image_url').off('blur');
    $('#input_image_url').on('blur', function() {
        if ($(this)[0].checkValidity()) {
          var url = $(this).val();
          $('#img_preview')[0].src = url;
          $('#lnkAnalyze').show();
          $('#img_preview').removeClass('hide');
        } 
        else 
        {
          $('#lnkAnalyze').hide();
        }
    });

    $('#lnkAnalyze').off('click');
    $('#lnkAnalyze').on('click', function() {
       // Called each time the slide with the "stats" state is made visible
       const analyzer = new ImageAnalyzer(endpoint, subKey);
       var sourceImageUrl = $('#img_preview')[0].src; 

        analyzer.processImage(sourceImageUrl, 
              function(data) {
              $("#code_json").text(JSON.stringify(data, null, 2));
              hljs.highlightBlock($("#code_json")[0]);

              },
              function(jqXHR, textStatus, errorThrown) {
              // Display error message.
              var errorString =
                errorThrown === ""
                ? "Error. "
                : errorThrown + " (" + jqXHR.status + "): ";
              errorString +=
                jqXHR.responseText === ""
                ? ""
                : jQuery.parseJSON(jqXHR.responseText).message;
              alert(errorString);
              }
            );
    }); 
    
    const fileInput = document.getElementById('input-file');
    var file=null;

    fileInput.addEventListener('change', function(e) { 
        var files = e.target.files;
       
        for (let i = 0; i < files.length; i++) {
          if (files[i].type.match(/^image\//)) {
            file = files[i];
            break;
          }
        }

        if (file !== null) {
          $('#img_preview_upload')[0].src = URL.createObjectURL(file);
          $('#lnkAnalyze_upload').show();
          $('#img_preview_upload').removeClass('hide');
        }
    });
    
    $('#lnkAnalyze_upload').off('click');
    $('#lnkAnalyze_upload').on('click', function() {
       // Called each time the slide with the "stats" state is made visible
       const analyzer = new ImageAnalyzer(endpoint, subKey);
       var sourceImageUrl = $('#img_preview_upload')[0].src; 

        analyzer.uploadImage(file, 
              function(data) {
              $("#code_json_upload").text(JSON.stringify(data, null, 2));
              hljs.highlightBlock($("#code_json_upload")[0]);

              },
              function(errorThrown) {
              // Display error message.
              var errorString =
                errorThrown === ""
                ? "Error. "
                : errorThrown;

              alert(errorString);
              }
            );
    }); 

    $('#lnkSnapshot_camera').off('click');
    $('#lnkSnapshot_camera').on('click', function() {
      var cameraHelper = new CameraHelper();
      var video = $('#video_preview_camera')[0];
      var canvas = $('#preview_canvas')[0];
      cameraHelper.takeSnaphotToCanvas(canvas, video);
      $('#video_preview_camera').hide();
      $('#lnkAnalyze_camera').show();
      $('#lnkSnapshot_camera').hide();

    });

    $('#lnkAnalyze_camera').off('click');
    $('#lnkAnalyze_camera').on('click', function() {
      const analyzer = new ImageAnalyzer(endpoint, subKey);
       var sourceImageUrl = $('#img_preview_upload')[0].src; 
       var picture = $('#preview_canvas')[0];
       
        analyzer.uploadImage(makeblob(picture.toDataURL()), 
              function(data) {
              $("#code_json_camera").text(JSON.stringify(data, null, 2));
              hljs.highlightBlock($("#code_json_camera")[0]);

              },
              function(errorThrown) {
              // Display error message.
              var errorString =
                errorThrown === ""
                ? "Error. "
                : errorThrown;

              alert(errorString);
              }
            );
    });

    //init tabs
    $('.tabs').tabs({ onShow: function(tab) {
       if (tab.id === 'div-camera'){
        var canvas = $('#preview_canvas')[0];
        const context = canvas.getContext('2d');  
        context.clearRect(0, 0, canvas.width, canvas.height);
        $('#video_preview_camera').show();
         var cameraHelper = new CameraHelper();
         cameraHelper.streamToVideoElement($('#video_preview_camera')[0]);
         $('#lnkAnalyze_camera').hide();
       }
    }});
}

function initDemoEstrazioneTesto() {
    $('#input_text_url').off('blur');
    $('#input_text_url').on('blur', function() {
        if ($(this)[0].checkValidity()) {
          var url = $(this).val();
          $('#img_text_preview')[0].src = url;
          $('#lnkTextAnalyze').show();
          $('#img_text_preview').css("visibility","visible");
        } 
        else 
        {
          $('#lnkTextAnalyze').hide();
        }
    });

    $('#lnkTextAnalyze').off('click');
    $('#lnkTextAnalyze').on('click', function() {
       // Called each time the slide with the "stats" state is made visible
       const extractor = new TextExtractor(endpoint, subKey);
       var sourceImageUrl = $('#img_text_preview')[0].src; 

       extractor.extractText(sourceImageUrl, 
              function(data) {     
                showDialog("Testo Estratto",extractor.convertResponseToTextString(data));
              },
              function(jqXHR, textStatus, errorThrown) {
              // Display error message.
              var errorString =
                errorThrown === ""
                ? "Error. "
                : errorThrown + " (" + jqXHR.status + "): ";
              errorString +=
                jqXHR.responseText === ""
                ? ""
                : jQuery.parseJSON(jqXHR.responseText).message;
              alert(errorString);
              }
            );
    }); 
    
    $('#lnkTextSnapshot_camera').off('click');
    $('#lnkTextSnapshot_camera').on('click', function() {
      var cameraHelper = new CameraHelper();
      var video = $('#video_preview_text_camera')[0];
      var canvas = $('#preview_text_canvas')[0];
      $('#preview_text_canvas').show();
      cameraHelper.takeSnaphotToCanvas(canvas, video);
      $('#video_preview_text_camera').hide();
      $('#lnkTextAnalyze_camera').show();
      $('#lnkTextSnapshot_camera').hide();

    });

    $('#lnkTextAnalyze_camera').off('click');
    $('#lnkTextAnalyze_camera').on('click', function() {
      const extractor = new TextExtractor(endpoint, subKey); 
       var picture = $('#preview_text_canvas')[0];
       
       extractor.extractTextFromImage(makeblob(picture.toDataURL()), 
              function(data) {
                showDialog("Testo Estratto",extractor.convertResponseToTextString(data));
              },
              function(errorThrown) {
              // Display error message.
              var errorString =
                errorThrown === ""
                ? "Error. "
                : errorThrown;

              alert(errorString);
              }
            );
    });

    //init tabs
    $('#demo-text.tabs').tabs({ onShow: function(tab) {
        if (tab.id === 'div-text-camera'){
         var canvas = $('#preview_text_canvas')[0];
         const context = canvas.getContext('2d');  
         context.clearRect(0, 0, canvas.width, canvas.height);
         $('#video_preview_text_camera').show();
          var cameraHelper = new CameraHelper();
          cameraHelper.streamToVideoElement($('#video_preview_text_camera')[0]);
          $('#lnkTextAnalyze_camera').hide();
          $('#lnkTextSnapshot_camera').show();
          $('#preview_text_canvas').hide();
        }
    }});

  
}

function initDemoAnalisiComprensioneTesto() {
   $('#textarea_content').off('change');
   $('#textarea_content').on('change', function() {
    $('#lnkLang').toggle($('#textarea_content').val().trim().length > 0);
    $('#lnkLangSent').toggle($('#textarea_content').val().trim().length > 0);
    $('#legenda').toggle($('#textarea_content').val().trim().length > 0);
    $('#lnkLangKeyPhrases').toggle($('#textarea_content').val().trim().length > 0);
   });

   $('#lnkLang').off('click');
   $('#lnkLang').on('click', function() {
     let text = $('#textarea_content').val().trim();
     let analyzr = new TextAnalyzer(endpoint, subKey);
     analyzr.detectTextLanguage(text, 
      function(data) {
        $("#text_anal_code_json").text(JSON.stringify(data, null, 2));
        hljs.highlightBlock($("#text_anal_code_json")[0]);

        },
        function(errorThrown) {
        // Display error message.
        var errorString =
          errorThrown === ""
          ? "Error. "
          : errorThrown;

        alert(errorString);
      }
    );
   });

   $('#lnkLangSent').off('click');
   $('#lnkLangSent').on('click', function() {
     let text = $('#textarea_content').val().trim();
     let analyzr = new TextAnalyzer(endpoint, subKey);
     analyzr.detectTextSentiment(text, 
      function(data) {
        $("#text_anal_code_json").text(JSON.stringify(data, null, 2));
        hljs.highlightBlock($("#text_anal_code_json")[0]);

        },
        function(errorThrown) {
        // Display error message.
        var errorString =
          errorThrown === ""
          ? "Error. "
          : errorThrown;

        alert(errorString);
      }
    );
   });

   $('#lnkLangKeyPhrases').off('click');
   $('#lnkLangKeyPhrases').on('click', function() {
     let text = $('#textarea_content').val().trim();
     let analyzr = new TextAnalyzer(endpoint, subKey);
     analyzr.detectTextKeyPhrases(text, 
      function(data) {
        $("#text_anal_code_json").text(JSON.stringify(data, null, 2));
        hljs.highlightBlock($("#text_anal_code_json")[0]);

        },
        function(errorThrown) {
        // Display error message.
        var errorString =
          errorThrown === ""
          ? "Error. "
          : errorThrown;

        alert(errorString);
      }
    );
   });
}


var mic = new Microphone();

function initDemoAnalisiParlato() {

  $('#startRecording').off('click');
  $('#startRecording').on('click', function() {
    $('#stopRecording').removeClass('hide');
    $('#startRecording').addClass('hide');
    
    mic.recordAudio();
  
  });

  $('#stopRecording').off('click');
  $('#stopRecording').on('click', function() {
    mic.stopRecording($('#player')[0]);
    $('#stopRecording').addClass('hide');
    $('#startRecording').removeClass('hide');

    mic.fetchAudioDataAsWave(function(waveData){
      $('#player')[0].src = URL.createObjectURL(waveData);
      $('#lnkTranscribe').removeClass('hide');
    });
  });

  $('#lnkTranscribe').off('click');
  $('#lnkTranscribe').on('click', function() {
      var waveData = mic.rawWaveData;
      var analyzer = new SpeechAnalyzer(subKey);
      analyzer.analyzeSpeech(waveData,  
        function(data) {
          $("#audio_text_code_json").text(JSON.stringify(data, null, 2));
          hljs.highlightBlock($("#audio_text_code_json")[0]);
  
        },
        function(errorThrown) {
        // Display error message.
        var errorString =
          errorThrown === ""
          ? "Error. "
          : errorThrown;
  
        alert(errorString);
      }) 
  });
}

function initDemoSintesiParlato() {
   $('#textarea_tospeak').off('change');
   $('#textarea_tospeak').on('change', function() {
      $('#lnkSintetizza').toggle($('#textarea_tospeak').val().trim().length > 0);
   });

   $('#lnkSintetizza').off('click');
   $('#lnkSintetizza').on('click', function() {
     var text = $('#textarea_tospeak').val().trim();

     var synthesizer = new SpeechSynthesizer(subKey);
     synthesizer.speak(text,
      function(data) {
        $('#player_sintesi')[0].src = URL.createObjectURL(data);
        $('#player_sintesi')[0].play();
      },
      function(errorThrown) {
        // Display error message.
        var errorString =
          errorThrown === ""
          ? "Error. "
          : errorThrown;

        alert(errorString);
      });
   });
}


function initDemoModerazioneTesto() {
  $('#textarea_content_moderate').off('change');
  $('#textarea_content_moderate').on('change', function() {
   $('#lnkModerate').toggle($('#textarea_content_moderate').val().trim().length > 0);
  });

  $('#lnkModerate').off('click');
  $('#lnkModerate').on('click', function() {
    let text = $('#textarea_content_moderate').val().trim();
    const moderator = new ContentModerator(endpoint, subKey);
    moderator.moderateContent(text,
      function(data) {
        $("#text_moderate_code_json").text(JSON.stringify(data, null, 2));
        hljs.highlightBlock($("#text_moderate_code_json")[0]);

      },
      function(errorThrown) {
      // Display error message.
      var errorString =
        errorThrown === ""
        ? "Error. "
        : errorThrown;

      alert(errorString);
      });
  });
}

function initDemoModerazioneImmagine() {
  $('#input_image_moderate_url').off('blur');
  $('#input_image_moderate_url').on('blur', function() {
      if ($(this)[0].checkValidity()) {
        var url = $(this).val();
        $('#img_preview_moderate')[0].src = url;
        $('#lnkImgModerate').show();
        $('#img_preview_moderate').removeClass('hide');
      } 
      else 
      {
        $('#lnkImgModerate').hide();
      }
  });


  $('#lnkImgModerate').off('click');
  $('#lnkImgModerate').on('click', function() {
     // Called each time the slide with the "stats" state is made visible
     const analyzer = new ImageAnalyzer(endpoint, subKey);
     var sourceImageUrl = $('#img_preview_moderate')[0].src; 

     const moderator = new ContentModerator(endpoint, subKey);
     moderator.moderateImage(sourceImageUrl,
       function(data) {
         $("#code_json_img_moderate").text(JSON.stringify(data, null, 2));
         hljs.highlightBlock($("#code_json_img_moderate")[0]);
 
       },
       function(errorThrown) {
       // Display error message.
       var errorString =
         errorThrown === ""
         ? "Error. "
         : errorThrown;
 
       alert(errorString);
       });
   });
}


function initDemoAutocompleteSearch() {
  $('#autocomplete-input').autocomplete();
  $('#autocomplete-input').off('keyup');
  $('#autocomplete-input').on('keyup', function() {

    var query = $('#autocomplete-input').val();
    var search = new SearchService(endpoint, subKey);
    search.autosuggestSomething(query,
      function(data) {
        $("#text_autocomplete_code_json").text(JSON.stringify(data, null, 2));
        hljs.highlightBlock($("#text_autocomplete_code_json")[0]);
        var suggestions = data.suggestionGroups[0].searchSuggestions.map(function(suggestion) {
            var item = {};
            item[""+suggestion.displayText+""] = suggestion.url;
            return item;
        }); 
        $('#autocomplete-input').autocomplete("updateData",suggestions);
      },
      function(errorThrown) {
      // Display error message.
      var errorString =
        errorThrown === ""
        ? "Error. "
        : errorThrown;

      alert(errorString);
      });
  });

}