// Constants
const MODEL_NAME = 'gemini-2.5-pro';
const TASK_DURATIONS = {
    task1: 20 * 60, // 20 minutes in seconds
    task2: 40 * 60  // 40 minutes in seconds
};
const MIN_WORD_COUNTS = {
    task1: 150,
    task2: 250
};

// State
let timerInterval = null;
let currentTask = null;

// DOM Elements
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const apiStatus = document.getElementById('apiStatus');
const taskTypeSelect = document.getElementById('taskType');
const generateTaskBtn = document.getElementById('generateTask');
const manualTaskInput = document.getElementById('manualTaskInput');
const startManualTaskBtn = document.getElementById('startManualTask');
const taskDisplay = document.getElementById('taskDisplay');
const taskContent = document.getElementById('taskContent');
const timerSection = document.getElementById('timerSection');
const timerValue = document.getElementById('timerValue');
const responseSection = document.getElementById('responseSection');
const responseInput = document.getElementById('responseInput');
const wordCount = document.getElementById('wordCount');
const wordWarning = document.getElementById('wordWarning');
const submitResponseBtn = document.getElementById('submitResponse');
const resultsSection = document.getElementById('resultsSection');
const evaluationResults = document.getElementById('evaluationResults');
const viewHistoryBtn = document.getElementById('viewHistory');
const historyDisplay = document.getElementById('historyDisplay');

// Initialize
function init() {
    loadApiKey();
    loadTimerState();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    saveApiKeyBtn.addEventListener('click', saveApiKey);
    generateTaskBtn.addEventListener('click', generateTask);
    startManualTaskBtn.addEventListener('click', startManualTask);
    responseInput.addEventListener('input', updateWordCount);
    submitResponseBtn.addEventListener('click', submitForEvaluation);
    viewHistoryBtn.addEventListener('click', toggleHistory);
}

// API Key Management
function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('geminiApiKey', apiKey);
        showStatus('API Key saved successfully!', 'success');
    } else {
        showStatus('Please enter a valid API key', 'error');
    }
}

function loadApiKey() {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) {
        apiKeyInput.value = savedKey;
        showStatus('API Key loaded', 'success');
    }
}

function getApiKey() {
    return localStorage.getItem('geminiApiKey');
}

function showStatus(message, type) {
    apiStatus.textContent = message;
    apiStatus.className = `status-message ${type}`;
    setTimeout(() => {
        apiStatus.textContent = '';
        apiStatus.className = 'status-message';
    }, 3000);
}

// Task Handling
function handleTaskStart(taskType, taskText) {
    currentTask = {
        type: taskType,
        content: taskText,
        startTime: Date.now()
    };

    taskContent.textContent = taskText;
    taskDisplay.style.display = 'block';
    responseSection.style.display = 'block';
    responseInput.value = '';
    updateWordCount();
    
    startTimer(taskType);
    saveTimerState();
}

// Task Generation
async function generateTask() {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Please save your API key first!');
        return;
    }

    const taskType = taskTypeSelect.value;
    generateTaskBtn.classList.add('loading');
    generateTaskBtn.disabled = true;

    try {
        const prompt = getTaskGenerationPrompt(taskType);
        const response = await callGeminiAPI(apiKey, prompt);
        handleTaskStart(taskType, response);
    } catch (error) {
        alert('Error generating task: ' + error.message);
    } finally {
        generateTaskBtn.classList.remove('loading');
        generateTaskBtn.disabled = false;
    }
}

function startManualTask() {
    const taskText = manualTaskInput.value.trim();
    if (!taskText) {
        alert('Please paste your task into the text area first.');
        return;
    }

    const taskType = taskTypeSelect.value;
    handleTaskStart(taskType, taskText);
    manualTaskInput.value = ''; // Clear the input after starting
}

