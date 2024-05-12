#!/bin/bash

brew install ngrok/ngrok/ngrok

ngrok config add-authtoken 2gNjazwTbTn1muhj2P5Eu9K3cBo_865V42dncc1K498x3rdA9

ngrok http --domain=amazing-koi-maximum.ngrok-free.app 8000 > /dev/null 2>&1 &