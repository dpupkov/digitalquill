# IELTS Writing Practice Tool

A simple browser-based application for practicing IELTS General Training Writing tasks with AI-powered feedback using Google Gemini API.

## Project Overview

This is an MVP (Minimum Viable Product) web application designed to help users practice IELTS General Training Writing tasks with instant AI feedback. The entire application runs in the browser with no backend required.

## Features

### Core Functionality

1. **API Key Configuration**
   - Simple input field for users to enter their Google Gemini API key
   - API key stored locally in browser (localStorage) for convenience
   - No server-side storage required

2. **Task Generation**
   - "Generate IELTS Generic Writing Task" button
   - Triggers AI request to Google Gemini API
   - Generates authentic IELTS General Training Writing Task 1 or Task 2 prompts
   - Task displayed clearly on the same page

3. **Countdown Timer**
   - Automatically starts when task is generated
   - Displays remaining time at the top of the page
   - Standard IELTS timing:
     - Task 1: 20 minutes
     - Task 2: 40 minutes
   - Visual indicator (color change when time is running low)
   - Timer continues even if page is refreshed (using localStorage)

4. **Response Input**
   - Large text area for user to write their response
   - Word counter (IELTS requires minimum word counts)

5. **AI Evaluation**
   - "Submit for Evaluation" button sends both task and response to Gemini
   - Structured JSON response with:
     - **Estimated IELTS Band Score** (0-9 scale)
     - **Task Achievement** - How well the task requirements were met
     - **Coherence and Cohesion** - Organization and flow
     - **Lexical Resource** - Vocabulary range and accuracy
     - **Grammatical Range and Accuracy** - Grammar usage
     - **Detailed Error List** - Specific mistakes with explanations
     - **Improvement Suggestions** - Actionable feedback
     - **Corrected Version** - Example of improved text

6. **Results Display**
   - Clean, organized presentation of evaluation results
   - Complete detailed feedback

7. **Progress Tracking**
   - Automatic saving of all evaluation results to localStorage
   - Historical data includes:
     - Date and time with timezone (ISO 8601 format)
     - Task type (Task 1 or Task 2)
     - Band score achieved
     - Task prompt (for reference)
   - "View History" button to display past results
   - Simple list view showing chronological results

## Technical Stack

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - All logic and API interactions
- **Google Gemini API** - AI-powered task generation and evaluation
- **LocalStorage** - Client-side data persistence

## Project Structure

```
ielts_written/
├── index.html          # Main application page
├── styles.css          # All styling
├── script.js           # Application logic
└── README.md           # This file
```

## Setup Instructions

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Obtain a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Enter your API key in the application
5. Start practicing!

## Usage Flow

1. **Enter API Key** → User enters their Gemini API key
2. **Generate Task** → Click button to generate IELTS writing task
3. **Timer Starts** → Countdown begins automatically
4. **Write Response** → User types their answer in the text area
5. **Submit** → Click "Submit for Evaluation" button
6. **View Feedback** → Receive detailed AI evaluation and band score
7. **Practice Again** → Generate new task or modify response

## API Integration

### Gemini API Endpoints
- Task Generation: Uses creative prompt to generate IELTS-style tasks
- Evaluation: Sends task + response for structured feedback in JSON format

### Prompt Engineering
- **Task Generation Prompt**: Request authentic IELTS General Training tasks with proper format
- **Evaluation Prompt**: Request structured feedback following official IELTS criteria

## Additional Features to Consider

### Phase 1 (MVP)
- [x] API key input
- [x] Task generation
- [x] Timer functionality
- [x] Response input with word counter
- [x] AI evaluation
- [x] Results display
- [x] Task type selection (Task 1 Letter vs Task 2 Essay)
- [x] Progress tracking over time (datetime + timezone, band scores, simple history view)

## IELTS Writing Criteria

The evaluation follows official IELTS assessment criteria:

### Task 1 (Letter Writing) - 150 words minimum
- **Task Achievement** (25%)
- **Coherence and Cohesion** (25%)
- **Lexical Resource** (25%)
- **Grammatical Range and Accuracy** (25%)

### Task 2 (Essay Writing) - 250 words minimum
- **Task Response** (25%)
- **Coherence and Cohesion** (25%)
- **Lexical Resource** (25%)
- **Grammatical Range and Accuracy** (25%)

## Security Considerations

- API keys stored in browser localStorage (never sent to any server except Google)
- No backend = no data collection
- Users maintain full control of their data

## Contributing

This is a personal pet project, suggestions and improvements are [ not ] welcomed!

## Disclaimer

This tool is for practice purposes only. The AI-generated scores are estimates and may not reflect actual IELTS exam results. For official preparation, consult authorized IELTS preparation materials.

## Resources

- [Official IELTS Website](https://www.ielts.org/)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [IELTS Band Descriptors](https://www.ielts.org/for-teachers/teaching-resources/band-descriptors)

---

**Note**: You will need your own Google Gemini API key. API usage may incur costs depending on your usage tier.
