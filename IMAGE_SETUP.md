# Image Setup Instructions

To use your official logo and signature images in the bill generator, please follow these steps:

## Required Images

You need to add these two image files to your project folder:

1. **`logo.png`** - Your official Sarvamangal Yatra logo
2. **`signature.png`** - Your official signature image

## File Requirements

### Logo Image (`logo.png`)
- **Format**: PNG (recommended) or JPG
- **Size**: 200x200 pixels or higher (will be resized to 100x100 in the bill)
- **Background**: Transparent PNG preferred, or white background
- **Content**: Your official company logo

### Signature Image (`signature.png`)
- **Format**: PNG (recommended) or JPG
- **Size**: 300x100 pixels or higher (will be resized to 180x40 in the bill)
- **Background**: Transparent PNG preferred, or white background
- **Content**: Your handwritten signature

## How to Add Images

1. **Save your logo** as `logo.png` in the same folder as `index.html`
2. **Save your signature** as `signature.png` in the same folder as `index.html`
3. **Test the application** by opening `index.html` in your browser

## File Structure After Adding Images

```
sarvamangal-bill-generator/
├── index.html
├── styles.css
├── script.js
├── logo.png          ← Add your logo here
├── signature.png     ← Add your signature here
└── README.md
```

## Alternative Image Names

If your images have different names, you can update the file paths in `script.js`:

- **For logo**: Change `src="logo.png"` to your logo filename
- **For signature**: Change `src="signature.png"` to your signature filename

## PDF Generation

The images will automatically appear in the generated PDF files. Make sure the images are:
- High quality for crisp PDF output
- Properly sized to avoid distortion
- In a web-compatible format (PNG, JPG, or SVG)

## Troubleshooting

- **Images not showing**: Check that the filenames match exactly (case-sensitive)
- **Images too small/large**: The CSS will automatically resize them to fit
- **PDF generation issues**: Ensure images are in the same folder as the HTML file

Once you add these images, your bill generator will use your official logo and signature in all generated bills and PDFs!
