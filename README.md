# AI Tutor Platform (MVP)

**AI-powered learning assistant for children with parental subscription and control**

## Overview

AI Tutor is a subscription-based educational platform designed to help children improve academic performance through interactive, guided lessons powered by OpenAI models. Parents can subscribe and manage their children's learning journey, tracking progress, time spent, and areas of difficulty.

## Key Features
- **Subscription-based access**: Parents register and subscribe to enable usage.
- **Parental control & dashboard**: Invite and manage child accounts, monitor learning activity, progress, time spent, strengths, and areas needing improvement.
- **Customizable learning themes**: Children choose from predefined topics or propose new ones.
- **AI-generated curriculum**: An advanced OpenAI model (e.g. GPT-4) plans lesson content and exercise themes based on the selected topic.
- **Step-by-step tutoring**: A streamlined model (e.g. GPT-3.5 or GPT-4o) delivers lessons in interactive stages, guiding the child through exercises without simply giving answers.
- **Progress tracking**: Completed modules are marked as done; parents can view detailed insights.

## Technology Stack
| Layer                   | Technology                         |
|-------------------------|------------------------------------|
| Frontend                | React / React Native (Mobile-first)|
| Backend / Services      | Firebase (Auth, Firestore, Cloud Functions, Hosting) |
| AI / LLM                | OpenAI API (GPT-4 for planning, GPT-4o/GPT-3.5 for tutoring) |
| Payment Integration     | Stripe (planned)                   |

## Architecture Overview
1. **Authentication & Roles**: Firebase Auth manages parent and child accounts with role-based access.
2. **Database**: Firestore stores user profiles, sessions, progress, and usage metrics.
3. **Serverless Logic**: Firebase Cloud Functions orchestrate OpenAI API calls, content generation, and progress updates.
4. **Hosting**: Deploy web (or PWA) via Firebase Hosting; React Native for native mobile apps.
5. **AI Services**: Two-tier AI pipeline:
   - **Curriculum Planner**: Advanced model generates full lesson outlines and exercise themes.
   - **Lesson Tutor**: Streamlined model guides children through lessons interactively.

## MVP Scope
This MVP focuses on the core learning experience and parental oversight:
- Parent/Child authentication and role management
- Basic parent dashboard to invite child accounts and view high-level metrics
- Child-facing UI for selecting or requesting topics
- Integration with OpenAI for curriculum planning and interactive tutoring
- Progress tracking and module completion status

## Roadmap & Next Steps
1. **Project Initialization**
   - [x] Set up React Vite frontend boilerplate in `frontend` directory
   - [ ] Configure Firebase project (Auth, Firestore, Functions, Hosting)
   - [ ] Store OpenAI API keys securely (e.g., `.env` for local dev, Cloud Functions config)
2. **Authentication & Onboarding**
   - [ ] Implement parent sign-up and subscription flow
   - [ ] Child account invitation & onboarding
3. **AI Curriculum & Tutoring**
   - [ ] Cloud Function for curriculum generation (GPT-4)
   - [ ] Cloud Function for interactive tutoring sessions (GPT-4o/GPT-3.5)
   - [ ] UI components for lesson delivery and exercises
4. **Parental Dashboard**
   - [ ] Monitor child sessions, time spent, and progress
   - [ ] Track topics completed and areas needing review
5. **Payment & Billing**
   - [ ] Integrate Stripe for subscription management
6. **Quality Enhancements**
   - [ ] UX improvements and accessibility
   - [ ] Testing & QA
   - [ ] Localization and multi-language support

## Visual Style Guide

Our design aims for a bright, fun, and dynamic experience. Below are the core visual guidelines to ensure consistency:

### Color Palette
- **Primary**: #3B82F6 (Blue) — for primary buttons, links, and highlights
- **Secondary**: #FBBF24 (Amber) — for callouts and secondary accents
- **Background**: #FFFFFF (White) — main background
- **Surface**: #F3F4F6 (Gray-100) — cards and sections
- **Text Primary**: #1F2937 (Gray-800) — headlines and body text
- **Text Secondary**: #4B5563 (Gray-600) — secondary text and captions

### Typography
- **Font Family**: `Poppins`, `Arial`, sans-serif — modern, rounded, friendly
- **Headings**: bold weight, clear hierarchy (H1 ~2.5rem, H2 ~2rem, H3 ~1.5rem)
- **Body**: regular weight, 1rem size, 1.5 line-height

### Borders & Shapes
- **Corners**: 12px border-radius — softly rounded for cards, images, buttons
- **Buttons & Inputs**: 8px border-radius for a slightly more subtle curve
- **Cards**: slight elevation (box-shadow: 0 2px 8px rgba(0,0,0,0.1))

