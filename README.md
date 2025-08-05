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

Use these tokens and guidelines across all screens to keep the UI cohesive and engaging.

## Contributing
We will update this README continuously as development progresses. Feel free to contribute ideas, code, or feedback via issues and pull requests.

---

*Let's learn and grow together!* 