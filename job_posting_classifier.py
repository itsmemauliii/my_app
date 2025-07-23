# job_posting_classifier.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score
import joblib
import streamlit as st
import os

# Load or train model and vectorizer
@st.cache_resource
def load_or_train_model():
    if os.path.exists("job_posting_model.pkl") and os.path.exists("tfidf_vectorizer.pkl"):
        clf = joblib.load("job_posting_model.pkl")
        vectorizer = joblib.load("tfidf_vectorizer.pkl")
    else:
        st.info("Model files not found. Training new model...")
        df = pd.read_csv("job_postings.csv")
        df.dropna(subset=['description', 'category'], inplace=True)
        X_train, _, y_train, _ = train_test_split(df['description'], df['category'], test_size=0.2)
        vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        X_train_vec = vectorizer.fit_transform(X_train)
        clf = MultinomialNB()
        clf.fit(X_train_vec, y_train)
        joblib.dump(clf, "job_posting_model.pkl")
        joblib.dump(vectorizer, "tfidf_vectorizer.pkl")
    return clf, vectorizer

clf, vectorizer = load_or_train_model()

# Streamlit UI
st.title("Job Posting Category Classifier")
st.write("Paste a job description below, and I'll guess the category!")

user_input = st.text_area("Job Description", height=200)

if st.button("Classify"):
    if user_input.strip() == "":
        st.warning("Please enter some text!")
    else:
        input_vec = vectorizer.transform([user_input])
        prediction = clf.predict(input_vec)[0]
        st.success(f"Predicted Category: {prediction}")
