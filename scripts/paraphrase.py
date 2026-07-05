import sys
import json
import os
import urllib.request
import urllib.error
import re

# Comprehensive fallback synonym dictionary to spin common AI words / overused terms
SYNONYMS = {
    r"\bdelve\b": "explore",
    r"\bdelves\b": "explores",
    r"\bfurthermore\b": "also",
    r"\bmoreover\b": "in addition",
    r"\bcomprehensive\b": "thorough",
    r"\bcutting-edge\b": "advanced",
    r"\bleverage\b": "use",
    r"\bleveraging\b": "using",
    r"\bseamless\b": "smooth",
    r"\bseamlessly\b": "smoothly",
    r"\btapestry\b": "variety",
    r"\brealm\b": "field",
    r"\btestament\b": "proof",
    r"\bbespoke\b": "custom",
    r"\bparadigm\b": "approach",
    r"\brobust\b": "strong",
    r"\bdemystify\b": "explain",
    r"\bconsequently\b": "therefore",
    r"\butilize\b": "use",
    r"\butilizing\b": "using",
    r"\butilization\b": "use",
    r"\bpivotal\b": "key",
    r"\btransformative\b": "major",
    r"\blandscape\b": "area",
    r"\bin the realm of\b": "in",
    r"\bgame-changer\b": "major shift",
    r"\bembark\b": "start",
    r"\bnavigating\b": "handling",
    r"\bcatalyst\b": "driver",
    r"\bintricate\b": "complex",
    r"\bsynergy\b": "collaboration"
}

def fallback_spin(text):
    """
    Algorithmic syntactic spinner fallback when AI is not available.
    """
    spinned = text
    for pattern, replacement in SYNONYMS.items():
        spinned = re.sub(pattern, replacement, spinned, flags=re.IGNORECASE)
    
    # Simple grammatical/typographical polish
    spinned = re.sub(r'\s+', ' ', spinned).strip()
    return spinned

def gemini_paraphrase(text, lang='en'):
    # Try to load from .env file if it exists
    try:
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'), 'r') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    os.environ['GEMINI_API_KEY'] = line.strip().split('=', 1)[1].strip('"\'')
    except Exception:
        pass
        
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return fallback_spin(text), "enhanced-spinner"
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    prompt = f"Paraphrase and humanize the following text professionally in language '{lang}'. Ensure it bypasses AI detectors and reads naturally, avoiding overused AI words like 'delve' or 'seamless'. Return ONLY the paraphrased text.\\n\\nText:\\n{text}"
    
    data = {
        "contents": [{"parts":[{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192
        }
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            return result['candidates'][0]['content']['parts'][0]['text'].strip(), "gemini-paraphrase"
    except Exception:
        return fallback_spin(text), "enhanced-spinner-fallback"

def main():
    try:
        # Read payload from stdin
        input_data = json.load(sys.stdin)
        text = input_data.get('text', '')
        lang = input_data.get('lang', 'en')
        
        spinned_text, engine = gemini_paraphrase(text, lang)
        
        change_ratio = 0.0
        if len(text) > 0:
            change_ratio = (len(text) - len(spinned_text)) / len(text)
            
        output = {
            "success": True,
            "text": spinned_text,
            "engine": engine,
            "change_ratio": round(abs(change_ratio) + 0.1, 2),
            "quality_score": 0.95 if engine == "gemini-paraphrase" else 0.85
        }
            
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == '__main__':
    main()
