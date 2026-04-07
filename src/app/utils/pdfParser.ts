import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Group items by their y-position to reconstruct lines with a small threshold
      const items = textContent.items as any[];
      const lines: { y: number; text: string[] }[] = [];
      const Y_THRESHOLD = 5; // Pixels
      
      items.forEach(item => {
        const y = item.transform[5];
        let foundLine = lines.find(line => Math.abs(line.y - y) < Y_THRESHOLD);
        
        if (foundLine) {
          foundLine.text.push(item.str);
        } else {
          lines.push({ y, text: [item.str] });
        }
      });
      
      // Sort lines by y-position descending (top to bottom)
      const sortedLines = lines.sort((a, b) => b.y - a.y);
      
      const pageText = sortedLines
        .map(line => line.text.join(' '))
        .join('\n');
        
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to parse PDF file. Ensure it is a valid, non-encrypted bank statement.');
  }
}
