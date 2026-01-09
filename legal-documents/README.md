# Legal Documents

This directory contains the Privacy Policy and Terms & Conditions for Soulworx in multiple formats.

## Files

- **PRIVACY_POLICY.md** - Privacy Policy (Markdown source)
- **TERMS_AND_CONDITIONS.md** - Terms & Conditions (Markdown source)
- **PRIVACY_POLICY.docx** - Privacy Policy (Microsoft Word format)
- **PRIVACY_POLICY.pdf** - Privacy Policy (PDF format)
- **TERMS_AND_CONDITIONS.docx** - Terms & Conditions (Microsoft Word format)
- **TERMS_AND_CONDITIONS.pdf** - Terms & Conditions (PDF format)

## Regenerating Documents

To regenerate the Word and PDF files from the Markdown sources:

```bash
pnpm generate-legal-docs
```

Or manually:

```bash
tsx scripts/generate-legal-documents.ts
```

## Requirements

- **pandoc** (recommended) - For proper Word and PDF conversion
  - Install on macOS: `brew install pandoc`
  - Install on other systems: https://pandoc.org/installing.html

If pandoc is not installed, the script will create HTML versions that can be manually converted:
- Open HTML files in Microsoft Word and save as .docx
- Open HTML files in a browser and use Print > Save as PDF

## Updating the Documents

1. Edit the Markdown files in the root directory:
   - `PRIVACY_POLICY.md`
   - `TERMS_AND_CONDITIONS.md`

2. Update the "Last Updated" date at the top of each document

3. Regenerate the Word and PDF files using the command above

4. Review the generated files to ensure formatting is correct

## Important Notes

- These documents should be reviewed by legal counsel before use
- Update placeholders like `[Date]`, `[Your Business Address]`, `[Your Jurisdiction]` with actual information
- Ensure compliance with applicable laws (GDPR, CCPA, etc.)
- Keep these documents updated as your service evolves



