from docx import Document

def parse(file):
    doc = Document(file.file)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])