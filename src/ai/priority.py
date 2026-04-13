# PRIORITY_RULES = {
#     "Critical": [
#         "fire", "flood", "collapsed", "dead", "bleeding", "accident",
#         "emergency", "explosion", "fallen tree", "electrocution", "drowning"
#     ],
#     "High": [
#         "urgent", "dangerous", "no water", "no electricity", "broken pipe",
#         "hospital", "injury", "sewage overflow", "gas leak", "unsafe"
#     ],
#     "Medium": [
#         "broken", "damaged", "not working", "missing", "blocked",
#         "irregular", "delayed", "pending", "complaint", "issue"
#     ]
# }

# def get_priority(text: str) -> dict:
#     text_lower = text.lower()
#     for level, keywords in PRIORITY_RULES.items():
#         for keyword in keywords:
#             if keyword in text_lower:
#                 return {
#                     "priority": level,
#                     "matched_keyword": keyword,
#                     "action_required_within": (
#                         "2 hours" if level == "Critical" else
#                         "24 hours" if level == "High" else
#                         "72 hours"
#                     )
#                 }
#     return {
#         "priority": "Low",
#         "matched_keyword": None,
#         "action_required_within": "7 days"
#     }




def get_priority(description: str) -> dict:
    text = description.lower()
    if any(w in text for w in ["urgent", "emergency", "fire", "death", "critical","accident","water","gas leak","missing"]):
        return {"priority": "High", "action_required_within": "24 hours"}
    elif any(w in text for w in ["broken", "damaged", "severe","electricity","blocked","not working"]):
        return {"priority": "Medium", "action_required_within": "72 hours"}
    return {"priority": "Low", "action_required_within": "7 days"}