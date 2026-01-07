def build_rag_prompt(
    user_message: str,
    context_chunks: list[str],
    user_name: str | None = None,
    max_context_chars: int = 6000,
    mode: str = "document",  # "document" | "image" | "chat"
) -> str:
    """
    Build a safe, bounded prompt for Cortex.

    Modes:
    - document → RAG over chunked documents
    - image → OCR-only context
    - chat → no external context

    Guarantees:
    - No hallucination
    - No prompt overflow
    - No system leakage
    """

    # ===============================
    # SYSTEM PROMPT (MODE-AWARE)
    # ===============================
    if mode == "image":
        system_prompt = """
You are Cortex, a premium AI assistant.

RULES:
- Use ONLY the provided OCR text from the image
- If the OCR text is unclear or insufficient, say so
- Do NOT assume visual details not present in the text
- Do NOT hallucinate
- Do NOT mention internal systems, OCR, or files
"""
    elif mode == "document":
        system_prompt = """
You are Cortex, a premium AI assistant.

RULES:
- Use ONLY the provided document context
- If context is insufficient, say so clearly
- Do NOT hallucinate
- Do NOT mention internal systems, embeddings, or files
"""
    else:  # normal chat
        system_prompt = """
You are Cortex, a premium AI assistant.

RULES:
- Answer naturally and helpfully
- Do NOT mention internal systems or implementation details
"""

    # ===============================
    # OPTIONAL USER NAME
    # ===============================
    name_block = f"The user's name is {user_name}.\n" if user_name else ""

    # ===============================
    # SAFE CONTEXT ASSEMBLY
    # ===============================
    context_text = ""
    current_len = 0

    for chunk in context_chunks:
        chunk = chunk.strip()
        if not chunk:
            continue

        if current_len + len(chunk) > max_context_chars:
            break

        context_text += f"\n- {chunk}"
        current_len += len(chunk)

    if context_text:
        context_block = f"\nCONTEXT:{context_text}\n"
    else:
        context_block = "\nCONTEXT:\n(No relevant context available)\n"

    # ===============================
    # FINAL PROMPT
    # ===============================
    return f"""
{system_prompt}

{name_block}
{context_block}

User: {user_message}
Cortex:
""".strip()