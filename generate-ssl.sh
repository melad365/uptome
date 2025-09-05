#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p nginx/ssl

# Generate private key
openssl genrsa -out nginx/ssl/key.pem 2048

# Generate self-signed certificate
openssl req -new -x509 -key nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "SSL certificates generated successfully!"
echo "Note: These are self-signed certificates for development use only."
echo "For production, replace with certificates from a trusted CA."