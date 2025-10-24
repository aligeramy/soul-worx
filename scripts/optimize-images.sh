#!/bin/bash

# Image optimization script
# Optimizes sponsor logos to max 500px wide and compresses large images

echo "Starting image optimization..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install imagemagick
    else
        echo "Please install ImageMagick manually"
        exit 1
    fi
fi

# Function to optimize sponsor logos (max 500px wide)
optimize_sponsor_logos() {
    echo "Optimizing sponsor logos..."
    cd public/sponsor-logos
    
    for file in *; do
        if [ -f "$file" ]; then
            # Get current dimensions
            width=$(identify -format "%w" "$file" 2>/dev/null)
            
            if [ ! -z "$width" ] && [ "$width" -gt 500 ]; then
                echo "Resizing $file from ${width}px to max 500px..."
                
                # Resize maintaining aspect ratio, max width 500px
                magick "$file" -resize 500x "$file"
                
                # Optimize PNG files
                if [[ "$file" == *.png ]]; then
                    optipng -o2 "$file" 2>/dev/null || true
                fi
                
                # Optimize WEBP files (recompress)
                if [[ "$file" == *.webp ]]; then
                    magick "$file" -define webp:method=6 -quality 85 "$file"
                fi
            else
                echo "Skipping $file (already <= 500px or invalid)"
            fi
        fi
    done
    
    cd ../..
}

# Function to optimize large images in public directory
optimize_large_images() {
    echo "Optimizing large images..."
    
    # Find and optimize PNG files larger than 500KB
    find public -type f -name "*.png" -size +500k | while read file; do
        if [[ "$file" != *"sponsor-logos"* ]]; then
            echo "Optimizing $file..."
            
            # Compress PNG
            optipng -o2 "$file" 2>/dev/null || magick "$file" -strip -quality 85-95 "$file"
            
            # If still large, consider converting to WebP
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            if [ "$size" -gt 1000000 ]; then
                echo "Large file detected: $file (${size} bytes)"
                echo "Consider converting to WebP format"
            fi
        fi
    done
    
    # Find and optimize JPG files larger than 500KB
    find public -type f \( -name "*.jpg" -o -name "*.jpeg" \) -size +500k | while read file; do
        echo "Optimizing $file..."
        magick "$file" -strip -quality 85 -sampling-factor 4:2:0 "$file"
    done
}

# Run optimizations
optimize_sponsor_logos
optimize_large_images

echo "Optimization complete!"
echo ""
echo "Summary:"
du -sh public/sponsor-logos public/shop public/home public/optimized

