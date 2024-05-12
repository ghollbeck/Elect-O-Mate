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

cloudflared tunnel login eyJhIjoiYzQ3NDQ0NGQwOWIzYjVmZmFhMTk0NDY5MTZlYzJhZjUiLCJzIjoibGVjUCtjMUVZQlVUSnQvTkE4bWhubXdJZjhRZDVrd0dIK3hTRWhkYk9RUT0iLCJ0IjoiZjE2OWU0MmItNzk5MC00NzcxLThmN2QtMjlmOWJhZWZmOGRlIn0=

cloudflared tunnel run --url http://localhost:8000 wahl-o-smart > /dev/null 2>&1 &