### Motion & Interaction
- **Transition**: 200ms ease-in-out on hover/focus states
- **Hover Effects**: lighten background or shift elevation for interactive elements

### Spacing Guidelines

To ensure a clean and visually appealing layout, follow these spacing guidelines:

- **Padding**: Use consistent padding around elements to create a balanced layout. For example, `2rem` to `3rem` padding works well for page content.
- **Gaps**: Maintain a gap of `1rem` to `2rem` between elements in flex containers for better readability and structure.
- **Margins**: Apply margins to separate sections or components, ensuring they don't feel cramped.
- **Responsiveness**: Adjust spacing dynamically for smaller screens to maintain usability and aesthetics.

These guidelines aim to create a cohesive and user-friendly design across the application.

## User Dashboard

Once logged in, users will no longer see the landing page as their home. Instead, they will be directed to a personalized **User Dashboard**. This page is designed to provide a seamless and interactive experience for users to explore and engage with learning materials.

### Features

1. **Search Field for Study Topics**
   - At the top of the dashboard, there will be a prominent text input field where users can type in topics they want to study.
   - Example: A user can type "fractions" or "photosynthesis" to receive tailored content and exercises.
   - A "Search" button will accompany the field to trigger the search functionality.

2. **Prepared Topics Section**
   - Below the search field, users will find a curated list of topics organized by subject.
   - Each subject will have its own section with clickable cards for specific topics. For example:
     - **Mathematics**: Addition, Subtraction, Division, Exponents, Fractions, Geometry.
     - **Science**: Photosynthesis, States of Matter, Newton's Laws, The Solar System.
     - **History**: Ancient Civilizations, World Wars, Industrial Revolution.
     - **Languages**: Grammar, Vocabulary, Reading Comprehension.
   - Clicking on a topic will navigate the user to a dedicated page with lessons, exercises, and progress tracking.

3. **Design and Layout**
   - The design will follow the existing platform's clean and modern aesthetic:
     - **Header**: The navigation bar (already implemented) will remain at the top, providing quick access to "Home," "Logout," and other future features.
     - **Search Field**: Centered at the top of the page, styled with a rounded border and a subtle shadow to make it stand out.
     - **Topic Sections**: Each subject will have a distinct color theme for its cards (e.g., blue for Mathematics, green for Science).
     - **Responsive Design**: The layout will adapt to different screen sizes, ensuring usability on both desktop and mobile devices.

4. **Additional Features**
   - **Progress Tracking**: Users can see their progress for each topic, displayed as a percentage or a progress bar.
   - **Recommended Topics**: Based on the user's activity, the dashboard will suggest topics to explore next.
   - **Quick Access Links**: A sidebar or a section for recently accessed topics or favorite topics.

5. **Future Enhancements**
   - **Gamification**: Add badges or rewards for completing topics or achieving milestones.
   - **Community Features**: Allow users to ask questions or share insights on topics with others.
   - **AI Tutor Assistance**: Integrate an AI chatbot to provide instant help or explanations for study queries.

This dashboard will serve as the central hub for logged-in users, making the platform engaging, intuitive, and effective for learning.

## Subject Page Template

The **Subject Page** is a dynamic template used for all subjects. Instead of creating a new component for each subject, the page dynamically fetches and displays information based on the selected subject. This approach ensures consistency and reduces redundancy in the codebase.

### Layout Details

1. **Header**
   - The page includes the existing navigation bar (`Navbar`) at the top for consistent navigation across the platform.

2. **Subject Title**
   - The subject name is prominently displayed at the top of the page.
   - Example: "Matemática" or "Ciências".

3. **Chat Window**
   - The central feature of the page is a **chat window** where students can interact with an LLM (Large Language Model) for lessons and exercises.
   - **Design**:
     - The chat window occupies the majority of the page.
     - Messages are displayed in a scrollable area, with the student's messages aligned to the right and the LLM's responses aligned to the left.
     - A text input field is located at the bottom of the chat window for students to type their messages.
     - A "Send" button is provided to submit messages.

4. **Additional Information Section**
   - Below the chat window, there is space for additional subject-related information, such as:
     - Key concepts.
     - Recommended exercises.
     - Progress tracking.

5. **Responsive Design**
   - The layout is fully responsive, ensuring usability on both desktop and mobile devices.

### Future Enhancements

- **Database Integration**: Subject-specific information will be fetched from a database.
- **LLM Integration**: The chat window will be connected to an LLM API to provide interactive lessons and exercises.
- **Progress Tracking**: Students' interactions and progress will be tracked and displayed on the page.
- **Gamification**: Add badges or rewards for completing lessons or achieving milestones.

