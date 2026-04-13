# from difflib import SequenceMatcher
# from datetime import datetime

# submitted_grievances = []

# def is_duplicate(new_text: str, threshold: float = 0.75):
#     new_text_lower = new_text.lower().strip()
#     for existing in submitted_grievances:
#         ratio = SequenceMatcher(None, new_text_lower, existing["text"].lower()).ratio()
#         if ratio >= threshold:
#             return {
#                 "is_duplicate": True,
#                 "matched_with": existing["tracking_id"],
#                 "similarity_score": round(ratio * 100, 2),
#                 "original_submitted_at": existing["submitted_at"]
#             }
#     return {"is_duplicate": False}

# def register_grievance(text: str, tracking_id: str):
#     submitted_grievances.append({
#         "text": text,
#         "tracking_id": tracking_id,
#         "submitted_at": datetime.now().isoformat()
#     })


# from datetime import datetime

# _registered = []

# def is_duplicate(description: str) -> dict:
#     desc_words = set(description.lower().split())
#     for entry in _registered:
#         existing_words = set(entry["description"].lower().split())
#         common = desc_words & existing_words
#         if not desc_words: continue
#         score = round(len(common) / len(desc_words) * 100, 1)
#         if score >= 70:
#             return {"is_duplicate": True, "matched_with": entry["tracking_id"],
#                     "similarity_score": score, "original_submitted_at": entry["submitted_at"]}
#     return {"is_duplicate": False}

# def register_grievance(description: str, tracking_id: str):
#     _registered.append({"description": description, "tracking_id": tracking_id, "submitted_at": str(datetime.now())})


from datetime import datetime

_registered = []

def is_duplicate(description: str, name: str = "", state: str = "", 
                 district: str = "", pincode: str = "") -> dict:
    for entry in _registered:
        desc_match = description.lower().strip() == entry["description"].lower().strip()
        name_match = name.lower().strip() == entry["name"].lower().strip()
        state_match = state.lower().strip() == entry["state"].lower().strip()
        district_match = district.lower().strip() == entry["district"].lower().strip()
        pincode_match = pincode.strip() == entry["pincode"].strip()

        if desc_match and name_match and state_match and district_match and pincode_match:
            return {
                "is_duplicate": True,
                "matched_with": entry["tracking_id"],
                "similarity_score": 100.0,
                "original_submitted_at": entry["submitted_at"]
            }
    return {"is_duplicate": False}

def register_grievance(description: str, tracking_id: str, name: str = "",
                       state: str = "", district: str = "", pincode: str = ""):
    _registered.append({
        "description": description,
        "tracking_id": tracking_id,
        "name": name,
        "state": state,
        "district": district,
        "pincode": pincode,
        "submitted_at": str(datetime.now())
    })