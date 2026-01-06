def parse(file):
    content = file.file.read()
    return content.decode("utf-8", errors="ignore")