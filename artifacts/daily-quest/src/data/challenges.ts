import { Challenge } from '../types';

export const challenges: Challenge[] = [
  // Productivity (Easy)
  { id: 'p1', title: 'Clean desk 5 min', description: 'Clear away all clutter from your workspace for exactly 5 minutes.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'p2', title: 'Drink water now', description: 'Get up, fill a glass with water, and drink it entirely.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '1 min' },
  { id: 'p3', title: 'Write tomorrow\'s top 3 priorities', description: 'Note down the 3 most important tasks for tomorrow.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'p4', title: 'Close all unused browser tabs', description: 'Be ruthless. If you aren\'t actively using it, close it.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 'p5', title: 'Clear notification badges on phone', description: 'Review and clear all those little red dots.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'p6', title: 'Make your bed', description: 'A small win that sets the tone for the whole day.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'p7', title: 'Organize one drawer', description: 'Pick the messiest drawer and make it slightly better.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'p8', title: 'Reply to one pending message', description: 'You know the one you\'ve been putting off. Just do it.', category: 'Productivity', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },

  // Learning (Medium)
  { id: 'l1', title: 'Learn 5 words in another language', description: 'Pick a language and learn how to say hello, thank you, please, yes, and no.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '10 min' },
  { id: 'l2', title: 'Watch a 10-min educational video', description: 'Watch a video on a topic you know nothing about and write down 1 takeaway.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '15 min' },
  { id: 'l3', title: 'Read 5 pages of a book', description: 'Sit down, put the phone away, and read 5 pages of a physical or digital book.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '10 min' },
  { id: 'l4', title: 'Listen to a podcast episode', description: 'Find a new podcast on a topic that interests you and listen to one episode.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '30 min' },
  { id: 'l5', title: 'Look up something you\'ve been curious about', description: 'Do a deep dive into that random question that\'s been in your head.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '15 min' },
  { id: 'l6', title: 'Write down 3 things you learned this week', description: 'Reflect on the week and codify your learning.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '5 min' },
  { id: 'l7', title: 'Explain a concept you know to yourself', description: 'Try to explain a complex topic as if you were talking to a 5-year-old.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '5 min' },
  { id: 'l8', title: 'Research one career skill', description: 'Find one specific skill relevant to your job and read a guide on it.', category: 'Learning', difficulty: 'Medium', xp: 25, estimatedTime: '20 min' },

  // Health (Easy/Medium)
  { id: 'h1', title: 'Walk 10 minutes', description: 'Go outside or walk around your building for 10 straight minutes.', category: 'Health', difficulty: 'Easy', xp: 10, estimatedTime: '10 min' },
  { id: 'h2', title: 'Drink a full glass of water', description: 'Hydrate immediately.', category: 'Health', difficulty: 'Easy', xp: 10, estimatedTime: '1 min' },
  { id: 'h3', title: 'Stretch 5 minutes', description: 'Touch your toes, stretch your arms, rotate your neck.', category: 'Health', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'h4', title: 'Do 10 pushups', description: 'Drop down and give me 10. Modifications are fine.', category: 'Health', difficulty: 'Medium', xp: 25, estimatedTime: '2 min' },
  { id: 'h5', title: 'Take 5 deep breaths slowly', description: 'Inhale for 4 seconds, hold for 4, exhale for 4.', category: 'Health', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 'h6', title: 'Stand up and walk around for 2 minutes', description: 'Get out of that chair.', category: 'Health', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 'h7', title: 'Eat a piece of fruit', description: 'An apple, a banana, whatever is available.', category: 'Health', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'h8', title: 'Go outside for 5 minutes', description: 'Just step outside and feel the air.', category: 'Health', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },

  // Creativity (Medium)
  { id: 'cr1', title: 'Write one paragraph about a random idea', description: 'It doesn\'t have to be good, it just has to be written.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '10 min' },
  { id: 'cr2', title: 'Draw something simple 5 min', description: 'Grab a pen and doodle. A coffee mug, a face, a abstract shape.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '5 min' },
  { id: 'cr3', title: 'Record a voice note with a thought', description: 'Talk out loud about something on your mind for 2 minutes.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '2 min' },
  { id: 'cr4', title: 'Brainstorm 5 solutions to a problem', description: 'Pick a problem in your life and write 5 crazy ways to solve it.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '10 min' },
  { id: 'cr5', title: 'Take an interesting photo', description: 'Find a unique angle of something mundane in your current room.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '5 min' },
  { id: 'cr6', title: 'Write the opening line of a story', description: 'Make it catchy. You don\'t have to write the rest.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '3 min' },
  { id: 'cr7', title: 'Hum or whistle a tune you invent', description: 'Create a tiny 10-second melody.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '2 min' },
  { id: 'cr8', title: 'Rearrange something on your desk', description: 'Change the physical layout of your workspace slightly for a fresh perspective.', category: 'Creativity', difficulty: 'Medium', xp: 25, estimatedTime: '5 min' },

  // Social (Easy)
  { id: 's1', title: 'Send a kind message to someone', description: 'Just a quick text saying you appreciate them.', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 's2', title: 'Check in with a friend', description: 'Ask how their week is going.', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 's3', title: 'Thank someone for something specific', description: 'Gratitude is better when it\'s specific.', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 's4', title: 'Compliment a stranger', description: 'Online or offline, say something nice.', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 's5', title: 'Write a positive review', description: 'For a local business, a book, or an app you like.', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 's6', title: 'Reach out to someone you haven\'t talked to', description: 'Send a simple "Thinking of you, hope you\'re well!"', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 's7', title: 'Share something useful with a friend', description: 'An article, a tool, or a tip.', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '2 min' },
  { id: 's8', title: 'Introduce yourself to someone new', description: 'Or at least learn the name of someone you see often.', category: 'Social', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },

  // Career (Medium/Hard)
  { id: 'ca1', title: 'Improve one sentence in your LinkedIn', description: 'Find a clunky sentence in your profile and make it punchy.', category: 'Career', difficulty: 'Medium', xp: 25, estimatedTime: '10 min' },
  { id: 'ca2', title: 'Save one useful job resource', description: 'Bookmark a good article or tool for your industry.', category: 'Career', difficulty: 'Medium', xp: 25, estimatedTime: '5 min' },
  { id: 'ca3', title: 'Write one professional skill you want to improve', description: 'Define it clearly and write one step to start.', category: 'Career', difficulty: 'Medium', xp: 25, estimatedTime: '5 min' },
  { id: 'ca4', title: 'Spend 10 min on a side project', description: 'Move the needle just a little bit.', category: 'Career', difficulty: 'Hard', xp: 50, estimatedTime: '10 min' },
  { id: 'ca5', title: 'Read one industry article', description: 'Stay up to date with what\'s happening in your field.', category: 'Career', difficulty: 'Medium', xp: 25, estimatedTime: '10 min' },
  { id: 'ca6', title: 'Update your portfolio or resume', description: 'Add one recent accomplishment or project.', category: 'Career', difficulty: 'Hard', xp: 50, estimatedTime: '20 min' },
  { id: 'ca7', title: 'Reach out to a mentor or colleague', description: 'Ask a thoughtful question or share an update.', category: 'Career', difficulty: 'Hard', xp: 50, estimatedTime: '15 min' },
  { id: 'ca8', title: 'Write down your 5-year career goal', description: 'Be as specific as possible.', category: 'Career', difficulty: 'Medium', xp: 25, estimatedTime: '10 min' },

  // Reflection (Easy)
  { id: 'r1', title: 'Write one thing you did well today', description: 'Celebrate a small personal victory.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'r2', title: 'Write one thing to improve tomorrow', description: 'Identify a friction point and plan around it.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'r3', title: 'Rate your energy 1–5 and write why', description: 'Tune into your physical and mental state.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'r4', title: 'Write 3 things you\'re grateful for', description: 'Big or small. Just name them.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'r5', title: 'Journal for 5 minutes with no agenda', description: 'Brain dump whatever is on your mind.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'r6', title: 'Identify one habit you want to build', description: 'Name it and write down the trigger for it.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'r7', title: 'Note one decision you made today and why', description: 'Reflect on your agency and choices.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '3 min' },
  { id: 'r8', title: 'Write a short letter to your future self', description: 'Just 3 sentences for the you of next month.', category: 'Reflection', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },

  // Fun (Easy)
  { id: 'f1', title: 'Listen to one song intentionally', description: 'Do nothing else. Just listen to the music.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '4 min' },
  { id: 'f2', title: 'Watch a short scene from a movie you like', description: 'Revisit a moment that brings you joy.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'f3', title: 'Do something purely for enjoyment', description: 'No productivity allowed. Just fun for 10 minutes.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '10 min' },
  { id: 'f4', title: 'Try a food you\'ve never eaten', description: 'Or a new flavor/spice combination.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'f5', title: 'Play a game for 10 minutes', description: 'A mobile game, a video game, or a puzzle.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '10 min' },
  { id: 'f6', title: 'Look up an interesting fact', description: 'Find something weird to tell someone later.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'f7', title: 'Watch a funny video without guilt', description: 'Laughing is productive too.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
  { id: 'f8', title: 'Explore a random Wikipedia article', description: 'Click "Random article" and read the intro.', category: 'Fun', difficulty: 'Easy', xp: 10, estimatedTime: '5 min' },
];
