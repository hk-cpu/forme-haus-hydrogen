#!/bin/bash
TOKEN="$SHOPIFY_ADMIN_ACCESS_TOKEN"
API="https://f0c5au-jn.myshopify.com/admin/api/2024-10/graphql.json"

gql() {
  curl -s -X POST "$API" \
    -H "Content-Type: application/json" \
    -H "X-Shopify-Access-Token: $TOKEN" \
    -d "$1"
}

create_product() {
  local title="$1" sku="$2" price="$3" type="$4"

  # Step 1: Create product
  local create_result=$(gql "{\"query\":\"mutation { productCreate(input: { title: \\\"$title\\\", status: ACTIVE, productType: \\\"$type\\\" }) { product { id variants(first:1) { edges { node { id } } } } userErrors { message } } }\"}")

  local product_id=$(echo "$create_result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['productCreate']['product']['id'])" 2>/dev/null)
  local variant_id=$(echo "$create_result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['productCreate']['product']['variants']['edges'][0]['node']['id'])" 2>/dev/null)

  if [ -z "$product_id" ] || [ "$product_id" = "None" ]; then
    local err=$(echo "$create_result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('productCreate',{}).get('userErrors',[{}])[0].get('message','unknown'))" 2>/dev/null)
    echo "[FAIL] $sku — create: $err"
    return 1
  fi

  # Step 2: Update variant with price + SKU
  local update_result=$(gql "{\"query\":\"mutation { productVariantsBulkUpdate(productId: \\\"$product_id\\\", variants: [{ id: \\\"$variant_id\\\", price: \\\"$price\\\", inventoryItem: { sku: \\\"$sku\\\" } }]) { productVariants { id price inventoryItem { sku } } userErrors { message } } }\"}")

  local uerr=$(echo "$update_result" | python3 -c "import sys,json; d=json.load(sys.stdin); errs=d.get('data',{}).get('productVariantsBulkUpdate',{}).get('userErrors',[]); print(errs[0]['message'] if errs else '')" 2>/dev/null)

  if [ -n "$uerr" ]; then
    echo "[FAIL] $sku — update: $uerr"
    return 1
  fi

  echo "[DONE] $sku — SAR $price — $title"
}

SUCCESS=0
FAILED=0

echo "Creating 30 products on f0c5au-jn.myshopify.com..."
echo ""

echo "=== PHONE CASES ==="
create_product "Classic Clear Phone Case - iPhone 17 Pro Max (MagSafe)" "MS-C-C-IP-17PRX" "170.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Classic Clear Phone Case - iPhone 17 Pro (MagSafe)" "MS-C-C-IP-17PR" "170.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Le Cafe Noir Phone Case - iPhone 17 Pro Max" "MS-C-TPU-CFN-17PX" "210.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Le Cafe Noir Phone Case - iPhone 17 Pro" "MS-C-TPU-CFN-17PR" "210.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Dusty Pink Phone Case - iPhone 17 Pro Max" "MS-C-TPU-DP-17PX" "210.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Dusty Pink Phone Case - iPhone 17 Pro" "MS-C-TPU-DP-17PR" "210.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Pure Pine Green Phone Case - iPhone 17 Pro Max" "C-TPU-PP-17PX" "170.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Pure Pine Green Phone Case - iPhone 17 Pro" "C-TPU-PP-17PR" "170.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Hot Pink Phone Case - iPhone 17 Pro Max" "E-MS-HPNK-17PX" "182.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Hot Pink Phone Case - iPhone 17 Pro" "E-MS-HPNK-17PR" "182.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Cobalt Blue Phone Case - iPhone 17 Pro Max" "E-MS-BL-17PX" "182.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Cobalt Blue Phone Case - iPhone 16 Pro" "E-MS-BL-16PR" "182.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Clear Case Non-MagSafe - iPhone 17 Pro Max" "C-C-IP-17PRX" "170.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))
create_product "Clear Case Non-MagSafe - iPhone 17 Pro" "C-C-IP-17PR" "170.00" "Phone Cases" && ((SUCCESS++)) || ((FAILED++))

echo ""
echo "=== STRAPS & CHAINS ==="
create_product "Bisque Beige Crossbody Phone Strap - Gold" "S-DAC-BIS-G" "96.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Mystique Black Crossbody Phone Strap - Gold" "S-DAC-MYS-G" "96.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Summer in Santorini Dacron Crossbody Phone Strap" "S-DAC-SAN-G" "96.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Pearl Crossbody Phone Chain" "S-CH-PRL-L" "127.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Gaia Gold-Plated Crossbody Phone Chain" "S-CH-GAIA-L" "127.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Ava Silver-Plated Crossbody Phone Chain" "S-CH-AVA-L" "127.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Bodi Pearl and Green Wristlet" "S-CH-BODI-S" "115.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "The Knot Strap (Blue)" "A-KNT-LNG-BLU-G" "121.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "The Knot Strap (Pink)" "S-KNT-LNH-PNK-S" "121.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "The Crunchy Strap (Black)" "S-CRNY-BLK-G" "121.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "The Crunchy Strap (Blue)" "S-CRNY-BL-G" "121.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))

echo ""
echo "=== WRISTLETS ==="
create_product "Abbey Beads Wristlet (Blush Pink)" "S-CH-BLUSH-S-G" "136.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Abbey Beads Wristlet (Off-white)" "S-CH-ABB-OFFW-S" "136.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Rainbow Wristlet" "S-CH-RAIN-G-S" "136.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Darling Wristlet (Purple)" "S-CH-DAR-PUR-S" "136.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))
create_product "Darling Wristlet (Green)" "S-CH-DAR-GR-S" "136.00" "Phone Straps" && ((SUCCESS++)) || ((FAILED++))

echo ""
echo "Complete: $SUCCESS succeeded, $FAILED failed."
