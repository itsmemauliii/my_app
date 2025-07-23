async function analyzeDiary() {
  const text = document.getElementById("diaryInput").value.trim();
  if (!text) return alert("Please write something first!");

  const headers = {
    Authorization: "Bearer hf_L------------------------------",
    "Content-Type": "application/json"
  };

  // Sentiment
  try {
    const sentimentRes = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: text })
      }
    );
    const sentimentData = await sentimentRes.json();

    const mood = sentimentData[0]?.label || "Unknown";
    document.getElementById("moodResult").innerText = mood;
  } catch (error) {
    console.error("Sentiment Error:", error);
    document.getElementById("moodResult").innerText = "Error detecting mood.";
  }

  // Summarization
  try {
    const summaryRes = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: text })
      }
    );
    const summaryData = await summaryRes.json();

    const summary = summaryData[0]?.summary_text || "Not available.";
    document.getElementById("summaryResult").innerText = summary;
  } catch (error) {
    console.error("Summary Error:", error);
    document.getElementById("summaryResult").innerText = "Error summarizing.";
  }

  // Prompt logic based on mood
  const moodVal = document.getElementById("moodResult").innerText;
  let prompt = "Stay mindful. You've got this.";
  if (moodVal.includes("POSITIVE")) prompt = "You’re radiating good vibes! Keep going!";
  else if (moodVal.includes("NEGATIVE")) prompt = "Tough days pass. You've handled worse.";
  else if (moodVal.includes("NEUTRAL")) prompt = "Stable and steady — that’s strength.";

  document.getElementById("promptResult").innerText = prompt;
}

