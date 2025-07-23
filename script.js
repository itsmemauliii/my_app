// Hugging Face Token (optional: use a proxy server if needed)
const headers = {
  Authorization: "Bearer YOUR_HUGGINGFACE_TOKEN", // optional if public model
  "Content-Type": "application/json"
};

async function analyzeDiary() {
  const text = document.getElementById("diaryInput").value;

  // Sentiment Analysis
  const sentiment = await fetch(
    "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ inputs: text })
    }
  ).then(res => res.json());

  const mood = sentiment[0]?.[0]?.label || "Unknown";
  document.getElementById("moodResult").innerText = mood;

  // Summarization
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

  // Prompt suggestion (basic logic)
  let prompt = "Keep going!";
  if (mood.includes("NEGATIVE")) prompt = "Deep breaths. You're doing your best.";
  else if (mood.includes("POSITIVE")) prompt = "You're on a roll today!";
  else prompt = "Stay mindful. You've got this.";

  document.getElementById("promptResult").innerText = prompt;
}

// To-Do List Functions
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();
  if (task) {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" /> ${task}`;
    document.getElementById("taskList").appendChild(li);
    saveTasks();
    taskInput.value = "";
  }
}

function clearTasks() {
  document.getElementById("taskList").innerHTML = "";
  localStorage.removeItem("tasks");
}

function saveTasks() {
  const tasks = document.getElementById("taskList").innerHTML;
  localStorage.setItem("tasks", tasks);
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    document.getElementById("taskList").innerHTML = saved;
  }
}

window.onload = loadTasks;
