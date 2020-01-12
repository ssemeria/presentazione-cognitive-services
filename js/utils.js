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

    clearCanvas(canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    drawRectangle(canvas, rect) {
        let context = canvas.getContext('2d');

        context.beginPath();
        context.moveTo(rect.left, rect.top);
        context.lineTo(rect.left+rect.width, rect.top);
        context.lineTo(rect.left+rect.width, rect.top + rect.height);
        context.lineTo(rect.left, rect.top + rect.height);
        context.lineTo(rect.left, rect.top);
        context.lineWidth = 2;
        context.strokeStyle = this.getRandomColor(); 
        context.stroke();      
            
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
  
  class Microphone {
   
    recorder = {}; 
    input = null;
    gumStream = null;
    rawWaveData = [];

    stopRecording() {
        this.recorder.stop(); //stop microphone access 
        this.gumStream.getAudioTracks()[0].stop();
       
    }

    fetchAudioDataAsWave(dataExtracted) {
        var that = this;
        this.recorder.exportWAV(function(waveData) {
            that.rawWaveData = waveData;
            dataExtracted(waveData);
        });
    }

    recordAudio() {
        var that = this;
        this.recordedChunks = [];
        this.shouldStop = false;
        this.stopped = false;

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
          
            that.gumStream = stream;
            const context = new AudioContext();
            that.input = context.createMediaStreamSource(stream);
            that.recorder = new Recorder(that.input, {
                numChannels: 1
            }); 
            that.recorder.record();
        });
    }
  }