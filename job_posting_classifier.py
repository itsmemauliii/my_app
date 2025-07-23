# job_posting_classifier.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score
import joblib
import streamlit as st

# Load the model and vectorizer
@st.cache_resource
def load_model():
    clf = joblib.load("job_posting_model.pkl")
    vectorizer = joblib.load("tfidf_vectorizer.pkl")
    return clf, vectorizer

clf, vectorizer = load_model()

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
