#!/usr/bin/env bash

# Colors for output
# More info about ANSI escape codes
# https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797

GREEN='\033[1;32m' #(1->bold, 31->color code for green)
RED='\033[1;31m' #(1->bold, 31->color code for red)
YELLOW='\033[1;33m' #(1->bold, 31->color code for yellow)
NC='\033[0m' # Reset terminal colors

# --- Safety & Formatting ---
# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Exit message
if ! command -v openssl &> /dev/null; then
    echo -e "${RED}Error: OpenSSL is not installed.${NC}"
    exit 1
fi

# Set file permissions so created keys are only readable by the current user
umask 077

function log {
    echo -e "${GREEN}>> $1${NC}"
}

function warn {
    echo -e "${YELLOW}>> $1${NC}"
}

# --- PATH CORRECTION Fix ---
# Get the directory where the script is actually stored
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# --- Important Configurations ---
DOMAIN="localhost"
PASSWORD="FileServer@Home"
ORG_NAME="Unemployed GmbH"
CA_COMMON_NAME="LocalDevRootCA"

# --- Optional Configurations ---
COUNTRY_CODE="DE"
STATE="Berlin"
LOCALITY="Berlin"
ORGANIZATION_UNIT="IT"

# Network Configuration (Add your DNSs here)
DNS_LIST=(
  $DOMAIN
  "desktop.local"
  "alanis-pc.local"
  "home.local"
  "pixel.local"
  "192.168.0.149.nip.io"
  "fileserver.local"
)

# Network Configuration (Add your IPs here)
IP_LIST=(
  "127.0.0.1"
  "192.168.0.149"
  "0.0.0.0"
  "192.168.10.252"
  "::1"
)

# Filenames using Absolute Paths
# We force the files to always be read/written in the script's folder
CA_KEY="$SCRIPT_DIR/ca.key"
CA_PEM="$SCRIPT_DIR/ca.pem"
SERVER_KEY="$SCRIPT_DIR/server.key"
SERVER_CSR="$SCRIPT_DIR/server.csr"
SERVER_PEM="$SCRIPT_DIR/server.pem"
SERVER_P12="$SCRIPT_DIR/server.p12"

# Config Files (Temporary)
CA_CONF="$SCRIPT_DIR/ca.cfg"
SERVER_CONF="$SCRIPT_DIR/server.cfg"

# --- Script Start ---

# 1. CA Generation Logic (REUSE if exists)
if [[ -f "$CA_KEY" && -f "$CA_PEM" ]]; then
    warn "Existing CA Key and Certificate found."
    warn "Skipping CA generation to maintain trust relationship."
    echo "Using existing CA: $CA_PEM"
else
    log "1. Generating NEW Certificate Authority Key (ECDSA P-256)..."
    openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:prime256v1 -out "$CA_KEY"

    log "2. Creating CA Config..."
    cat > "$CA_CONF" <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions    = v3_ca
prompt             = no

[req_distinguished_name]
C  = $COUNTRY_CODE
ST = $STATE
L  = $LOCALITY
O  = $ORG_NAME
OU = $ORGANIZATION_UNIT
CN = $CA_COMMON_NAME

[v3_ca]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid:always, issuer
basicConstraints       = critical, CA:TRUE
keyUsage               = critical, digitalSignature, cRLSign, keyCertSign
EOF

    log "3. Generating CA PEM Certificate..."
    openssl req -x509 -new -key "$CA_KEY" -out "$CA_PEM" -config "$CA_CONF" -days 3650
    
    warn "A NEW Root CA was generated. You MUST import '$CA_PEM' into your Trust Store."
fi

log "4. Creating Server Config..."
# Build the DNS and IP SAN string dynamically
ALT_NAMES_BLOCK=""

function build_config_block() {
    local -n output_str=$1   # $1 is the NAME of the output variable
    local -n input_arr=$2    # $2 is the NAME of the array
    local prefix=$3          # $3 is the prefix IP or DNS
    local index=1

    # Iterate over the array referenced by input_arr
    for item in "${input_arr[@]}"; do
        # Append to the output string
        output_str+="${prefix}.${index} = ${item}"$'\n'
        ((index++))
    done
}

# Always build the DNSs FIRST
build_config_block ALT_NAMES_BLOCK DNS_LIST "DNS"

# Then build the IPs
build_config_block ALT_NAMES_BLOCK IP_LIST "IP"


cat > "$SERVER_CONF" <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions     = req_ext
prompt             = no

[req_distinguished_name]
C  = $COUNTRY_CODE
ST = $STATE
L  = $LOCALITY
O  = $ORG_NAME
OU = $ORGANIZATION_UNIT
CN = $DOMAIN

[req_ext]
subjectAltName = @alt_names

[server_cert]
basicConstraints       = critical, CA:FALSE
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid, issuer:always
keyUsage               = critical, digitalSignature, keyAgreement
extendedKeyUsage       = serverAuth
subjectAltName         = @alt_names

[alt_names]
$ALT_NAMES_BLOCK
EOF

log "5. Generating Server Key (ECDSA P-256)..."
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:prime256v1 -out "$SERVER_KEY"

log "6. Generating Server CSR..."
openssl req -new -key "$SERVER_KEY" -out "$SERVER_CSR" -config "$SERVER_CONF"

log "7. Signing Server Certificate with CA..."

openssl x509 -req -in "$SERVER_CSR" \
    -CA "$CA_PEM" \
    -CAkey "$CA_KEY" \
    -CAcreateserial \
    -out "$SERVER_PEM" \
    -days 365 \
    -extfile "$SERVER_CONF" \
    -extensions server_cert

log "8. Packaging for Spring Boot (PKCS#12)..."

if [ -f "$SERVER_P12" ]; then rm -f "$SERVER_P12"; fi

openssl pkcs12 -export -in "$SERVER_PEM" \
    -inkey "$SERVER_KEY" \
    -out "$SERVER_P12" \
    -name boot-server \
    -passout pass:"$PASSWORD"

log "9. verifying the certificate chain..."
openssl verify -CAfile "$CA_PEM" "$SERVER_PEM"



echo "--------------------------------------------------------"
echo -e "${GREEN}Success!${NC}"
if [[ -f "$CA_CONF" ]]; then
    echo -e "${RED}IMPORTANT: A NEW CA was generated.${NC}"
    echo "CA Certificate:     $CA_PEM "
    echo "You MUST import '$CA_PEM' into your Import this to your OS / Browser Trust Store again."
else
    echo -e "${GREEN}Used existing CA.${NC}" 
    echo "No need to re-import '$CA_PEM' if it is already in your trust store."
fi

echo "Server Certificate: $SERVER_P12 (Use this in Spring Boot)"
echo "--------------------------------------------------------"

echo -e "${GREEN}Copying new Certificate to the certificate download PATH.${NC}"
mkdir -p "$SCRIPT_DIR/../certs"
cp "$CA_PEM" "$SCRIPT_DIR/../certs/"

# Reminder to not push private keys to Git
echo -e "${RED}IMPORTANT: Add *.key, *.pem, and *.p12 to your .gitignore!${NC}"
echo "--------------------------------------------------------"


log "10. Cleaning up intermediate files..."
rm -f "$CA_CONF" "$SERVER_CONF" "$SERVER_CSR" "$CA_PEM.srl" 2>/dev/null || true