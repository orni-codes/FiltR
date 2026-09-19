import json
import time

from google import genai

from app.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)

MODEL = "gemini-3.6-flash"


def generate_json(prompt: str):

    max_retries = 3

    for attempt in range(max_retries):

        try:

            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config={
                    "response_mime_type": "application/json"
                }
            )

            if not response.text:
                raise ValueError(
                    "Gemini returned an empty response"
                )

            try:

                return json.loads(response.text)

            except json.JSONDecodeError:

                raise ValueError(
                    f"Gemini returned invalid JSON: {response.text}"
                )

        except Exception as e:

            error_text = str(e)

            # Retry temporary Gemini availability/rate errors
            if (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
            ):

                if attempt < max_retries - 1:

                    wait_time = 2 ** attempt

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    time.sleep(wait_time)

                    continue

            # Permanent / unexpected error
            raise e

    raise RuntimeError(
        "Gemini request failed after multiple retries."
    )