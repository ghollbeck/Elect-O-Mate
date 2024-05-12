#!/bin/bash

# Check if Cloudflared is already installed
if ! command -v cloudflared &> /dev/null; then
    echo "Cloudflared is not installed. Installing..."

    # Download Cloudflared binary
    
    brew install cloudflared

    echo "Cloudflared has been installed."
else
    echo "Cloudflared is already installed."
fi
