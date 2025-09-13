# Tasker - Task Management Application

A comprehensive task management application built with Next.js, featuring integrated timers, drag-and-drop Kanban board, AI-powered enhancements, user authentication, and persistent storage with MongoDB.

## Features

- **User Authentication**: Secure login/signup with NextAuth.js and JWT sessions
- **Task Creation and Timers**: Add tasks with integrated timers that track elapsed time in real-time
- **Completion Animation**: Celebratory confetti animation upon task completion
- **Task Logging**: Automatic logging of completed tasks with start/end times and total duration
- **Kanban Board**: Drag-and-drop interface with four columns (TODO, DOING, ON HOLD, DONE)
- **AI Enhancement**: OpenAI-powered suggestions for task improvements, subtasks, priorities, and time estimates
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **MongoDB Storage**: Persistent data storage with user-specific task management
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Authentication**: NextAuth.js with JWT
- **Database**: MongoDB with MongoDB Adapter
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **Animations**: react-confetti
- **AI**: OpenAI API
- **Theme**: next-themes
- **Icons**: Lucide React

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/tasker

# AI Features (Optional)
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

### Authentication Setup

The app uses NextAuth.js for user authentication with credentials provider and MongoDB for user storage.

1. **Generate NEXTAUTH_SECRET**: Use `openssl rand -base64 32` or an online generator
2. **Set NEXTAUTH_URL**: Use `http://localhost:3000` for development, your production URL for deployment
3. **MongoDB Setup**: Install MongoDB locally or use MongoDB Atlas
4. **Test User**: POST to `/api/setup-test-user` to create a test account (email: `talentedhand10@gmail.com`, password: `@D3signer101!`)

### AI Feature Setup

The AI enhancement feature uses OpenAI's GPT-3.5-turbo model to provide task suggestions. If you don't have an OpenAI API key:

1. **For Testing**: The app includes mock AI suggestions in development mode
2. **For Production**: Get an API key from [OpenAI](https://platform.openai.com/api-keys)
3. **Troubleshooting**: Check the browser console for detailed error messages

### API Key Issues

If you see "Failed to generate suggestions", possible causes:
- Missing or invalid API key
- Insufficient OpenAI credits
- Network connectivity issues
- Rate limiting

The app provides detailed error messages to help diagnose issues.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes (auth, tasks)
│   ├── auth/           # Authentication pages (signin, signup)
│   └── setup/          # Setup page
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries, contexts, and auth config
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
