"use client";

import { Quote } from "lucide-react";
import { useEffect, useState } from "react";

const quotes = [
//   "Energy and persistence conquer all things. — Benjamin Franklin",
//   "Nothing in this world can take the place of persistence. Talent will not; nothing is more common than unsuccessful men with talent. Persistence and determination alone are omnipotent. — Calvin Coolidge",
//   "The price of success is hard work, dedication to the job at hand, and the determination that whether we win or lose, we have applied the best of ourselves to the task at hand. — Vince Lombardi",
//   "There is no substitute for hard work. — Thomas Edison",
//   "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.' — Muhammad Ali",
//   "Far and away the best prize that life offers is the chance to work hard at work worth doing. — Theodore Roosevelt",
//   "Perseverance is the hard work you do after you get tired of doing the hard work you already did. — Newt Gingrich",
//   "Hard work beats talent when talent doesn't work hard. — Tim Notke",
//   "The only thing that overcomes hard luck is hard work. — Harry Golden",
//   "There are no shortcuts to any place worth going. — Beverly Sills",
//   "If you are not willing to risk the unusual, you will have to settle for the ordinary. — Jim Rohn",
//   "The biggest risk is not taking any risk... In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks. — Mark Zuckerberg",
//   "Only those who will risk going too far can possibly find out how far one can go. — T.S. Eliot",
//   "Man cannot discover new oceans until he has the courage to lose sight of the shore. — André Gide",
//   "Leap and the net will appear. — John Burroughs",
//   "To win without risk is to triumph without glory. — Pierre Corneille",
//   "Living at risk is jumping off the cliff and building your wings on the way down. — Ray Bradbury",
//   "Don't be too timid and squeamish about your actions. All life is an experiment. The more experiments you make the better. — Ralph Waldo Emerson",
//   "Screw it, let's do it. — Richard Branson",
//   "I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying. — Jeff Bezos",
//   "If you're offered a seat on a rocket ship, don't ask what seat. Just get on. — Sheryl Sandberg",
//   "Be brave, take risks. Nothing can substitute experience. — Paulo Coelho",
//   "He who is not courageous enough to take risks will accomplish nothing in life. — Muhammad Ali",
//   "Courage is resistance to fear, mastery of fear—not absence of fear. — Mark Twain",
//   "The man who moves a mountain begins by carrying away small stones. — Confucius",
//   "There is one quality which one must possess to win, and that is definiteness of purpose, the knowledge of what one wants, and a burning desire to possess it. — Napoleon Hill",
//   "If you are of those who believe that hard work and honesty, alone, will bring riches, perish the thought! Riches, when they come in huge quantities, are never the result of hard work! — Napoleon Hill",
//   "Don't aim at success. The more you aim at it and make it a target, the more you are going to miss it. For success, like happiness, cannot be pursued; it must ensue... as the unintended side-effect of one's personal dedication to a cause greater than oneself. — Viktor E. Frankl",
//   "When we are no longer able to change a situation, we are challenged to change ourselves. — Viktor E. Frankl",
//   "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one's attitude in any given set of circumstances, to choose one's own way. — Viktor E. Frankl",
//   "Your success depends on the risks you take. Your survival depends on the risks you avoid. — James Clear",
//   "Every action you take is a vote for the type of person you wish to become. — James Clear",
//   "The greatest threat to success is not failure but boredom. We get bored with habits because they stop delighting us. — James Clear",
//   "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
//   "The secret of getting ahead is getting started. — Mark Twain",
//   "I have not failed. I've just found 10,000 ways that won't work. — Thomas Edison",
//   "Success is the sum of small efforts, repeated day in and day out. — Robert Collier",
//   "Discipline is the bridge between goals and accomplishment. — Jim Rohn",
//   "The only way to do great work is to love what you do. — Steve Jobs",
//   "You miss 100% of the shots you don't take. — Wayne Gretzky",
//   "It always seems impossible until it's done. — Nelson Mandela",
//   "The best way out is always through. — Robert Frost",
//   "No man is worth his salt who is not ready at all times to risk his well-being, to risk his body, to risk his life in a great cause. — Theodore Roosevelt",
//   "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying 'I will try again tomorrow.' — Mary Anne Radmacher",
//   "Adventure is worthwhile. — Aesop",
//   "A ship in harbor is safe, but that is not what ships are built for. — John A. Shedd",
//   "Risk more than others think is safe. Dream more than others think is practical. — Howard Schultz",
//   "If you don't build your dream, someone else will hire you to help build theirs. — Tony Gaskins",
//   "Work like there is someone working 24 hours a day to take it away from you. — Mark Cuban",
//   "Great works are performed not by strength but by perseverance. — Samuel Johnson",
//   "Effort only fully releases its reward after a person refuses to quit. — Napoleon Hill"


  "You have power over your mind — not outside events. Realize this, and you will find strength. — Marcus Aurelius",
  "The happiness of your life depends upon the quality of your thoughts. — Marcus Aurelius",
  "Waste no more time arguing what a good man should be. Be one. — Marcus Aurelius",
  "If it is not right, do not do it; if it is not true, do not say it. — Marcus Aurelius",
  "The impediment to action advances action. What stands in the way becomes the way. — Marcus Aurelius",
  "Begin at once to live, and count each separate day as a separate life. — Seneca",
  "We suffer more often in imagination than in reality. — Seneca",
  "Luck is what happens when preparation meets opportunity. — Seneca",
  "Difficulties strengthen the mind, as labor does the body. — Seneca",
  "He who fears death will never do anything worth of a man who is alive. — Seneca",
  "It is not the man who has too little, but the man who craves more, that is poor. — Seneca",
  "As long as you live, keep learning how to live. — Seneca",
  "Man is affected not by events, but by the view he takes of them. — Epictetus",
  "Don’t explain your philosophy. Embody it. — Epictetus",
  "First say to yourself what you would be; and then do what you have to do. — Epictetus",
  "If you want to improve, be content to be thought foolish and stupid. — Epictetus",
  "No man is free who is not master of himself. — Epictetus",
  "Make the best use of what is in your power, and take the rest as it happens. — Epictetus",
  "How long are you going to wait before you demand the best for yourself? — Epictetus",
  "Wealth consists not in having great possessions, but in having few wants. — Epictetus",
  "External things are not the problem. It’s your assessment of them. — Marcus Aurelius",
  "Choose not to be harmed — and you won’t feel harmed. Don’t feel harmed — and you haven’t been. — Marcus Aurelius",
  "True happiness is to enjoy the present, without anxious dependence upon the future. — Seneca",
  "Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control. — Epictetus",
  "Energy and persistence conquer all things. — Benjamin Franklin",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "I have not failed. I've just found 10,000 ways that won't work. — Thomas Edison",
  "In the middle of difficulty lies opportunity. — Albert Einstein",
  "What you do today can improve all your tomorrows. — Ralph Marston",
  "The only real mistake is the one from which we learn nothing. — Henry Ford",
  "Do not wait to strike till the iron is hot; but make it hot by striking. — William Butler Yeats",
  "It always seems impossible until it is done. — Nelson Mandela",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "The future depends on what you do today. — Mahatma Gandhi",
  "Our greatest glory is not in never falling, but in rising every time we fall. — Confucius",
  "Act as if what you do makes a difference. It does. — William James",
  "The harder the conflict, the greater the triumph. — George Washington",
  "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau",
  "You miss 100% of the shots you don’t take. — Wayne Gretzky",
  "Don’t count the days, make the days count. — Muhammad Ali",
  "The secret of getting ahead is getting started. — Mark Twain",
  "Quality is not an act, it is a habit. — Aristotle",
  "A person who never made a mistake never tried anything new. — Albert Einstein",
  "Fall seven times, stand up eight. — Japanese Proverb",
  "Opportunities don't happen. You create them. — Chris Grosser",
  "If you are not willing to risk the usual, you will have to settle for the ordinary. — Jim Rohn",
  "The best way to predict the future is to create it. — Peter Drucker",
  "Do one thing every day that scares you. — Eleanor Roosevelt",
  "Strength does not come from physical capacity. It comes from an indomitable will. — Mahatma Gandhi",
  "Success is walking from failure to failure with no loss of enthusiasm. — Winston Churchill",
  "Knowing is not enough; we must apply. Willing is not enough; we must do. — Johann Wolfgang von Goethe",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. — Ralph Waldo Emerson",
  "If someone is able to show me that what I think or do is not right, I will gladly change. — Marcus Aurelius",
  "Do every act of your life as though it were the very last act of your life. — Marcus Aurelius",
  "It is not death that a man should fear, but he should fear never beginning to live. — Marcus Aurelius",
  "Accept the things to which fate binds you, and love the people with whom fate brings you together. — Marcus Aurelius",
  "The best revenge is to be unlike him who performed the injury. — Marcus Aurelius",
  "Sometimes even to live is an act of courage. — Seneca",
  "A gem cannot be polished without friction, nor a man perfected without trials. — Seneca",
  "No man becomes rich unless he enriches others. — Seneca",
  "He suffers more than necessary, who suffers before it is necessary. — Seneca",
  "True happiness is not found in excess, but in self-control. — Seneca",
  "It is not what you endure, but how you endure it, that matters. — Seneca",
  "If a man knows not to which port he sails, no wind is favorable. — Seneca",
  "Don’t seek for everything to happen as you wish it would, but rather wish that everything happens as it actually will. — Epictetus",
  "Circumstances don’t make the man, they only reveal him. — Epictetus",
  "Freedom is secured not by the fulfillment of one’s desires, but by the removal of desire. — Epictetus",
  "If you want something good, get it from yourself. — Epictetus",
  "Only the educated are free. — Epictetus",
  "No man is free who cannot command himself. — Epictetus",
  "Difficulty shows what men are. — Epictetus",
  "Practice yourself, for heaven’s sake, in little things. — Epictetus",
  "He who laughs at himself never runs out of things to laugh at. — Epictetus",
  "The whole future lies in uncertainty: live immediately. — Seneca",
  "Life is long, if you know how to use it. — Seneca",
  "Hang on to your youthful enthusiasms — you’ll be able to use them better when you’re older. — Seneca",
  "You could leave life right now. Let that determine what you do and say and think. — Marcus Aurelius",
  "Do not waste the remainder of your life in thoughts about others. — Marcus Aurelius",
  "Nothing happens to any man that he is not formed by nature to bear. — Marcus Aurelius",
  "The soul becomes dyed with the color of its thoughts. — Marcus Aurelius",
  "Confine yourself to the present. — Marcus Aurelius",
  "He who lives in harmony with himself lives in harmony with the universe. — Marcus Aurelius",
  "What we do now echoes in eternity. — Marcus Aurelius",
  "Set aside a certain number of days, during which you shall be content with the scantiest fare. — Seneca",
  "Associate with people who are likely to improve you. — Seneca",
  "He who is brave is free. — Seneca",
  "Time discovers truth. — Seneca",
  "It does not matter what you bear, but how you bear it. — Seneca",
  "A man who suffers before it is necessary, suffers more than is necessary. — Seneca",
  "No man can have a peaceful life who thinks too much about lengthening it. — Seneca",
  "If you are distressed by anything external, the pain is not due to the thing itself. — Epictetus",
  "It is impossible for a man to learn what he thinks he already knows. — Epictetus",
  "Do not try to seem wise to others. — Epictetus",
  "Small-minded people blame others. Average people blame themselves. Wise people see causes. — Epictetus",
  "Don’t demand that things happen as you wish, but wish that they happen as they do happen. — Epictetus",
  "No great thing is created suddenly. — Epictetus",
  "Seek not the good in external things; seek it in yourselves. — Epictetus",
  "The key is to keep company only with people who uplift you. — Epictetus",
  "We are not disturbed by things, but by the views we take of them. — Epictetus",
  "Make progress every day, however small. — Epictetus"
];

