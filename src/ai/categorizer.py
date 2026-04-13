import json
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def clean_mongodb_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r'NumberInt\((\d+)\)', r'\1', content)
    content = re.sub(r'ISODate\("([^"]+)"\)', r'"\1"', content)
    content = re.sub(r'ObjectId\("([^"]+)"\)', r'"\1"', content)
    return content

print("📂 Loading real grievance dataset...")

USE_REAL_DATA = False

try:
    grievance_path = os.path.join(BASE_DIR, 'no_pii_grievance.json')
    category_path  = os.path.join(BASE_DIR, 'CategoryCode_Mapping.xlsx')

    # Load grievances
    try:
        with open(grievance_path, 'r', encoding='utf-8') as f:
            grievances_data = json.load(f)
    except json.JSONDecodeError:
        print("⚠️ Trying MongoDB format...")
        cleaned = clean_mongodb_json(grievance_path)
        grievances_data = json.loads(cleaned)

    # Load category mapping
    category_mapping = pd.read_excel(category_path)

    df = pd.DataFrame(grievances_data)
    print(f"✅ Loaded {len(df):,} real grievances!")

    text_col     = 'remarks_text'
    subject_col  = 'subject_content_text'
    category_col = 'CategoryV7'

    # Build mapping — code number to description name
    cat_map_str = dict(zip(
        category_mapping['Code'].astype(str).str.strip().str.split('.').str[0],
        category_mapping['Description'].astype(str).str.strip()
    ))

    # Combine text columns
    df['combined_text'] = (
        df[text_col].fillna('') + ' ' +
        df[subject_col].fillna('')
    )

    # Convert category codes to names
    df['cat_key'] = df[category_col].apply(
        lambda x: str(int(float(x))) if pd.notna(x) else None
    )
    df['category_name'] = df['cat_key'].map(cat_map_str)

    # Clean rows
    df = df.dropna(subset=['category_name'])
    df = df[df['combined_text'].str.len() > 20]

    print(f"📊 After cleaning: {len(df):,} records")

    if len(df) == 0:
        raise Exception("No records after cleaning!")

    # Sample 20,000 for speed
    if len(df) > 20000:
        df = df.sample(20000, random_state=42)
        print(f"⚡ Sampled to 20,000 records")

    # Skip vague/useless categories
    skip_keywords = ['other', 'misc', 'stoppage', 'refund', 'wrong demand']

    def is_meaningful(cat):
        cat_lower = str(cat).lower()
        return not any(skip in cat_lower for skip in skip_keywords)

    meaningful_cats = [
        cat for cat in df['category_name'].value_counts().index
        if is_meaningful(cat)
    ]

    top_cats = meaningful_cats[:10]
    print(f"📋 Meaningful Categories Selected: {top_cats}")

    df = df[df['category_name'].isin(top_cats)]

    texts  = df['combined_text'].tolist()
    labels = df['category_name'].tolist()

    print(f"✅ Final training size: {len(texts):,}")
    print(f"📋 Category Names: {df['category_name'].unique().tolist()}")

    USE_REAL_DATA = True

except Exception as e:
    print(f"⚠️ Real dataset failed: {e}")
    print("🔄 Falling back to built-in training data...")

    training_data = [
        ("pothole on road", "Infrastructure"),
        ("road is damaged", "Infrastructure"),
        ("bridge is broken", "Infrastructure"),
        ("street is flooded", "Infrastructure"),
        ("road has big holes", "Infrastructure"),
        ("road repair needed", "Infrastructure"),
        ("street light not working", "Electricity"),
        ("power cut since 2 days", "Electricity"),
        ("electricity bill issue", "Electricity"),
        ("no electricity in my area", "Electricity"),
        ("transformer is broken", "Electricity"),
        ("no water supply", "Water"),
        ("water pipe leaking", "Water"),
        ("dirty water coming from tap", "Water"),
        ("water shortage in colony", "Water"),
        ("drainage is blocked", "Water"),
        ("garbage not collected", "Sanitation"),
        ("drain is blocked", "Sanitation"),
        ("dirty area near my house", "Sanitation"),
        ("sewage overflow", "Sanitation"),
        ("hospital not providing medicine", "Health"),
        ("doctor absent from clinic", "Health"),
        ("mosquito breeding in area", "Health"),
        ("school teacher absent", "Education"),
        ("no books provided to students", "Education"),
        ("school building is damaged", "Education"),
        ("car accident on road","Health"),
        ("accident on road","Health"),
    ]
    texts  = [t[0] for t in training_data]
    labels = [t[1] for t in training_data]

