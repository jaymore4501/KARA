"""
KARA Backend - RAG Document Parser
Supports extracting text from PDF, DOCX, TXT, and Markdown files.
"""
import os
import docx
import fitz  # PyMuPDF

def parse_txt_or_md(file_path: str) -> str:
    """Read plain text or markdown file."""
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def parse_docx(file_path: str) -> str:
    """Read .docx file paragraphs."""
    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)


def parse_pdf(file_path: str) -> str:
    """Read .pdf file pages using PyMuPDF."""
    doc = fitz.open(file_path)
    full_text = []
    for page in doc:
        full_text.append(page.get_text())
    return "\n".join(full_text)


def parse_document(file_path: str) -> str:
    """Parse document text based on file extension."""
    _, ext = os.path.splitext(file_path.lower())
    
    if ext == ".txt" or ext == ".md":
        return parse_txt_or_md(file_path)
    elif ext == ".docx":
        return parse_docx(file_path)
    elif ext == ".pdf":
        return parse_pdf(file_path)
    else:
        raise ValueError(f"Unsupported file format: {ext}")
