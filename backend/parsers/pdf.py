import pdfplumber

def parse(file):
    with pdfplumber.open(file.file) as pdf:
        text = []
        for page in pdf.pages:
            content = page.extract_text()
            if content:
                text.append(content)
    return "\n".join(text)