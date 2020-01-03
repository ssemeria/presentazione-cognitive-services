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