This template ensures a consistent and engaging experience for students across all subjects while allowing for future scalability and enhancements.

## Localization

The platform is designed for Brazilian users, and all user-facing text must be in Portuguese. This includes navigation, instructions, and any interactive elements such as buttons, labels, and messages. Ensure consistency in language usage across all pages and features.

## Contributing
We will update this README continuously as development progresses. Feel free to contribute ideas, code, or feedback via issues and pull requests.

---

*Let's learn and grow together!*

### Implementing LLM Functionality

To enable interaction with the LLM (Large Language Model) in the application, follow these detailed steps:

1. **Set Up OpenAI API**
   - Obtain an API key from OpenAI by signing up at [OpenAI's website](https://openai.com/).
   - For local development, store the API key in a `.env` file inside your `functions` directory:
     ```env
     OPENAI_API_KEY=your_api_key_here
     ```
   - Install the `dotenv` package in your `functions` directory:
     ```bash
     npm install dotenv
     ```
   - In your Cloud Function code, load the environment variable using `dotenv`:
     ```javascript
     require('dotenv').config();
     const apiKey = process.env.OPENAI_API_KEY;
     ```
   - For production, use Firebase Functions' environment configuration:
     ```bash
     firebase functions:config:set openai.key="your_api_key_here"
     ```
   - Deploy the configuration to Firebase:
     ```bash
     firebase deploy --only functions
     ```

2. **Create a Firebase Function for OpenAI Integration**
   - In the `functions` directory of your Firebase project, create a new HTTP function to handle communication with the OpenAI API.
   - The function should:
     - Accept user input from the frontend.
     - Forward the input to the OpenAI API using the stored API key.
     - Return the response from OpenAI to the frontend.
   - Example structure for the function:
     ```javascript
     const functions = require("firebase-functions");
     const axios = require("axios");
     require('dotenv').config();

     exports.llmHandler = functions.https.onRequest(async (req, res) => {
       try {
         // Use .env for local dev, Firebase config for production
         const apiKey = process.env.OPENAI_API_KEY || functions.config().openai.key;
         const { prompt } = req.body;

         if (!prompt) {
           return res.status(400).send({ error: 'Prompt is required.' });
         }

         const response = await axios.post(
           "https://api.openai.com/v1/completions",
           {
             model: "text-davinci-003",
             prompt,
             max_tokens: 150,
           },
           {
             headers: { Authorization: `Bearer ${apiKey}` },
           }
         );

         res.status(200).send(response.data);
       } catch (error) {
         res.status(500).send({ error: error.message });
       }
     });
     ```

3. **Deploy the Firebase Function**
   - Deploy the function to Firebase:
     ```bash
     firebase deploy --only functions
     ```

4. **Frontend Integration**
   - Update the frontend to send user input to the Firebase Function endpoint instead of directly calling the OpenAI API.
   - Use `fetch` or `axios` to make HTTP requests to the Firebase Function.

5. **Create a Utility for API Calls**
   - Add a utility file (e.g., `src/utils/api.js`) in the frontend to handle requests to the Firebase Function.
   - Example:
     ```javascript
     import axios from "axios";

     export const sendMessageToLLM = async (prompt) => {
       try {
         const response = await axios.post("/api/llm", { prompt });
         return response.data;
       } catch (error) {
         console.error("Error communicating with LLM:", error);
         throw error;
       }
     };
     ```

6. **Integrate LLM in the Subject Page**
   - Update the `SubjectPage.jsx` file to include functionality for sending user messages to the Firebase Function and displaying the responses.
   - Use the utility created in step 5 to handle API calls.

7. **Handle User Input and Responses**
   - Modify the chat interface to send user input to the Firebase Function when the user presses Enter or clicks the send button.
   - Display the LLM's response in the chat window.

8. **Test the Integration**
   - Run the application and navigate to the Subject Page.
   - Test the chat functionality by sending messages to the LLM and verifying the responses.

9. **Error Handling and Edge Cases**
   - Implement error handling for API failures (e.g., network issues, invalid API key).
   - Handle edge cases such as empty user input or long response times.

10. **Styling and UI Enhancements**
    - Ensure the chat interface is user-friendly and visually appealing.
    - Add loading indicators while waiting for the LLM's response.

11. **Deployment**
    - Ensure the `.env` file and Firebase configuration are excluded from version control.
    - Deploy both the frontend and backend services and verify the LLM functionality in the production environment.

By following these steps, you can securely and efficiently integrate LLM functionality into the application, leveraging Firebase Functions to maintain best practices for security and scalability.
