// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Wallet, RotateCcw, MessageCircle } from "lucide-react";

type RouteOption = {
  text: string;
  delta: number;
  reply: string;
};

type CharacterQuestion = {
  question: string;
  options: RouteOption[];
};

type Character = {
  id: string;
  name: string;
  category: string;
  archetype: string;
  ease: string;
  intro: string;
  questions: CharacterQuestion[];
  successThreshold: number;
  ghostThreshold: number;
  blockThreshold: number;
};

const characters: Character[] = [
  {
    id: "cherry",
    name: "Cherry Rush",
    category: "Smoulder",
    archetype: "Streamer idol / cheerful chaos girl",
    ease: "Easy",
    intro: "You matched with Cherry on Smoulder! Her bio is full of emojis and constantly updating.",
    questions: [
      {
        question: "Cherry: Be honest... why did you swipe right on me? 😘✨",
        options: [
          { text: "Your energy looked super fun and chaotic!", delta: 3, reply: "Yesss that's the vibe!! 🔥 You're already my favorite" },
          { text: "You're really cute", delta: 2, reply: "Aww thank you~ But I get that a lot hehe" },
          { text: "I swipe right on almost everyone tbh", delta: -4, reply: "Wow... that's not very premium of you 😭" },
        ],
      },
      {
        question: "Cherry: Quick! What's your best chaotic emoji combo right now?",
        options: [
          { text: "🔥💖😭✨🐱", delta: 4, reply: "PERFECT. Marry me immediately" },
          { text: "❤️❤️❤️", delta: -1, reply: "Too basic... I need chaos!!" },
          { text: "💀", delta: 1, reply: "Dark humor? I respect it" },
        ],
      },
      {
        question: "Cherry: If we go on a date, what are we doing?",
        options: [
          { text: "Late night arcade + milkshakes", delta: 3, reply: "YES. This is the correct answer" },
          { text: "Fancy dinner", delta: 2, reply: "Cute but I want chaos not quiet" },
          { text: "Just Netflix and chill", delta: -3, reply: "Boring... next" },
        ],
      },
      {
        question: "Cherry: Be real — how emotionally available are you? (1-10)",
        options: [
          { text: "Solid 8/10", delta: 3, reply: "Ooh premium answer 👀" },
          { text: "Like a 4... but I'm trying", delta: -2, reply: "At least you're honest lol" },
          { text: "Emotionally? What's that?", delta: -5, reply: "Yikes... red flag city" },
        ],
      },
    ],
    successThreshold: 18,
    ghostThreshold: 10,
    blockThreshold: 7,
  },
  {
    id: "rika",
    name: "Rika Blaze",
    category: "Anime Girl",
    archetype: "Sporty chaos girl",
    ease: "Easy",
    intro: "Rika Blaze matched you with high energy and zero chill.",
    questions: [
      {
        question: "Rika: First question — what's your go-to post-workout meal?",
        options: [
          { text: "Protein shake + grilled chicken", delta: 3, reply: "Hell yeah! Respect" },
          { text: "Pizza and wings", delta: 1, reply: "Valid but you're gonna feel it tomorrow 😂" },
          { text: "I don't really work out...", delta: -4, reply: "......next match" },
        ],
      },
      {
        question: "Rika: How do you feel about spontaneous 2am gym sessions?",
        options: [
          { text: "I'm down if you're down", delta: 4, reply: "That's what I like to hear!!" },
          { text: "Only if there's snacks after", delta: 2, reply: "Compromise accepted" },
          { text: "Absolutely not", delta: -3, reply: "Booooring" },
        ],
      },
      {
        question: "Rika: Pick one: weights, yoga, or running?",
        options: [
          { text: "Weights all the way", delta: 3, reply: "Strong answer 💪" },
          { text: "Yoga for the vibes", delta: 2, reply: "Soft but cute" },
          { text: "Running from my problems", delta: -2, reply: "At least you're self-aware lol" },
        ],
      },
    ],
    successThreshold: 18,
    ghostThreshold: 10,
    blockThreshold: 8,
  },
  {
    id: "jett",
    name: "Jett Titan",
    category: "Smoulder",
    archetype: "Gym himbo",
    ease: "Easy",
    intro: "Big friendly gym guy Jett matched with you!",
    questions: [
      { question: "Placeholder question for Jett Titan", options: [] },
    ],
    successThreshold: 18,
    ghostThreshold: 10,
    blockThreshold: 8,
  },
  {
    id: "velvette",
    name: "Velvette",
    category: "Anime Girl",
    archetype: "Luxury brat princess",
    ease: "Medium",
    intro: "Velvette looks expensive and already slightly disappointed in you.",
    questions: [
      { question: "Placeholder question for Velvette", options: [] },
    ],
    successThreshold: 19,
    ghostThreshold: 11,
    blockThreshold: 8,
  },
  {
    id: "mina",
    name: "Mina Hex",
    category: "Anime Girl",
    archetype: "Goth menace",
    ease: "Medium-Hard",
    intro: "Mina Hex matched you. She's already judging silently.",
    questions: [
      { question: "Placeholder question for Mina Hex", options: [] },
    ],
    successThreshold: 20,
    ghostThreshold: 10,
    blockThreshold: 7,
  },
];