export function DailyQuote() {
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setMounted(true);
    const getQuote = () => {
      const hours = 4;
      const msPerInterval = hours * 60 * 60 * 1000;
      const intervalIndex = Math.floor(new Date().getTime() / msPerInterval);
      return quotes[intervalIndex % quotes.length];
    };
    setQuote(getQuote());
  }, []);

  if (!mounted) return null;

  const [text, author] = quote.split("—").map(s => s.trim());

  return (
    <div className="relative group overflow-hidden rounded-2xl p-px bg-zinc-800/50 border border-white/5 shadow-2xl">
        <div className="relative h-full bg-black rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            
            {/* Minimalist Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* Icon */}
            <div className="relative p-2 rounded-full border border-white/10 bg-white/5">
                <Quote size={16} className="text-zinc-400 fill-current opacity-50" />
            </div>

            {/* Quote Text */}
            <p className="relative text-lg md:text-xl font-light text-zinc-200 leading-relaxed font-sans tracking-wide">
                "{text}"
            </p>

            {/* Author */}
            {author && (
                <div className="relative flex items-center gap-3">
                    <div className="h-px w-6 bg-zinc-800" />
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em]">
                        {author}
                    </p>
                    <div className="h-px w-6 bg-zinc-800" />
                </div>
            )}
        </div>
    </div>
  );
}