# ─────────────────────────────────────────
# Clean Text
# ─────────────────────────────────────────

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\u0900-\u097F\s]', ' ', text)
    text = ' '.join(text.split())
    return text

cleaned_texts = [clean_text(t) for t in texts]

# Remove empty texts
cleaned_texts_filtered = []
labels_filtered = []
for ct, lb in zip(cleaned_texts, labels):
    if len(ct.strip()) > 2:
        cleaned_texts_filtered.append(ct)
        labels_filtered.append(lb)

cleaned_texts = cleaned_texts_filtered
labels        = labels_filtered

print(f"🚀 Training models on {len(cleaned_texts)} samples...")

vectorizer = TfidfVectorizer(max_features=5000, stop_words='english', min_df=1)
X = vectorizer.fit_transform(cleaned_texts)

if USE_REAL_DATA and len(cleaned_texts) > 100:
    X_train, X_test, y_train, y_test = train_test_split(
        X, labels, test_size=0.2, random_state=42
    )

    nb_model = MultinomialNB(alpha=0.1)
    nb_model.fit(X_train, y_train)
    nb_acc = accuracy_score(y_test, nb_model.predict(X_test))

    lr_model = LogisticRegression(max_iter=500, random_state=42)
    lr_model.fit(X_train, y_train)
    lr_acc = accuracy_score(y_test, lr_model.predict(X_test))

    print(f"📊 Naive Bayes Accuracy:         {nb_acc:.3f} ({nb_acc*100:.1f}%)")
    print(f"📊 Logistic Regression Accuracy: {lr_acc:.3f} ({lr_acc*100:.1f}%)")

    if lr_acc >= nb_acc:
        model = lr_model
        best_model_name = "Logistic Regression"
    else:
        model = nb_model
        best_model_name = "Naive Bayes"

    print(f"✅ Best Model: {best_model_name} ({max(nb_acc, lr_acc)*100:.1f}% accuracy)")

else:
    model = MultinomialNB()
    model.fit(X, labels)
    best_model_name = "Naive Bayes (fallback)"
    print("✅ Fallback model trained!")

# ─────────────────────────────────────────
# Predict Function
# ─────────────────────────────────────────

def categorize_grievance(text: str) -> str:
    cleaned = clean_text(text)
    if not cleaned.strip():
        return "General"
    X_input = vectorizer.transform([cleaned])
    prediction = model.predict(X_input)
    return str(prediction[0])

def get_model_info() -> dict:
    return {
        "model_used": best_model_name,
        "dataset": "Government of India Real Grievances" if USE_REAL_DATA else "Built-in Training Data",
        "training_samples": len(cleaned_texts),
    }




# def categorize_grievance(description: str) -> str:
#     text = description.lower()
#     if any(w in text for w in ["road", "pothole", "bridge", "street"]):
#         return "Infrastructure"
#     elif any(w in text for w in ["water", "drain", "sewage", "pipe","sanitation"]):
#         return "Sanitation"
#     elif any(w in text for w in ["electricity", "power", "light", "wire","transformer"]):
#         return "Electricity"
#     elif any(w in text for w in ["hospital", "doctor", "medicine", "health","accident"]):
#         return "Health"
#     elif any(w in text for w in ["school", "education", "teacher", "college"]):
#         return "Education"
#     elif any(w in text for w in ["police", "crime", "theft", "safety"]):
#         return "Law & Order"
#     return "General"