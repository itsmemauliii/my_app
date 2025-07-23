async function analyzeDiary() {
  const text = document.getElementById("diaryInput").value;

  if (!text.trim()) {
    alert("Please write something first.");
    return;
  }

  // Sentiment
  try {
    const sentiment = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: text })
      }
    ).then(res => res.json());

    const mood = sentiment[0]?.label || "Unknown";
    document.getElementById("moodResult").innerText = mood;
  } catch (err) {
    document.getElementById("moodResult").innerText = "Error analyzing mood.";
    console.error("Sentiment error:", err);
  }

  // Summary
  try {
    const summary = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: text })
      }
    ).then(res => res.json());

    const summarized = summary?.[0]?.summary_text || "Not available.";
    document.getElementById("summaryResult").innerText = summarized;
  } catch (err) {
    document.getElementById("summaryResult").innerText = "Error summarizing.";
    console.error("Summary error:", err);
  }

  // Prompt Suggestion
  let prompt = "Stay mindful. You've got this.";
  document.getElementById("promptResult").innerText = prompt;
}
