# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.routes.grievance import router as grievance_router

# app = FastAPI(title="AI Grievance Management System")
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace * with your frontend URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# # Register routes
# app.include_router(grievance_router, prefix="/grievance", tags=["Grievance"])

# @app.get("/")
# async def root():
#     return {"message": "Grievance Management API Running"}
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import uuid, sys, os

# sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'ai')))

# from categorizer import categorize_grievance
# from priority import get_priority
# from sentiment import analyze_sentiment
# from location import get_location_info
# from duplicate import is_duplicate, register_grievance

# app = FastAPI()
# app.add_middleware(CORSMiddleware, allow_origins=["*"],
#     allow_methods=["*"], allow_headers=["*"])

# grievances_db = []

# class GrievanceIn(BaseModel):
#     name: str
#     description: str
#     state: str = ""
#     district: str = ""
#     pincode: str = ""

# class StatusUpdate(BaseModel):
#     tracking_id: str
#     status: str
#     remark: str = ""

# @app.post("/submit")
# def submit(g: GrievanceIn):
#     dup = is_duplicate(g.description)
#     if dup["is_duplicate"]:
#         return {"duplicate": True, **dup}
#     category  = categorize_grievance(g.description)
#     priority  = get_priority(g.description)
#     sentiment = analyze_sentiment(g.description)
#     location  = get_location_info(g.state, g.district, g.pincode, category)
#     tracking_id = "GR-" + uuid.uuid4().hex[:8].upper()
#     record = {
#         "tracking_id": tracking_id,
#         "name": g.name,
#         "description": g.description,
#         "category": category,
#         "priority": priority["priority"],
#         "action_within": priority["action_required_within"],
#         "sentiment": sentiment["sentiment"],
#         "tone_advice": sentiment["tone"],
#         "state": g.state,
#         "district": g.district,
#         "nearest_office": location["nearest_office"],
#         "department": location["responsible_department"],
#         "helpline": location["state_helpline"],
#         "status": "Submitted",
#         "remarks": []
#     }
#     grievances_db.append(record)
#     register_grievance(g.description, tracking_id)
#     return {"duplicate": False, "tracking_id": tracking_id, **record}

# @app.get("/grievances")
# def get_all():
#     return grievances_db

# @app.post("/update-status")
# def update_status(u: StatusUpdate):
#     for g in grievances_db:
#         if g["tracking_id"] == u.tracking_id:
#             g["status"] = u.status
#             if u.remark:
#                 g["remarks"].append(u.remark)
#             return {"success": True}
#     return {"success": False}

# @app.get("/track/{tracking_id}")
# def track(tracking_id: str):
#     for g in grievances_db:
#         if g["tracking_id"] == tracking_id:
#             return g
#     return {"error": "Not found"}


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid, os, json

AI_PATH = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'ai'))
import sys
sys.path.insert(0, AI_PATH)

from categorizer import categorize_grievance
from priority import get_priority
from sentiment import analyze_sentiment
from location import get_location_info
from duplicate import is_duplicate, register_grievance

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"],
    allow_methods=["*"], allow_headers=["*"])

# ── persistent storage ──────────────────────────────────────────
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'grievances.json')

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    return []

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# preload duplicates from previous sessions
def restore_duplicates():
    for g in load_db():
        register_grievance(
            description=g['description'],
            tracking_id=g['tracking_id'],
            name=g.get('name', ''),
            state=g.get('state', ''),
            district=g.get('district', ''),
            pincode=g.get('pincode', '')
        )

restore_duplicates()
# ────────────────────────────────────────────────────────────────

class GrievanceIn(BaseModel):
    name: str
    email: str = ""
    description: str
    state: str = ""
    district: str = ""
    pincode: str = ""

class StatusUpdate(BaseModel):
    tracking_id: str
    status: str
    remark: str = ""

class AssignOfficer(BaseModel):
    tracking_id: str
    officer_name: str
    officer_phone: str
    officer_note: str = ""

class ReviewIn(BaseModel):
    tracking_id: str
    rating: int  # 1-5
    feedback: str = ""

@app.post("/submit")
def submit(g: GrievanceIn):
    db = load_db()
    dup = is_duplicate(
    description=g.description,
    name=g.name,
    state=g.state,
    district=g.district,
    pincode=g.pincode
)
    if dup["is_duplicate"]:
        return {"duplicate": True, **dup}

    category  = categorize_grievance(g.description)
    priority  = get_priority(g.description)
    sentiment = analyze_sentiment(g.description)
    #location  = get_location_info(g.state, g.district, g.pincode, category)
    location = get_location_info(
    state=g.state,
    district=g.district,
    pincode=g.pincode,
    category=category
)
    tracking_id = "GR-" + uuid.uuid4().hex[:8].upper()

    record = {
        "tracking_id": tracking_id,
        "name": g.name,
        "email": g.email,
        "description": g.description,
        "category": category,
        "priority": priority["priority"],
        "action_within": priority["action_required_within"],
        "sentiment": sentiment["sentiment"],
        "tone_advice": sentiment["tone"],
        "state": g.state,
        "district": g.district,
        "nearest_office": location["nearest_office"],
        "department": location["responsible_department"],
        "helpline": location["state_helpline"],
        "status": "Submitted",
        "remarks": []
    }

    db.append(record)
    save_db(db)
    register_grievance(
    description=g.description,
    tracking_id=tracking_id,
    name=g.name,
    state=g.state,
    district=g.district,
    pincode=g.pincode
)
    return {"duplicate": False, "tracking_id": tracking_id, **record}

@app.get("/grievances")
def get_all():
    return load_db()

@app.post("/update-status")
def update_status(u: StatusUpdate):
    db = load_db()
    for g in db:
        if g["tracking_id"] == u.tracking_id:
            g["status"] = u.status
            if u.remark:
                g["remarks"].append(u.remark)
            save_db(db)
            return {"success": True}
    return {"success": False}

@app.post("/assign-officer")
def assign_officer(a: AssignOfficer):
    db = load_db()
    for g in db:
        if g["tracking_id"] == a.tracking_id:
            g["officer_name"] = a.officer_name
            g["officer_phone"] = a.officer_phone
            g["officer_note"] = a.officer_note
            g["status"] = "Under Review"
            save_db(db)
            return {"success": True}
    return {"success": False}

@app.get("/track/{tracking_id}")
def track(tracking_id: str):
    for g in load_db():
        if g["tracking_id"] == tracking_id:
            return g
    return {"error": "Not found"}

@app.post("/submit-review")
def submit_review(r: ReviewIn):
    db = load_db()
    for g in db:
        if g["tracking_id"] == r.tracking_id:
            g["rating"] = r.rating
            g["feedback"] = r.feedback
            save_db(db)
            return {"success": True}
    return {"success": False}