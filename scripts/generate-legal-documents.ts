import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// This script converts markdown files to Word (.docx) and PDF formats
// Run with: tsx scripts/generate-legal-documents.ts
// Requires: pandoc (install with: brew install pandoc on macOS)

const rootDir = process.cwd();

function checkPandocInstalled(): boolean {
  try {
    execSync('pandoc --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function convertMarkdownToWord(markdownPath: string, outputPath: string) {
  try {
    console.log(`Converting ${path.basename(markdownPath)} to Word format...`);
    
    if (checkPandocInstalled()) {
      // Use pandoc for proper Word conversion
      const referenceDoc = path.join(rootDir, 'scripts', 'reference.docx');
      const hasReferenceDoc = fs.existsSync(referenceDoc);
      const pandocCmd = hasReferenceDoc 
        ? `pandoc "${markdownPath}" -o "${outputPath}" --reference-doc="${referenceDoc}"`
        : `pandoc "${markdownPath}" -o "${outputPath}"`;
      
      try {
        execSync(pandocCmd, { stdio: 'pipe' });
        console.log(`✅ Word document created: ${outputPath}`);
        return true;
      } catch (error: any) {
        // Fallback without reference doc
        execSync(`pandoc "${markdownPath}" -o "${outputPath}"`, { stdio: 'pipe' });
        console.log(`✅ Word document created: ${outputPath}`);
        return true;
      }
    } else {
      // Fallback: Create HTML that can be opened in Word
      const markdown = fs.readFileSync(markdownPath, 'utf-8');
      const html = markdownToHtml(markdown);
      
      const wordHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    h1 {
      font-size: 24pt;
      margin-top: 24pt;
      margin-bottom: 12pt;
      page-break-after: avoid;
    }
    h2 {
      font-size: 18pt;
      margin-top: 18pt;
      margin-bottom: 9pt;
      page-break-after: avoid;
    }
    h3 {
      font-size: 14pt;
      margin-top: 14pt;
      margin-bottom: 7pt;
      page-break-after: avoid;
    }
    p {
      margin-top: 6pt;
      margin-bottom: 6pt;
    }
    ul, ol {
      margin-top: 6pt;
      margin-bottom: 6pt;
      padding-left: 30pt;
    }
    li {
      margin-top: 3pt;
      margin-bottom: 3pt;
    }
    strong {
      font-weight: bold;
    }
    em {
      font-style: italic;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
      
      const htmlPath = outputPath.replace('.docx', '.html');
      fs.writeFileSync(htmlPath, wordHtml);
      console.log(`✅ HTML version created: ${htmlPath}`);
      console.log(`   Note: Install pandoc (brew install pandoc) for proper .docx conversion`);
      console.log(`   Or open this HTML file in Microsoft Word and save as .docx`);
      return true;
    }
  } catch (error) {
    console.error(`Error converting to Word: ${error}`);
    return false;
  }
}

async function convertMarkdownToPDF(markdownPath: string, outputPath: string) {
  try {
    console.log(`Converting ${path.basename(markdownPath)} to PDF format...`);
    
    if (checkPandocInstalled()) {
      // Use pandoc for PDF conversion
      // Try different PDF engines in order of preference
      const pdfEngines = ['wkhtmltopdf', 'weasyprint', 'prince', 'context', 'pdfroff'];
      let pdfCreated = false;
      
      for (const engine of pdfEngines) {
        try {
          execSync(`pandoc "${markdownPath}" -o "${outputPath}" --pdf-engine=${engine}`, { 
            stdio: 'pipe',
            timeout: 30000 
          });
          console.log(`✅ PDF document created: ${outputPath} (using ${engine})`);
          pdfCreated = true;
          break;
        } catch {
          // Try next engine
          continue;
        }
      }
      
      if (!pdfCreated) {
        // Fallback: create HTML for manual PDF conversion
        console.log(`⚠️  No PDF engine found. Creating HTML version for manual conversion...`);
        const markdown = fs.readFileSync(markdownPath, 'utf-8');
        const html = markdownToHtml(markdown);
        const pdfHtml = createPdfHtml(html);
        const htmlPath = outputPath.replace('.pdf', '.html');
        fs.writeFileSync(htmlPath, pdfHtml);
        console.log(`✅ HTML version created: ${htmlPath}`);
        console.log(`   Open in browser and use Print > Save as PDF`);
        return true;
      }
      
      return true;
    } else {
      // Fallback: Create HTML that can be converted to PDF
      const markdown = fs.readFileSync(markdownPath, 'utf-8');
      const html = markdownToHtml(markdown);
      const pdfHtml = createPdfHtml(html);
      
      const htmlPath = outputPath.replace('.pdf', '.html');
      fs.writeFileSync(htmlPath, pdfHtml);
      console.log(`✅ HTML version created: ${htmlPath}`);
      console.log(`   Note: Install pandoc (brew install pandoc) for proper PDF conversion`);
      console.log(`   Or open this HTML file in a browser and use Print > Save as PDF`);
      return true;
    }
  } catch (error) {
    console.error(`Error converting to PDF: ${error}`);
    return false;
  }
}

function createPdfHtml(html: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      margin: 2cm;
      size: letter;
    }
    body {
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
    }
    h1 {
      font-size: 24pt;
      margin-top: 24pt;
      margin-bottom: 12pt;
      page-break-after: avoid;
      color: #000;
    }
    h2 {
      font-size: 18pt;
      margin-top: 18pt;
      margin-bottom: 9pt;
      page-break-after: avoid;
      color: #000;
    }
    h3 {
      font-size: 14pt;
      margin-top: 14pt;
      margin-bottom: 7pt;
      page-break-after: avoid;
      color: #000;
    }
    p {
      margin-top: 6pt;
      margin-bottom: 6pt;
      text-align: justify;
    }
    ul, ol {
      margin-top: 6pt;
      margin-bottom: 6pt;
      padding-left: 30pt;
    }
    li {
      margin-top: 3pt;
      margin-bottom: 3pt;
    }
    strong {
      font-weight: bold;
    }
    em {
      font-style: italic;
    }
    hr {
      border: none;
      border-top: 1px solid #ccc;
      margin: 20pt 0;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  // Convert bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Convert unordered lists
  html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>' + match + '</ul>';
  });
  
  // Convert ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Convert paragraphs (lines that aren't already HTML tags)
  html = html.split('\n').map(line => {
    line = line.trim();
    if (!line) return '';
    if (line.startsWith('<')) return line;
    if (line.startsWith('#')) return line;
    return `<p>${line}</p>`;
  }).join('\n');
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  
  // Convert horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  
  return html;
}

async function main() {
  const documents = [
    { name: 'PRIVACY_POLICY', title: 'Privacy Policy' },
    { name: 'TERMS_AND_CONDITIONS', title: 'Terms and Conditions' }
  ];
  
  console.log('Generating legal documents...\n');
  
  for (const doc of documents) {
    const markdownPath = path.join(rootDir, `${doc.name}.md`);
    
    if (!fs.existsSync(markdownPath)) {
      console.error(`❌ Markdown file not found: ${markdownPath}`);
      continue;
    }
    
    console.log(`\n📄 Processing ${doc.title}...`);
    
    // Create output directory
    const outputDir = path.join(rootDir, 'legal-documents');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Convert to Word
    const wordPath = path.join(outputDir, `${doc.name}.docx`);
    await convertMarkdownToWord(markdownPath, wordPath);
    
    // Convert to PDF
    const pdfPath = path.join(outputDir, `${doc.name}.pdf`);
    await convertMarkdownToPDF(markdownPath, pdfPath);
  }
  
  console.log('\n✅ Document generation complete!');
  
  if (!checkPandocInstalled()) {
    console.log('\n📝 To generate proper .docx and .pdf files:');
    console.log('1. Install pandoc: brew install pandoc (macOS) or visit https://pandoc.org/installing.html');
    console.log('2. Re-run this script, or manually run:');
    console.log('   pandoc PRIVACY_POLICY.md -o legal-documents/PRIVACY_POLICY.docx');
    console.log('   pandoc TERMS_AND_CONDITIONS.md -o legal-documents/TERMS_AND_CONDITIONS.docx');
    console.log('   pandoc PRIVACY_POLICY.md -o legal-documents/PRIVACY_POLICY.pdf');
    console.log('   pandoc TERMS_AND_CONDITIONS.md -o legal-documents/TERMS_AND_CONDITIONS.pdf');
  }
}

main().catch(console.error);

