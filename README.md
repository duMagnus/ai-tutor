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

### MVP Features

**Parent/Child Authentication & Role Management**
- Parents register, invite children, and manage accounts using Firebase Authentication.
- Role-based access: parents have management privileges, children have learning-only access.
- Suggestion: Use email/password for parents, magic link or code for child onboarding.

**Parent Dashboard**
- View child accounts, monitor progress, time spent, and learning metrics.
- Technologies: React (frontend), Firestore (backend), charts via Chart.js or Recharts.
- Style: Clean, data-focused, with fun accents for engagement.

**Child Dashboard**
- Select/request study topics, view progress, and access lessons.
- Technologies: React, Firestore, OpenAI API for lesson suggestions.
- Style: Bright, playful, with clear navigation and progress bars.

**AI Curriculum Generation**
- Use OpenAI (GPT-4o) to create lesson plans and exercise themes based on selected topics.
- Technologies: Firebase Functions (Node.js), OpenAI SDK, Firestore for storing plans.
- Suggestion: Cache generated plans for efficiency.

**AI Tutoring Sessions**
- Interactive, step-by-step lessons delivered via chat interface.
- Technologies: React (frontend), Firebase Functions (streaming), OpenAI API.
- Style: Chat bubbles, animated responses, markdown support for math/code.

**Progress Tracking**
- Mark modules as complete, show progress bars, and track learning history.
- Technologies: Firestore, React, progress bar components.
- Style: Visual, gamified (badges, streaks optional).

**Subscription Management**
- Parents subscribe to enable platform usage for their children.
- Technologies: Stripe API, Firebase Functions, Firestore for plan status.
- Suggestion: Use Stripe Checkout for simplicity.

**Payment Integration**
- Stripe integration for handling subscriptions and payments.
- Technologies: Stripe, Firebase Functions (webhooks), Firestore.
- Style: Secure, clear, with branded payment forms.

**Localization**
- All user-facing text in Portuguese.
- Technologies: i18n library (e.g., react-i18next), content in Firestore.
- Style: Consistent, culturally appropriate for Brazilian users.

<hr>

### Required Pages

- **Landing Page**: Overview, pricing, and registration. Bright, inviting, with clear CTAs. Technologies: React, styled-components or CSS modules.
- **Parent Sign-Up/Login Page**: Secure registration and login. Technologies: Firebase Auth, React.
- **Parent Dashboard**: See above. Technologies: React, Firestore.
- **Child Invitation/Onboarding Page**: Invite children, onboard with code/magic link. Technologies: React, Firebase Auth.
- **Child Login Page**: Simple login for children. Technologies: Firebase Auth, React.
- **Child Dashboard**: See above.
- **Subject Page (Dynamic)**: Lessons, chat with AI tutor, progress. Technologies: React, OpenAI API, Firestore.
- **Subscription/Payment Page**: Select plan, enter payment details. Technologies: Stripe, React.
- **Error/Status Pages**: For failed payments, access issues, etc. Technologies: React.

<hr>

### Monetary Details

- **Subscription Plans**: At least one paid plan (monthly/annual), possibly a free trial. Suggestion: R$29/month or R$290/year, with 7-day free trial.
- **Payment Flow**: Stripe integration for secure payments. Use Stripe Checkout for PCI compliance.
- **Plan Management**: Ability for parents to upgrade, downgrade, or cancel subscriptions. Technologies: Stripe Customer Portal, Firebase Functions for syncing status.

---

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

### Best Practices: Avoid Inline Styles
- **All component styling must be handled via CSS files or CSS-in-JS solutions.**
- **Inline styles should always be avoided** to ensure maintainability, consistency, and easier updates across the platform.
- Always use CSS classes and follow the style guide for colors, spacing, borders, and typography.

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

## MVP Roadmap (Step-by-Step)

### 1. Project Setup & Core Infrastructure
- Initialize repository, configure Firebase (Auth, Firestore, Functions, Hosting), and set up React frontend.
- Set up environment variables and secrets management for OpenAI and Stripe.

