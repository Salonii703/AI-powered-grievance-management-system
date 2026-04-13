# SENTIMENT_RULES = {
#     "Highly Negative": {
#         "keywords": ["disgusting", "pathetic", "useless", "shameful", "worst ever",
#                      "fed up", "sick and tired", "absolutely horrible", "unacceptable"],
#         "score_range": (-1.0, -0.7)
#     },
#     "Negative": {
#         "keywords": ["angry", "frustrated", "terrible", "horrible", "ridiculous",
#                      "no action", "nobody cares", "always problem", "worst"],
#         "score_range": (-0.7, -0.3)
#     },
#     "Neutral": {
#         "keywords": ["issue", "problem", "complaint", "request", "inform"],
#         "score_range": (-0.3, 0.3)
#     },
#     "Positive": {
#         "keywords": ["please", "kindly", "humble request", "thank", "appreciate",
#                      "grateful", "politely"],
#         "score_range": (0.3, 1.0)
#     }
# }

# def analyze_sentiment(text: str) -> dict:
#     text_lower = text.lower()
#     for sentiment, data in SENTIMENT_RULES.items():
#         for keyword in data["keywords"]:
#             if keyword in text_lower:
#                 return {
#                     "sentiment": sentiment,
#                     "tone": get_tone_advice(sentiment),
#                     "matched_indicator": keyword
#                 }
#     return {
#         "sentiment": "Neutral",
#         "tone": "Standard processing",
#         "matched_indicator": None
#     }

# def get_tone_advice(sentiment: str) -> str:
#     advice = {
#         "Highly Negative": "Escalate immediately — citizen is very distressed",
#         "Negative": "Priority attention needed — citizen is frustrated",
#         "Neutral": "Standard processing",
#         "Positive": "Citizen is cooperative — standard processing"
#     }
#     return advice.get(sentiment, "Standard processing")




def analyze_sentiment(description: str) -> dict:
    text = description.lower()
    negative = ["frustrated", "angry", "terrible", "worst", "unacceptable", "disgusting"]
    positive = ["please", "request", "kindly", "hope", "thank"]
    if any(w in text for w in negative):
        return {"sentiment": "Negative", "tone": "Citizen appears frustrated. Respond with empathy and urgency."}
    elif any(w in text for w in positive):
        return {"sentiment": "Neutral", "tone": "Citizen is polite. Acknowledge and act promptly."}
    return {"sentiment": "Neutral", "tone": "Standard response recommended."}