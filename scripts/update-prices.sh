#!/bin/bash
# Update Louve Collection product variant prices via Shopify Admin GraphQL API
# Uses curl (works in sandboxed environments where Node fetch may fail)

STORE="f0c5au-jn.myshopify.com"
TOKEN="${SHOPIFY_ADMIN_ACCESS_TOKEN:?Set SHOPIFY_ADMIN_ACCESS_TOKEN env var}"
API="https://${STORE}/admin/api/2024-10/graphql.json"

declare -A PRICES=(
  ["MS-C-C-IP-17PRX"]="170.00"
  ["MS-C-C-IP-17PR"]="170.00"
  ["MS-C-TPU-CFN-17PX"]="210.00"
  ["MS-C-TPU-CFN-17PR"]="210.00"
  ["MS-C-TPU-DP-17PX"]="210.00"
  ["MS-C-TPU-DP-17PR"]="210.00"
  ["C-TPU-PP-17PX"]="170.00"
  ["C-TPU-PP-17PR"]="170.00"
  ["E-MS-HPNK-17PX"]="182.00"
  ["E-MS-HPNK-17PR"]="182.00"
  ["E-MS-BL-17PX"]="182.00"
  ["E-MS-BL-16PR"]="182.00"
  ["C-C-IP-17PRX"]="170.00"
  ["C-C-IP-17PR"]="170.00"
  ["S-DAC-BIS-G"]="96.00"
  ["S-DAC-MYS-G"]="96.00"
  ["S-DAC-SAN-G"]="96.00"
  ["S-CH-PRL-L"]="127.00"
  ["S-CH-GAIA-L"]="127.00"
  ["S-CH-AVA-L"]="127.00"
  ["S-CH-BODI-S"]="115.00"
  ["A-KNT-LNG-BLU-G"]="121.00"
  ["S-KNT-LNH-PNK-S"]="121.00"
  ["S-CRNY-BLK-G"]="121.00"
  ["S-CRNY-BL-G"]="121.00"
  ["S-CH-BLUSH-S-G"]="136.00"
  ["S-CH-ABB-OFFW-S"]="136.00"
  ["S-CH-RAIN-G-S"]="136.00"
  ["S-CH-DAR-PUR-S"]="136.00"
  ["S-CH-DAR-GR-S"]="136.00"
)

gql() {
  curl -s -X POST "$API" \
    -H "Content-Type: application/json" \
    -H "X-Shopify-Access-Token: $TOKEN" \
    -d "$1"
}

SUCCESS=0
FAILED=0

echo "Updating ${#PRICES[@]} variant prices on $STORE..."
echo ""

for SKU in "${!PRICES[@]}"; do
  PRICE="${PRICES[$SKU]}"

  # Find variant by SKU
  RESULT=$(gql "{\"query\":\"{ productVariants(first:1, query:\\\"sku:$SKU\\\") { edges { node { id sku price product { title } } } } }\"}")

  VARIANT_ID=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); edges=d.get('data',{}).get('productVariants',{}).get('edges',[]); print(edges[0]['node']['id'] if edges else '')" 2>/dev/null)
  CURRENT_PRICE=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); edges=d.get('data',{}).get('productVariants',{}).get('edges',[]); print(edges[0]['node']['price'] if edges else '')" 2>/dev/null)
  PRODUCT_TITLE=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); edges=d.get('data',{}).get('productVariants',{}).get('edges',[]); print(edges[0]['node']['product']['title'] if edges else '')" 2>/dev/null)

  if [ -z "$VARIANT_ID" ]; then
    echo "[SKIP] $SKU — variant not found"
    ((FAILED++))
    continue
  fi

  if [ "$CURRENT_PRICE" = "$PRICE" ]; then
    echo "[OK]   $SKU — already SAR $PRICE ($PRODUCT_TITLE)"
    ((SUCCESS++))
    continue
  fi

  # Update price
  UPDATE=$(gql "{\"query\":\"mutation { productVariantUpdate(input: {id: \\\"$VARIANT_ID\\\", price: \\\"$PRICE\\\"}) { productVariant { id price } userErrors { message } } }\"}")

  ERRORS=$(echo "$UPDATE" | python3 -c "import sys,json; d=json.load(sys.stdin); errs=d.get('data',{}).get('productVariantUpdate',{}).get('userErrors',[]); print(errs[0]['message'] if errs else '')" 2>/dev/null)

  if [ -n "$ERRORS" ]; then
    echo "[FAIL] $SKU — $ERRORS"
    ((FAILED++))
  else
    echo "[DONE] $SKU — $CURRENT_PRICE → SAR $PRICE ($PRODUCT_TITLE)"
    ((SUCCESS++))
  fi
done

echo ""
echo "Complete: $SUCCESS succeeded, $FAILED failed."
