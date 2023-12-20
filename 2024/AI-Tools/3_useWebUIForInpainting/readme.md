## 1. ANDROID + CHROME + PORT FORWARDING

## to start the UI properly

sh webui.sh --api --cors-allow-origins https://localhost:8080 (local desktop)
sh webui.sh --api --listen --cors-allow-origins https://localhost:8080 (phone connection)

## get the hash of the first call

## check the parameters for the model

update the model parameters in the file: js/AiTool.js

## To access the app from the phone, you need to use PORT FORWARDING with USB

USE CHROME<br>
chrome://flags/#allow-insecure-localhost

## FROM THE CONSOLE, ENABLE PORT FORWARDING ON PORT 8080 (YOUR APP) AND 7860 (WEBUI)

## ON EXTENSION IN WEBUI, ADD THE FOLLOWING EXTENSION

stable-diffusion-webui-auto-tls-https

## BOTH APP AND WEBUI SHOULD BE RUNNING ON HTTPS

PORT FORWARDING ALLOWS TO IGNORE THE CERTIFICATE ERROR
YOU SHOULD SET ALL URL TO LOCALHOST WITH HTTPS

## 2. IOS + SAFARI + USER AGENT

## to start the UI properly

sh webui.sh --api (local desktop)
sh webui.sh --api --listen (phone connection)

## get the hash of the first call

## check the parameters for the model

update the model parameters in the file: js/AiTool.js

## To access the app from the phone, you need to allow camera in user agent in developper tools

your app has to run on http (not https) running on the IP of your computer

## RUN WEBUI ON HTTP regular port 7860
