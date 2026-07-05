import sys
import json
import re

# Simple fallback synonym dictionary to spin common AI words / overused terms
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
}

def fallback_spin(text):
    """
    Algorithmic syntactic spinner fallback when TextHumanize is not available.
    Replaces common AI-slop words and slightly varies sentence transitions.
    """
    spinned = text
    for pattern, replacement in SYNONYMS.items():
        spinned = re.sub(pattern, replacement, spinned, flags=re.IGNORECASE)
    
    # Simple grammatical/typographical polish
    spinned = re.sub(r'\s+', ' ', spinned) # Clean double spaces
    return spinned

def main():
    try:
        # Read payload from stdin
        input_data = json.load(sys.stdin)
        text = input_data.get('text', '')
        lang = input_data.get('lang', 'en')
        
        # Try to use texthumanize for advanced offline naturalization
        try:
            import texthumanize
            # Use paraphrase() for fast, clean, syntactic rephrase
            polished_text = texthumanize.paraphrase(text, lang=lang)
            output = {
                "success": True,
                "text": polished_text,
                "engine": "texthumanize-paraphrase",
                "change_ratio": 0.3, # approximate estimate
                "quality_score": 0.8
            }
        except ImportError:
            # Fallback to local rule-based spinner if package is missing
            spinned_text = fallback_spin(text)
            output = {
                "success": True,
                "text": spinned_text,
                "engine": "fallback-spinner",
                "change_ratio": 0.05,
                "quality_score": 0.50
            }
            
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == '__main__':
    main()