function getTaskGenerationPrompt(taskType) {
    if (taskType === 'task1') {
        return `Generate an authentic and varied IELTS General Training Writing Task 1 (Letter Writing) prompt.
Ensure the generated task is unique and covers a wide range of possible scenarios and tones that are used in IELTS General Writing Test Task 1.
Specifically, randomize the following aspects:
- The situation: It could be about accommodation, work, a social event, a complaint, a request for information, etc.
- The required tone: Randomly choose between formal (e.g., writing to a company manager), semi-formal (e.g., writing to a landlord), or informal (e.g., writing to a friend).
The prompt must include a clear situation and three bullet points specifying what the letter should cover.
Format it exactly as it would appear in an actual IELTS exam.
Only return the task prompt, nothing else. Do not use markdown formatting.`;
    } else {
        return `Generate an authentic and varied IELTS General Training Writing Task 2 (Essay Writing) prompt.
Ensure the generated task is unique and covers a wide range of possible topics and question formats.
Specifically, randomize the following aspects:
- The topic: Choose from a diverse range of subjects like technology, environment, education, work-life balance, globalization, health, or social issues.
- The question type: Randomly select one of the common IELTS formats, such as 'Agree or Disagree', 'Discuss both views and give your opinion', 'Advantages and Disadvantages', 'Problem and Solution', or a 'Two-part question'.
The prompt should present a clear statement or question for the test-taker to respond to.
Format it exactly as it would appear in an actual IELTS exam.
Only return the task prompt, nothing else.`;
    }
}

// Timer Management
function startTimer(taskType) {
    clearInterval(timerInterval);
    
    const duration = TASK_DURATIONS[taskType];
    let remainingSeconds = duration;

    timerSection.style.display = 'block';
    updateTimerDisplay(remainingSeconds, duration);

    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay(remainingSeconds, duration);
        saveTimerState();

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            alert('Time is up!');
        }
    }, 1000);
}

function updateTimerDisplay(seconds, totalDuration) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerValue.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Warning when less than 5 minutes remaining
    if (seconds < 300 && seconds > 0) {
        timerSection.classList.add('warning');
    } else {
        timerSection.classList.remove('warning');
    }
}

function saveTimerState() {
    if (currentTask) {
        localStorage.setItem('timerState', JSON.stringify({
            task: currentTask,
            savedAt: Date.now()
        }));
    }
}

function loadTimerState() {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
        const { task, savedAt } = JSON.parse(savedState);
        const elapsed = Math.floor((Date.now() - task.startTime) / 1000);
        const duration = TASK_DURATIONS[task.type];

        if (elapsed < duration) {
            currentTask = task;
            taskContent.textContent = task.content;
            taskDisplay.style.display = 'block';
            responseSection.style.display = 'block';
            
            const remainingSeconds = duration - elapsed;
            timerSection.style.display = 'block';
            updateTimerDisplay(remainingSeconds, duration);

            timerInterval = setInterval(() => {
                const newElapsed = Math.floor((Date.now() - task.startTime) / 1000);
                const newRemaining = duration - newElapsed;
                
                if (newRemaining <= 0) {
                    clearInterval(timerInterval);
                    alert('Time is up!');
                    return;
                }
                
                updateTimerDisplay(newRemaining, duration);
            }, 1000);
        } else {
            localStorage.removeItem('timerState');
        }
    }
}

// Word Counter
function updateWordCount() {
    const text = responseInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = words;

    const minWords = MIN_WORD_COUNTS[currentTask?.type || 'task1'];
    if (words < minWords) {
        wordWarning.textContent = `(Minimum ${minWords} words required)`;
    } else {
        wordWarning.textContent = '';
    }
}

// Submit for Evaluation
async function submitForEvaluation() {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('Please save your API key first!');
        return;
    }

    const response = responseInput.value.trim();
    if (!response) {
        alert('Please write your response first!');
        return;
    }

    const words = response.split(/\s+/).length;
    const minWords = MIN_WORD_COUNTS[currentTask.type];
    if (words < minWords) {
        const proceed = confirm(`Your response has only ${words} words (minimum ${minWords}). Submit anyway?`);
        if (!proceed) return;
    }

    submitResponseBtn.classList.add('loading');
    submitResponseBtn.disabled = true;

    try {
        const prompt = getEvaluationPrompt(currentTask.content, response, currentTask.type, words);
        const evaluation = await callGeminiAPI(apiKey, prompt);
        
        displayResults(evaluation);
        saveToHistory(evaluation);
        
        clearInterval(timerInterval);
        localStorage.removeItem('timerState');

    } catch (error) {
        alert('Error evaluating response: ' + error.message);
    } finally {
        submitResponseBtn.classList.remove('loading');
        submitResponseBtn.disabled = false;
    }
}

