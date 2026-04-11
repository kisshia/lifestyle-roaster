from __future__ import annotations

import io
import re
import csv
from typing import Dict, List

import pdfplumber
from PIL import Image
import pytesseract
from pytesseract import Output
import os

tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
if os.path.exists(tesseract_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

def parse_image_table_text(image) -> str:
    try:
        data = pytesseract.image_to_data(image, output_type=Output.DICT)
    except Exception as e:
        raise RuntimeError(f"OCR failed: {e}. Please ensure Tesseract OCR is installed.")
        
    words = []
    confs = []
    for i in range(len(data['text'])):
        text = data['text'][i].strip()
        conf = data['conf'][i]
        
        if text:
            try:
                c_val = float(conf)
            except ValueError:
                c_val = -1
                
            words.append({
                'text': text,
                'left': data['left'][i],
                'top': data['top'][i],
                'height': data['height'][i],
            })
            if c_val != -1:
                confs.append(c_val)
                
    if not words:
        return ""
         
    if confs:
        avg_conf = sum(confs) / len(confs)
        if avg_conf < 60.0:
            raise RuntimeError("Low Confidence: The uploaded image is too blurry. Please upload a clearer image.")
            
    avg_height = sum(w['height'] for w in words) / len(words)
    margin = avg_height / 2.0
    
    words.sort(key=lambda w: w['top'])
    rows = []
    current_row = []
    current_top = words[0]['top']
    
    for w in words:
        if abs(w['top'] - current_top) <= margin:
            current_row.append(w)
            current_top = (current_top * (len(current_row) - 1) + w['top']) / len(current_row)
        else:
            rows.append(current_row)
            current_row = [w]
            current_top = w['top']
            
    if current_row:
        rows.append(current_row)
        
    text_lines = []
    for row in rows:
        row.sort(key=lambda w: w['left'])
        text_lines.append(" ".join(w['text'] for w in row))
        
    return "\n".join(text_lines)

def heuristic_scan(text: str) -> tuple[List[Dict[str, str]], str]:
    transactions = []
    lines = text.split('\n')
    
    # Matches simple dates: MM/DD/YYYY, YYYY-MM-DD or Month DD, YYYY
    date_pattern = r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}(?:,)? \d{4})'
    # Matches amounts like $10.00, 10.00, $ 10.00, etc.
    amount_pattern = r'(\$?)\s?(\d+(?:,\d{3})*\.\d{2})'
    
    current_date = "Unknown Date"
    detected_usd = False
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Try to find date
        date_match = re.search(date_pattern, line, re.IGNORECASE)
        if date_match:
            current_date = date_match.group(1)
            
        # Try to find amount
        amounts = re.findall(amount_pattern, line)
        if amounts:
            # For bank statements with multiple columns (like Debit and Balance), the transaction amount is typically first.
            if len(amounts) >= 2:
                has_dollar, amt_str = amounts[0]
            else:
                has_dollar, amt_str = amounts[-1]
                
            try:
                amt = float(amt_str.replace(',', ''))
            except ValueError:
                continue
                
            if amt == 0:
                continue
                
            if has_dollar == '$':
                detected_usd = True
                
            # Clean description: remove the date and amounts from the line
            desc = line
            if date_match:
                desc = desc.replace(date_match.group(0), '')
            for _, a in amounts:
                desc = desc.replace(a, '')
            desc = desc.replace('$', '')
            
            # Strip out long Reference Numbers (e.g., check numbers, transaction IDs)
            desc = re.sub(r'\b\d{6,}\b', '', desc)
                
            desc = desc.strip(" \t\n\r,-|;:]°")
            if not desc:
                desc = "Unknown Transaction"
                
            transactions.append({
                "date": current_date,
                "description": desc,
                "amount": amt
            })
            
    currency = "USD" if detected_usd else "PHP"
    return transactions, currency

def parse_transactions(file_bytes: bytes, filename: str | None = None, content_type: str | None = None) -> tuple[List[Dict[str, str]], str]:
    resolved_mime = content_type or "text/plain"
    ext = str(filename).lower().split('.')[-1] if filename else ""
    
    if resolved_mime == "application/octet-stream" or resolved_mime == "text/plain" or not resolved_mime:
        if ext == "pdf":
            resolved_mime = "application/pdf"
        elif ext == "png":
            resolved_mime = "image/png"
        elif ext in ("jpg", "jpeg"):
            resolved_mime = "image/jpeg"
        elif ext == "csv":
            resolved_mime = "text/csv"
        else:
            resolved_mime = "text/plain"
            
    text_content = ""
    
    try:
        if resolved_mime == "application/pdf":
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                pages_text = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text and text.strip():
                        pages_text.append(text)
                    else:
                        # Image-based PDF fallback: use OCR
                        try:
                            # Render the page as an image to use pytesseract
                            img = page.to_image(resolution=300).original
                            ocr_text = pytesseract.image_to_string(img)
                            pages_text.append(ocr_text)
                        except Exception as e:
                            raise RuntimeError(f"OCR failed for PDF page: {e}. Please ensure Tesseract OCR is installed.")
                text_content = "\n".join(pages_text)
                
        elif resolved_mime in ("image/png", "image/jpeg"):
            image = Image.open(io.BytesIO(file_bytes))
            text_content = parse_image_table_text(image)
                
        elif resolved_mime == "text/csv":
            decoded = file_bytes.decode('utf-8', errors='ignore')
            reader = csv.reader(io.StringIO(decoded))
            # Join cells with space so heuristic_scan easily finds amounts and dates per row
            lines = [" ".join(row) for row in reader]
            text_content = "\n".join(lines)
            
        else:
            # Attempt to read as UTF-8 string
            text_content = file_bytes.decode('utf-8', errors='ignore')
            
    except RuntimeError as re_err:
        # Rethrow our custom RuntimeErrors
        raise re_err
    except Exception as e:
        raise RuntimeError(f"Error reading file with local parsers: {e}.")
    
    if not text_content.strip():
         raise RuntimeError("No text could be extracted from the file. If it's an image, Tesseract OCR may be failing.")
         
    parsed_transactions, currency = heuristic_scan(text_content)
    
    if not parsed_transactions:
         raise RuntimeError("Extracted text contained no recognizable transactions.")
         
    return parsed_transactions, currency