### 2. Authentication & Role Management
- Implement parent registration/login (Firebase Auth, email/password).
- Implement child invitation/onboarding (magic link or code).
- Role-based access: parent (management), child (learning).
- See [Parent/Child Authentication & Role Management](#parentchild-authentication--role-management) for details.

### 3. Parent Dashboard
- Create dashboard for parents to view/manage child accounts.
- Display child progress, time spent, and key metrics (charts).
- Technologies: React, Firestore, Chart.js/Recharts.

### 4. Child Dashboard & Onboarding
- Child login and onboarding flow.
- Dashboard for children to select/request study topics, view progress, and access lessons.
- Technologies: React, Firestore, OpenAI API.

### 5. Localization
- Implement i18n (react-i18next) and ensure all user-facing text is in Portuguese.
- Test with Brazilian users for cultural fit.

### 6. AI Curriculum Generation
- Integrate OpenAI (GPT-4o) via Firebase Functions to generate lesson plans and exercise themes.
- Cache generated plans in Firestore for efficiency.

### 7. Subject Page & AI Tutoring Sessions
- Dynamic Subject Page for lessons and chat with AI tutor.
- Implement interactive, step-by-step lessons via chat interface (streaming, markdown support).
- Technologies: React, Firebase Functions, OpenAI API.

### 8. Progress Tracking
- Mark modules as complete, show progress bars, and track learning history.
- Gamification: badges, streaks (optional).
- Technologies: Firestore, React.

### 9. Subscription Management & Payment Integration
- Implement Stripe subscription plans (monthly/annual, free trial).
- Payment flow: Stripe Checkout, Customer Portal for plan management.
- Technologies: Stripe, Firebase Functions, Firestore.

### 10. Required Pages Implementation
- Landing Page: Overview, pricing, registration.
- Parent Sign-Up/Login Page
- Parent Dashboard
- Child Invitation/Onboarding Page
- Child Login Page
- Child Dashboard
- Subject Page (Dynamic)
- Subscription/Payment Page
- Error/Status Pages

### 11. UI/UX Polish & Accessibility
- Apply style guide, spacing, and responsive design.
- Add accessibility features and mobile-first optimizations.
- Use Material UI or Chakra UI for rapid, consistent styling.

### 12. Testing & QA
- Manual and automated testing of all flows.
- User feedback and bug fixing.

### 13. Deployment & Monitoring
- Deploy frontend and backend to Firebase.
- Set up monitoring, error tracking, and analytics.

---

This roadmap is designed to build the MVP in logical, incremental steps, ensuring that each core feature is implemented and tested before moving to the next. Adjust priorities as needed based on user feedback and business requirements.

## Parent/Child Authentication & Role Management

This section describes how parent and child authentication and role management are implemented in the AI Tutor application.

### Overview
- The app uses Firebase Authentication for secure login and registration.
- Users can register as either a parent or a child.
- Parents can invite children to join via a magic link or invitation code.
- User roles and relationships are stored in Firestore for access control and dashboard management.

### Implementation Details
1. **Role Selection During Signup**
   - Users choose their role (parent or child) during registration.
   - The selected role is saved in Firestore under the user's document.

2. **Parent Invites Child**
   - Parents can invite children by generating a magic link or code from their dashboard.
   - Children use the link/code to register and are automatically associated with the inviting parent in Firestore.

3. **Firestore Structure**
   - `users` collection: Each document contains `uid`, `role`, and (for children) `parentId`.
   - Parents may have a `children` subcollection for easy management.

4. **Role-Based Access**
   - The app checks user roles to display the appropriate dashboard and features.
   - Parents see management tools; children see learning tools and progress.

### Technologies Used
- **Firebase Auth**: User authentication and session management.
- **Firestore**: Storing user roles, relationships, and dashboard data.
- **React**: Frontend UI and routing.

---

## Parent Dashboard Implementation Details

This section describes how the Parent Dashboard is implemented in the AI Tutor application.

### Overview
- The Parent Dashboard allows parents to manage child accounts, view progress, and access learning metrics.
- All data is fetched via backend endpoints (Firebase Functions), never directly from the frontend.
- The dashboard is designed to be clean, data-focused, and engaging for parents.

### Implementation Details
1. **Invite Code Display**
   - The dashboard displays the parent's unique invite code, which can be shared with children for onboarding.
   - The invite code is fetched from the backend via a secure API endpoint.

2. **Child Account Management**
   - Parents can view a list of their child accounts linked via the invite code.
   - Future enhancements may include adding/removing children and managing permissions.

3. **Progress & Metrics Visualization**
   - The dashboard shows each child's learning progress, time spent, and key metrics using charts (e.g., Chart.js or Recharts).
   - Data is fetched from backend endpoints that aggregate and return relevant metrics.

4. **Role-Based Access**
   - Only users with the parent role can access the Parent Dashboard.
   - The frontend routes authenticated parents to the Parent Dashboard after login/signup.

5. **Technologies Used**
   - **React**: Frontend UI and routing.
   - **Firebase Functions**: Backend endpoints for secure data access.
   - **Firestore**: Stores user, child, and progress data (accessed only via backend).
   - **Chart.js/Recharts**: For data visualization.

---

## Child Dashboard & Onboarding Implementation Details

This section describes how the Child Dashboard and onboarding flow are implemented in the AI Tutor application.

### Overview
- The Child Dashboard provides children with access to study topics, lessons, and progress tracking in a playful, engaging interface.
- Onboarding is done via invite code or magic link provided by the parent.
- All data is fetched via backend endpoints (Firebase Functions), never directly from the frontend.

### Implementation Details
1. **Onboarding with Invite Code**
   - Children register using an invite code or magic link provided by their parent.
   - The backend validates the code and links the child to the parent in Firestore.

2. **Dashboard Features**
   - Children can select or request study topics from a curated list.
   - The dashboard displays progress bars, completed modules, and recommended topics.
   - Interactive lessons are delivered via chat interface powered by OpenAI.

3. **Progress Tracking**
   - The dashboard shows progress for each topic, including completion status and streaks (if gamification is enabled).
   - Progress data is fetched from backend endpoints and visualized in the UI.

4. **Role-Based Access**
   - Only users with the child role can access the Child Dashboard.
   - The frontend routes authenticated children to the Child Dashboard after login/signup.

5. **Technologies Used**
   - **React**: Frontend UI and routing.
   - **Firebase Functions**: Backend endpoints for secure data access.
   - **Firestore**: Stores user, parent, and progress data (accessed only via backend).
   - **OpenAI API**: For interactive lessons and curriculum generation.

---

## AI Curriculum Generation Implementation Details

This section describes how AI Curriculum Generation is implemented in the AI Tutor application, covering backend logic, user experience, and design considerations.

### Overview
- The AI Curriculum Generation feature allows parents to request personalized lesson plans and exercise themes for their children, based on selected study topics.
- Parents review the generated curriculum and, if satisfied, approve and assign it to their child for study.
- Curriculum plans are generated on demand and cached for efficiency, ensuring quick access and minimizing repeated API calls.
- The experience is designed to be seamless, engaging, and tailored to each child's learning needs, with parental oversight.

### Implementation Details
1. **Parent-Requested Curriculum Generation & Review**
    - Parents select or request a study topic for their child from the Parent Dashboard.
    - The frontend sends a request to a Firebase Function endpoint to generate a curriculum for the selected topic and child.
    - The backend function calls the OpenAI API (GPT-4o or similar) to generate a curriculum outline and exercise themes for the topic.
    - Generated plans are stored in Firestore and associated with the parent, child, and topic for future retrieval (caching).
    - Parents review the generated curriculum in a dedicated review interface, which includes lesson objectives, key concepts, recommended exercises, and suggested progression.
    - If the parent approves the curriculum, it is assigned to the child and becomes available in the Child Dashboard for study.
    - The backend ensures that plans are age-appropriate and relevant to the selected topic.

2. **Frontend Experience**
    - Parents see a loading animation or progress indicator while the curriculum is being generated.
    - The review interface presents the curriculum in a visually engaging format: cards, lists, or step-by-step modules.
    - Parents can approve, reject, or request changes to the curriculum before assigning it to their child.
    - Once approved, children see the curriculum in their dashboard, with progress tracking and completion status.
    - Children can revisit previously assigned plans from their dashboard.

3. **User Experience & Design**
    - The curriculum review and assignment flow uses the platform's bright, playful style: colorful cards, icons, and progress bars.
    - Lesson objectives and key concepts are highlighted for clarity.
    - Responsive design ensures usability on both desktop and mobile devices.
    - Accessibility features (contrast, readable fonts, alt text) are included for all curriculum content.

4. **Caching & Efficiency**
    - Curriculum plans are cached in Firestore to avoid repeated API calls for the same topic and user.
    - The frontend checks for existing plans before requesting new ones, providing instant access when available.

5. **Localization**
    - All curriculum content is generated and displayed in Portuguese, ensuring cultural relevance for Brazilian users.
    - The UX supports easy switching between topics and revisiting completed modules.

6. **Future Enhancements**
    - Add gamification elements (badges, streaks) for completing lesson plans.
    - Enable parents to suggest curriculum themes and provide feedback on generated plans.
    - Support for adaptive learning: curriculum adjusts based on child’s progress and feedback.
    - Allow children to request topics, with parent approval required before curriculum generation.

### Technologies Used
- **Firebase Functions**: Backend logic and OpenAI API integration.
- **Firestore**: Storing and caching generated curriculum plans.
- **OpenAI API**: Generating lesson plans and exercise themes.
- **React**: Frontend UI and routing.
- **CSS-in-JS or CSS Modules**: Styling curriculum views according to the platform’s visual guide.

---

#### Curriculum Generation Prompt & Response Structure
- When a parent requests a curriculum, the backend sends a prompt to the AI model instructing it to:
  - Generate a **very short, clear title** for the curriculum (max 5 words), suitable for use as a card label in the child dashboard.
  - Return the curriculum as a **JSON object** with the following fields:
    - `title`: Very short curriculum title (used in dashboard cards)
    - `overview`: Brief description of the subject and its importance
    - `objectives`: Array of 3-5 learning objectives
    - `keyConcepts`: Array of key concepts/skills
    - `lessons`: Array of lesson/module objects (each with title, description, goals, activities)
    - `assessment`: Suggestions for assessment (quizzes, projects, etc)
    - `resources`: Additional resources (reading, videos, etc)
- All content is generated in Portuguese and age-appropriate for Brazilian children.
- The backend parses the AI's JSON response and stores each field in Firestore for retrieval and display.
- The frontend displays the curriculum title in the dashboard card, and uses the other fields for detailed curriculum review and lesson delivery.

#### Example AI Prompt
```
You are an expert educational planner. Create a curriculum for the subject: [SUBJECT NAME].

Follow this structure:
1. Title: A very short, clear title for the curriculum (max 5 words).
2. Overview: Briefly describe the subject and its importance for the child's age group.
3. Learning Objectives: List 3-5 clear, age-appropriate objectives for the curriculum.
4. Key Concepts: List the main concepts or skills to be covered.
5. Lesson Breakdown: Divide the curriculum into 4-8 lessons/modules. For each lesson, provide:
   - Title
   - Description
   - Learning goals
   - Suggested activities/exercises
6. Assessment: Suggest ways to assess the child's understanding (quizzes, projects, etc).
7. Additional Resources: Recommend further reading, videos, or interactive materials (if relevant).

Return the result as a JSON object with the following fields: title, overview, objectives, keyConcepts, lessons, assessment, resources. All content must be in Portuguese and suitable for Brazilian children aged [AGE RANGE].
```

#### Frontend Display
- The child dashboard fetches only approved curricula for the logged-in child.
- Each curriculum is shown as a card labeled with the AI-generated short title.
- Clicking a card navigates to the subject page for interactive lessons and exercises.

---

## Database Access Policy

All database (Firestore) access must be performed through backend endpoints (Firebase Functions). The frontend should never access Firestore or any database directly. Instead, the frontend must call backend APIs, and only the backend is responsible for reading/writing to the database. This ensures security, proper access control, and maintainability.