export default function LoveCostsExtra() {
  const [screen, setScreen] = useState<"hub" | "chapter1" | "store">("hub");
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [badCount, setBadCount] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<null | "success" | "ghosted" | "blocked">(null);
  const [loveBux, setLoveBux] = useState(150);

  const char = useMemo(() => 
    characters.find(c => c.id === selectedCharId), 
    [selectedCharId]
  );

  const currentQuestion = useMemo(() => 
    char?.questions[qIndex], 
    [char, qIndex]
  );

  const startRoute = (id: string) => {
    setSelectedCharId(id);
    setQIndex(0);
    setScore(0);
    setBadCount(0);
    setMessages([]);
    setOutcome(null);
    setScreen("chapter1");
  };

  const chooseOption = (option: RouteOption) => {
    if (!char) return;

    const newScore = score + option.delta;
    const newBad = option.delta < 0 ? badCount + 1 : badCount;

    setScore(newScore);
    setBadCount(newBad);
    setMessages(prev => [
      ...prev,
      `You: ${option.text}`,
      `${char.name}: ${option.reply}`
    ]);

    if (qIndex < char.questions.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      // End of route
      if (newScore >= char.successThreshold) {
        setOutcome("success");
      } else if (newBad >= 3 || newScore <= char.blockThreshold) {
        setOutcome("blocked");
      } else {
        setOutcome("ghosted");
      }
    }
  };

  const resetToHub = () => {
    setScreen("hub");
    setSelectedCharId(null);
    setQIndex(0);
    setScore(0);
    setBadCount(0);
    setMessages([]);
    setOutcome(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold text-pink-700 tracking-tight">
            Love Costs Extra 💸❤️
          </h1>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow">
            <Wallet className="w-6 h-6 text-amber-600" />
            <span className="text-2xl font-semibold">{loveBux} LoveBux</span>
          </div>
        </div>

        {/* HUB SCREEN */}
        {screen === "hub" && (
          <Card className="rounded-3xl shadow-xl border-pink-200">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Choose Your Match</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              {characters.map((c) => (
                <Card key={c.id} className="rounded-2xl border-pink-200 hover:border-pink-400 transition-all hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="text-8xl mb-6">💖</div>
                    <h3 className="text-2xl font-bold mb-2">{c.name}</h3>
                    <p className="text-slate-600 mb-4 min-h-[3rem]">{c.archetype}</p>
                    <Badge variant="secondary" className="mb-6">{c.ease}</Badge>
                    <Button 
                      onClick={() => startRoute(c.id)} 
                      className="w-full rounded-2xl h-12 text-lg font-medium"
                    >
                      Start Chapter 1
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* CHAPTER 1 SCREEN */}
        {screen === "chapter1" && char && (
          <Card className="rounded-3xl shadow-2xl border-pink-300 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl mb-2">{char.name}</CardTitle>
              <p className="text-slate-500">Question {qIndex + 1} of {char.questions.length}</p>
              <Progress value={(score / 30) * 100} className="h-3 mt-6" />
            </CardHeader>

            <CardContent className="p-10 space-y-8">
              {/* Conversation Log */}
              <div className="bg-slate-50 rounded-2xl p-8 h-96 overflow-y-auto space-y-6 text-lg leading-relaxed">
                {messages.length === 0 && (
                  <p className="text-center text-slate-400 italic">{char.intro}</p>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={msg.startsWith("You:") ? "text-right" : ""}>
                    <span 
                      className={`inline-block px-6 py-4 rounded-3xl max-w-[80%] ${
                        msg.startsWith("You:") 
                          ? "bg-pink-200 text-pink-900" 
                          : "bg-white border border-slate-200"
                      }`}
                    >
                      {msg}
                    </span>
                  </div>
                ))}
              </div>

              {!outcome ? (
                <div>
                  <p className="text-2xl font-medium mb-8 leading-tight">
                    {currentQuestion?.question}
                  </p>
                  <div className="grid gap-4">
                    {currentQuestion?.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto py-6 px-8 text-left text-lg rounded-2xl justify-start hover:bg-pink-50 transition-colors"
                        onClick={() => chooseOption(option)}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  {outcome === "success" && <div className="text-8xl mb-8">💖</div>}
                  {outcome === "ghosted" && <div className="text-8xl mb-8">👻</div>}
                  {outcome === "blocked" && <div className="text-8xl mb-8">🚫</div>}

                  <h2 className="text-4xl font-bold mb-6">
                    {outcome === "success" 
                      ? "Private Chat Unlocked!" 
                      : outcome === "ghosted" 
                        ? "She Ghosted You..." 
                        : "You Got Blocked"}
                  </h2>

                  <p className="text-xl text-slate-600 mb-12 max-w-md mx-auto">
                    {outcome === "success" 
                      ? `You now have ${char.name}'s private handle.`
                      : outcome === "ghosted" 
                        ? "Try matching again in a few days."
                        : "Creating a new profile will cost 80 LoveBux."}
                  </p>

                  <Button onClick={resetToHub} className="rounded-2xl px-12 py-7 text-xl">
                    Back to Matches
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* STORE SCREEN */}
        {screen === "store" && (
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-3xl">In-App Purchase Store</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="text-slate-600">Make bad financial decisions faster.</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "Tiny Little Treat", amount: 100, price: 4.99 },
                  { name: "Notice Me Bundle", amount: 500, price: 19.99 },
                  { name: "Whale Behavior Pack", amount: 2000, price: 74.99 },
                ].map((pack) => (
                  <Card key={pack.name} className="rounded-2xl p-8 text-center border-pink-100">
                    <h3 className="text-2xl font-semibold mb-3">{pack.name}</h3>
                    <p className="text-5xl font-bold text-pink-600 mb-2">+{pack.amount}</p>
                    <p className="text-sm text-slate-500 mb-8">LoveBux</p>
                    <Button 
                      className="w-full rounded-2xl h-14 text-lg"
                      onClick={() => setLoveBux(l => l + pack.amount)}
                    >
                      Buy for ${pack.price}
                    </Button>
                  </Card>
                ))}
              </div>
              <Button onClick={() => setScreen("hub")} className="rounded-2xl">
                Back to Matches
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
