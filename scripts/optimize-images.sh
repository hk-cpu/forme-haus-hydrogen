#!/bin/bash
# Image Optimization Script for FormeHaus
# Compresses oversized images to improve performance

echo "╔════════════════════════════════════════════════════════════╗"
echo "║           IMAGE OPTIMIZATION SCRIPT                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PUBLIC_DIR="public"
BACKUP_DIR="public/.originals-backup"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check for required tools
check_tool() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}✗ $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 is installed${NC}"
        return 0
    fi
}

echo "Checking required tools..."
has_imagemagick=$(check_tool "convert")
has_pngquant=$(check_tool "pngquant")
has_cwebp=$(check_tool "cwebp")
has_jpegoptim=$(check_tool "jpegoptim")

# Function to optimize PNG
optimize_png() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo -e "${CYAN}Optimizing PNG: $filename${NC}"
    
    # Backup original
    cp "$file" "$BACKUP_DIR/"
    
    # Try pngquant first (lossy, better compression)
    if [ "$has_pngquant" = 0 ]; then
        pngquant --quality=70-90 --force --output "$file" "$file" 2>/dev/null || true
    fi
    
    # Then run through ImageMagick for resizing if needed
    if [ "$has_imagemagick" = 0 ]; then
        convert "$file" -resize 1920x1080\> -strip -optimize "$file" 2>/dev/null || true
    fi
}

# Function to optimize JPEG
optimize_jpeg() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo -e "${CYAN}Optimizing JPEG: $filename${NC}"
    
    # Backup original
    cp "$file" "$BACKUP_DIR/"
    
    # Use jpegoptim
    if [ "$has_jpegoptim" = 0 ]; then
        jpegoptim --strip-all --max=85 --quiet "$file"
    elif [ "$has_imagemagick" = 0 ]; then
        convert "$file" -resize 1920x1080\> -strip -interlace Plane -gaussian-blur 0.05 -quality 85% "$file"
    fi
}

# Function to convert to WebP
convert_to_webp() {
    local file="$1"
    local ext="${file##*.}"
    local base="${file%.*}"
    
    if [ "$has_cwebp" = 0 ]; then
        echo -e "${CYAN}Creating WebP: $(basename "$base.webp")${NC}"
        cwebp -q 85 "$file" -o "$base.webp" 2>/dev/null || true
    fi
}

# Find and process oversized images
echo ""
echo -e "${YELLOW}Scanning for oversized images...${NC}"
echo ""

# Find images larger than 500KB
find "$PUBLIC_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -size +500k | while read file; do
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    size_mb=$((size / 1024 / 1024))
    
    if [ "$size_mb" -gt 1 ]; then
        echo -e "${RED}Found large image: $(basename "$file") (${size_mb}MB)${NC}"
        
        if [[ "$file" == *.png ]]; then
            optimize_png "$file"
        elif [[ "$file" == *.jpg ]] || [[ "$file" == *.jpeg ]]; then
            optimize_jpeg "$file"
        fi
        
        # Also create WebP version
        convert_to_webp "$file"
    fi
done

echo ""
echo -e "${GREEN}✓ Optimization complete!${NC}"
echo -e "${YELLOW}Original files backed up to: $BACKUP_DIR${NC}"
echo ""
echo "Next steps:"
echo "  1. Review optimized images"
echo "  2. Test site functionality"
echo "  3. Remove backup folder when satisfied: rm -rf $BACKUP_DIR"