function getEvaluationPrompt(task, response, taskType, wordCount) {
    return `You are an IELTS examiner. Evaluate the following IELTS General Training Writing ${taskType === 'task1' ? 'Task 1 (Letter)' : 'Task 2 (Essay)'} response.

The user's response contains exactly ${wordCount} words. Please use this number for your evaluation and do not calculate it yourself.

TASK:
${task}

RESPONSE:
${response}

Provide a detailed evaluation in the following JSON format:
{
    "bandScore": (number 0-9 with 0.5 increments),
    "taskAchievement": "(detailed feedback on how well the task requirements were met)",
    "coherenceCohesion": "(feedback on organization, paragraphing, and logical flow)",
    "lexicalResource": "(feedback on vocabulary range, accuracy, and appropriateness)",
    "grammaticalRange": "(feedback on grammar variety and accuracy)",
    "errors": [
        {"error": "specific mistake", "explanation": "why it's wrong", "correction": "how to fix it"}
    ],
    "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"],
    "correctedVersion": "(a corrected and improved version of the response)"
}

Only return valid JSON, nothing else.`;
}

function displayResults(evaluationText) {
    try {
        // Try to parse JSON from the response
        const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
        const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!evaluation) {
            throw new Error('Invalid JSON response');
        }

        let html = `
            <div class="band-score">
                Band Score: ${evaluation.bandScore}
            </div>
            
            <div class="criteria-section">
                <h3>Task Achievement</h3>
                <p>${evaluation.taskAchievement}</p>
            </div>
            
            <div class="criteria-section">
                <h3>Coherence and Cohesion</h3>
                <p>${evaluation.coherenceCohesion}</p>
            </div>
            
            <div class="criteria-section">
                <h3>Lexical Resource</h3>
                <p>${evaluation.lexicalResource}</p>
            </div>
            
            <div class="criteria-section">
                <h3>Grammatical Range and Accuracy</h3>
                <p>${evaluation.grammaticalRange}</p>
            </div>
        `;

        if (evaluation.errors && evaluation.errors.length > 0) {
            html += '<div class="criteria-section"><h3>Errors Found</h3>';
            evaluation.errors.forEach(error => {
                html += `
                    <div class="error-item">
                        <strong>Error:</strong> ${error.error}<br>
                        <strong>Explanation:</strong> ${error.explanation}<br>
                        <strong>Correction:</strong> ${error.correction}
                    </div>
                `;
            });
            html += '</div>';
        }

        if (evaluation.improvements && evaluation.improvements.length > 0) {
            html += '<div class="criteria-section"><h3>Improvement Suggestions</h3><ul>';
            evaluation.improvements.forEach(improvement => {
                html += `<li>${improvement}</li>`;
            });
            html += '</ul></div>';
        }

        if (evaluation.correctedVersion) {
            html += `
                <div class="criteria-section">
                    <h3>Corrected Version</h3>
                    <div class="corrected-version">${evaluation.correctedVersion}</div>
                </div>
            `;
        }

        evaluationResults.innerHTML = html;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        // Fallback: display raw text if JSON parsing fails
        evaluationResults.innerHTML = `<pre>${evaluationText}</pre>`;
        resultsSection.style.display = 'block';
    }
}

// History Management
function saveToHistory(evaluationText) {
    try {
        const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
        const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : { bandScore: 'N/A' };

        const historyItem = {
            date: new Date().toISOString(),
            taskType: currentTask.type,
            bandScore: evaluation.bandScore,
            task: currentTask.content
        };

        const history = JSON.parse(localStorage.getItem('history') || '[]');
        history.unshift(historyItem);
        localStorage.setItem('history', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving to history:', error);
    }
}

function toggleHistory() {
    if (historyDisplay.style.display === 'none') {
        displayHistory();
        historyDisplay.style.display = 'block';
    } else {
        historyDisplay.style.display = 'none';
    }
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    
    if (history.length === 0) {
        historyDisplay.innerHTML = '<p style="text-align: center; color: #666;">No practice history yet.</p>';
        return;
    }

    let html = '<h2>Practice History</h2>';
    history.forEach((item, index) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleString();
        
        html += `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-item-date">${formattedDate}</span>
                    <span class="history-item-score">Band: ${item.bandScore}</span>
                </div>
                <div><strong>Task Type:</strong> ${item.taskType === 'task1' ? 'Task 1 (Letter)' : 'Task 2 (Essay)'}</div>
                <div class="history-item-task"><strong>Task:</strong> ${item.task.substring(0, 150)}...</div>
            </div>
        `;
    });

    historyDisplay.innerHTML = html;
}

// Gemini API Call
async function callGeminiAPI(apiKey, prompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{
                    text: prompt
                }]
            }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Start the application
init();
