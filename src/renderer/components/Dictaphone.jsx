import { useState, useEffect } from 'react';
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

await register(await connect());

export default function Dictaphone() {
  const VOICE_MIN_DECIBELS = -60;
  const DELAY_BETWEEN_DIALOGS = 1000;
  const DIALOG_MAX_LENGTH = 60 * 1000;
  var MEDIA_RECORDER = null;

  //record:
  function record() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {

      //start recording:
      MEDIA_RECORDER = new MediaRecorder(stream, { mimeType: 'audio/wav' });
      MEDIA_RECORDER.start();

      //save audio chunks:
      const audioChunks = [];
      MEDIA_RECORDER.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      //analisys:
      const audioContext = new AudioContext();
      const audioStreamSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.minDecibels = VOICE_MIN_DECIBELS;
      audioStreamSource.connect(analyser);
      const bufferLength = analyser.frequencyBinCount;
      const domainData = new Uint8Array(bufferLength);

      //loop:
      var time = new Date();
      let startTime,
        lastDetectedTime = time.getTime();
      let anySoundDetected = false;

      const detectSound = () => {
        //recording stoped by user:

        time = new Date();
        var currentTime = time.getTime();

        //time out:
        if (currentTime > startTime + DIALOG_MAX_LENGTH) {
          MEDIA_RECORDER.stop();
          return;
        }

        //a dialog detected:
        if (
          anySoundDetected === true &&
          currentTime > lastDetectedTime + DELAY_BETWEEN_DIALOGS
        ) {
          MEDIA_RECORDER.stop();
          return;
        }

        //check for detection:
        analyser.getByteFrequencyData(domainData);
        for (let i = 0; i < bufferLength; i++)
          if (domainData[i] > 0) {
            anySoundDetected = true;
            time = new Date();
            lastDetectedTime = time.getTime();
          }

        //continue the loop:
        window.requestAnimationFrame(detectSound);
      };
      window.requestAnimationFrame(detectSound);

      //stop event:
      MEDIA_RECORDER.addEventListener('stop', () => {
        //stop all the tracks:
        stream.getTracks().forEach((track) => track.stop());
        if (!anySoundDetected) return;

        //send to server:
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        sendRecordToServer(audioBlob);

        //start recording again:
        record();
      });
    });
  }

  //sending for understanding;
  function sendRecordToServer(audioBlob) {
    fetch('http://localhost:8080/vosk/text', {
      method: 'post',
      body: audioBlob,
    })
    .then((response) => {
      return response.text();
   })
   .then((responseJson) => {
      console.log(responseJson);
   });
  }

  useEffect(() => {
    record();
  });

  return (
    <div>
      <main>
        <div className="audio-controls"></div>
      </main>
    </div>
  );
}
