/*
 * WebSocketServer_Synth.ino
 *
 *  
 *
 */

#include <WiFi.h>
#include <WebSocketsServer.h>
// INIT WEBSOCKET
WebSocketsServer webSocket = WebSocketsServer(81);
#define USE_SERIAL Serial
#define MESSAGE_INTERVAL 10
bool isConnected = false;
uint64_t messageTimestamp = 0;
float sensorValue;
int sensorPin = A2;

// WiFi network name and password:
const char * networkName = "**NAME_OF_YOUR_NETWORK**";
const char * networkPswd = "**YOUR_PASSWORD_TO_BE_CHANGED**";


//HTTP web server on port 80
WiFiServer server(80);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    Serial.println("event happened "+num);
    switch(type) {
        case WStype_DISCONNECTED:
            USE_SERIAL.printf("[%u] Disconnected!\n", num);
        break;
        case WStype_CONNECTED:
            {
                IPAddress ip = webSocket.remoteIP(num);
                USE_SERIAL.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
        				isConnected = true;
        				// send message to client
        				//webSocket.sendTXT(num, "Connected");
                //webSocket.sendTXT(num,"{\"luminosity\":\"0\"}");
                 webSocket.broadcastTXT("{\"luminosity\":\""+String(sensorValue)+"\"}");
            }
        break;
        case WStype_TEXT:
            USE_SERIAL.printf("[%u] get Text: %s\n", num, payload);
            // send message to client
             //webSocket.sendTXT(num, "message here");
             //webSocket.sendTXT(num,"{\"luminosity\":\"0\"}");
              webSocket.broadcastTXT("{\"luminosity\":\""+String(sensorValue)+"\"}");
        break;
        case WStype_BIN:
            USE_SERIAL.printf("[%u] get binary length: %u\n", num, length);
        break;
    }
}

void setup() {
    //CONNECTION ROUTINE
    USE_SERIAL.begin(115200);
    USE_SERIAL.setDebugOutput(true);
    // SLOWLY BOOTING
    for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }
    
    //connectWifi();  

     //Connect to the WiFi network
     connectToWiFi(networkName, networkPswd);
    
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    //websocket
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);

    //HTTP
    server.begin();
}

void loop() {
  webSocket.loop();
   if(isConnected) {
      uint64_t now = millis();
      sensorValue = analogRead(A2);
      //&& sensorValue>5.00
      if(now - messageTimestamp > MESSAGE_INTERVAL ) {
         Serial.println(String(sensorValue)); 
          messageTimestamp = now;
          webSocket.broadcastTXT("{\"luminosity\":\""+String(sensorValue)+"\"}");
      }
   }
   //HTTP SERVER
  WiFiClient client = server.available();    // listen for incoming clients
  if (client) {                              // if you get a client,
    Serial.println("New Client.");           // print a message out the serial port
    String currentLine = "";                 // make a String to hold incoming data from the client
    while (client.connected()) {             // loop while the client's connected
      if (client.available()) {              // if there's bytes to read from the client,
        char c = client.read();              // read a byte, then
        Serial.write(c);                     // print it out the serial monitor
        if (c == '\n') {                     // if the byte is a newline character

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();
            // the content of the HTTP response follows the header:
            client.print("<html><head><meta charset='utf-8'><title>AppSound</title><style>body{margin:0px;background-color:#ffccb3}button{margin-left:30px;margin-top:50px;color:#ffccb3;font-size:30px;font-style:normal;font-family:Arial;font-weight:bold;height:182px;width:182px;border:none;background-color:black;border-radius:100px}button:hover{background-color:#323232}</style></head><body data-IP='192.168.1.41'> <script src='https://cdnjs.cloudflare.com/ajax/libs/tunajs/1.0.0/tuna-min.js'></script><button id='chorusBtn' class='musicBtn'>Chorus</button> <button id='delayBtn' class='musicBtn'>Delay</button> <button id='playBtn' class='musicBtn'>Play</button> <audio id=\"audioPlayer\" ></audio> <span id='sensorVal'></span></body></html>");
            client.print("<script type=\"text/javascript\">'use strict';let sensorVal;let delay;let chorus;class SocketConnection{constructor(){this.IP=document.body.getAttribute('data-IP');this.init()};init(){window.WebSocket=window.WebSocket||window.MozWebSocket;window.WebSocket?this.initConnection():alert('Change browser please')};initConnection(){console.log('initConnection');this.connection=new WebSocket('ws://'+this.IP+':81/');this.connection.onopen=this.onOpen.bind(this);this.connection.onerror=this.onError.bind(this);this.connection.onmessage=this.onMessage.bind(this)};onOpen(){console.log('websocket connection ok')};onError(n){console.log('!!',n)};onMessage(n){try{let o=JSON.parse(n.data);sensorVal.textContent=o.luminosity;delay.delayTime=o.luminosity;chorus.feedback=parseInt(o.luminosity)/1000;console.log(o)}catch(e){console.log('Bad JSON format',e)}}};function startAudio(){console.log('start audio');let tuna=new Tuna(audioContext);delay=new tuna.Delay({feedback:0.45,delayTime:170,wetLevel:0.7,dryLevel:1,cutoff:5000,bypass:!1,});chorus=new tuna.Chorus({rate:4,feedback:0.2,delay:0.0045,bypass:!1});source.connect(delay.input);delay.connect(chorus.input);chorus.connect(audioContext.destination);chorus.bypass=!0;delay.bypass=!0};let AC='AudioContext' in window?AudioContext:'webkitAudioContext' in window?webkitAudioContext:document.write('Web Audio not supported');let audioContext=new AC();let source=audioContext.createBufferSource();source.loop=!0;let xhr=new XMLHttpRequest();xhr.open('GET','http://159.89.26.253/test.mp3');xhr.responseType='arraybuffer';xhr.onload=function(e){audioContext.decodeAudioData(e.target.response,function(b){source.buffer=b})};xhr.send(null);function clickPlay(){console.log('play',source);source.start(audioContext.currentTime)};function clickChorus(){chorus.bypass=!chorus.bypass;console.log('chorus active '+!chorus.bypass)};function clickDelay(){delay.bypass=!delay.bypass;console.log('delay active '+!delay.bypass)};window.onload=function(){let chorusBtn=document.getElementById('chorusBtn');let delayBtn=document.getElementById('delayBtn');let playBtn=document.getElementById('playBtn');sensorVal=document.getElementById('sensorVal');chorusBtn.addEventListener('click',clickChorus,!1);delayBtn.addEventListener('click',clickDelay,!1);playBtn.addEventListener('click',clickPlay,!1);startAudio();new SocketConnection()}</script>");
            // The HTTP response ends with another blank line:
            client.println();
            // break out of the while loop:
            break;
          } else {    // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("Client Disconnected.");
  }
}

boolean connectWifi(){
  boolean state = true;
  int i = 0;
  //CREATE A NETWORK
  WiFi.softAP("Pierry_WIFI");
  return state;
}

void connectToWiFi(const char * ssid, const char * pwd){
  Serial.println("Connecting to WiFi network: " + String(ssid));

  // delete old config
  WiFi.disconnect(true);
  //register event handler
  //WiFi.onEvent(WiFiEvent);
  
  //Initiate connection
  //WiFi.softAP("ESP32-Wi-Fi");
  WiFi.begin(ssid, pwd);

  Serial.println("Waiting for WIFI connection...");
  delay(5000);
}
