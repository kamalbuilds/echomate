# EchoMate - Voice-Enabled Mental Health Companion

Welcome to EchoMate! An innovative platform that provides personalized mental health support through voice-based AI conversations, helping you manage stress, improve sleep, and address various mental health concerns with evidence-based approaches.

## Overview

EchoMate combines cutting-edge technologies to create a comprehensive mental health toolkit. The application leverages real-time biomarker analysis, multi-modal large language models, and therapeutic techniques from CBT, DBT, and meditation to deliver personalized insights and interventions tailored to your unique needs.

## Features

- **Voice-Enabled Conversations**: Natural voice interaction for a more human-like experience
- **Comprehensive Mental Health Support**: Tools for managing stress, improving sleep, and addressing anxiety
- **Evidence-Based Techniques**: Incorporates CBT, DBT, and meditation practices
- **Real-time Biomarker Analysis**: Uses biometric data to provide personalized insights
- **Multi-modal AI Companion**: Adapts to your emotional state and needs
- **Safe Space for Self-Discovery**: Enhance well-being by boosting self-worth and promoting positive thinking
- **Personalized Interventions**: Tailored recommendations based on your unique patterns
- **Privacy-Focused**: Your data and conversations remain private and secure
- **24/7 Availability**: Access support whenever you need it

## Demo Video 

## Usage

1. Click on "Get Started" to begin the onboarding process
2. Create your profile and share your mental health goals
3. Start a voice conversation with EchoMate by clicking the microphone button
4. Use EchoMate for:
   - Stress management sessions
   - Sleep improvement techniques
   - Anxiety reduction exercises
   - CBT and DBT-based therapy conversations
   - Guided meditation and mindfulness practices
   - Tracking your mental health progress over time
   - Receiving personalized insights based on your interaction patterns

## Technology Stack

- **Frontend**: React, Next.js, Framer Motion, TailwindCSS
- **Real-time Communication**: LiveKit SDK
- **AI Framework**: Multi-modal large language model
- **Biomarker Analysis**: Real-time processing for personalized insights
- **State Management**: React Context API
- **Styling**: TailwindCSS with custom animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- LiveKit API key and secret

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/kamalbuilds
   cd 
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
   NEXT_PUBLIC_PLAYGROUND_VISIBLE_TIMER=300
   NEXT_PUBLIC_PLAYGROUND_EXTRA_TIME=60
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser