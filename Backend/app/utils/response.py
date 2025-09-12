from typing import Any, Optional, Dict

def generate_json_encoded_response(
    response_code: bool,
    response_message : Optional[str] = "",
    redirect_url : Optional[str] = "",
    response_data : Optional[Any] = None
) -> Dict:
    return {
        "response_code": response_code,
        "response_message": response_message,
        "redirect_url": redirect_url,
        "response_data": response_data
    }