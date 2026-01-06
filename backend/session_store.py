SESSION_STORE = {}

def get_session(session_id: str):
    return SESSION_STORE.get(session_id)

def set_session(session_id: str, data: dict):
    SESSION_STORE[session_id] = data

def clear_session(session_id: str):
    SESSION_STORE.pop(session_id, None)