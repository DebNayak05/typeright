import React, { useRef, useState, memo, useEffect } from "react";
import Cursor from "./Cursor";
import toast from "react-hot-toast";
import axios from "axios";
import { IoReload } from "react-icons/io5";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Mistake {
  index: number;
  correct: string;
  wrong: string;
}

interface LetterProps {
  char: string;
  typedChar: string | undefined;
  showCursor: boolean;
  isTyped: boolean;
  isCorrect: boolean;
}

const Letter = memo(
  ({ char, typedChar, showCursor, isTyped, isCorrect }: LetterProps) => {
    let className = "text-slate-500";
    if (isTyped) {
      className = isCorrect ? "text-yellow-400" : "text-red-500";
    }
    return (
      <span className="relative">
        {showCursor && <Cursor />}
        <span className={className}>{char}</span>
      </span>
    );
  },
);

const fetchText = async () => {
  let id = "";
  try {
    const user = await axios.get(
      // "http://localhost:3000/api/data/",
      `${backendUrl}/api/data/`,
      {
        withCredentials: true,
      },
    );
    if (user.data && user.data.id) {
      id = user.data.id;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
  console.log("User ID:", id);
  try {
    const text = await axios.post(
      // "http://localhost:3000/api/data/generateText",
      `${backendUrl}/api/data/generateText`,
      { id },
      { withCredentials: true },
    );
    return text.data.text;
  } catch (error) {
    console.error("Error fetching text:", error);
    return "Practice writing skills with paragraph typing exercises. This practice lesson consists of short paragraphs about interesting subjects. Find fun keyboard typing practice—and learn something new! Our paragraph practice is great typing practice for writing essays, reports, emails, and more for school and work.";
  }
};
export default function Content() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorIdx, setCursorIdx] = useState(0);
  const [typedArr, setTypedArr] = useState<string[]>([]);
  const [focused, setFocused] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(30); // seconds remaining
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [correctTyped, setCorrectTyped] = useState<number>(0);
  const [totalTyped, setTotalTyped] = useState<number>(0);
  const [targetText, setTargetText] = useState<string>("Loading...");
  useEffect(() => {
    const setText = async () => {
      const text = await fetchText();
      console.log("Fetched text:", text);
      setTargetText(text);
    };
    setText();
  }, []);
  useEffect(() => {
    if (!timerRunning) {
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((tleft) => {
        if (tleft <= 1) {
          clearInterval(interval);
          toast.success("Time Up");
        }
        return tleft - 1;
      });
    }, 1000);
  }, [timerRunning]);
  useEffect(() => {
    if (timeLeft === 0) {
      const computedWPM = Number(((totalTyped / 5) * 2).toFixed(2)); // assuming 30s
      const computedAccuracy =
        totalTyped === 0
          ? 0
          : Number(((correctTyped / totalTyped) * 100).toFixed(2));
      setWpm(computedWPM);
      setAccuracy(computedAccuracy);
      console.log("WPM:", computedWPM);
      console.log("Accuracy:", computedAccuracy);
    }
  }, [timeLeft, totalTyped, correctTyped]);

  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!timerRunning && e.key.length === 1) {
      setTimerRunning(true);
    }
    if (timeLeft <= 0) {
      return;
    }
    if (e.key.length === 1) {
      const newTypedArr = [...typedArr];
      newTypedArr[cursorIdx] = e.key;
      setTotalTyped((t) => t + 1);
      if (e.key !== targetText[cursorIdx]) {
        setMistakes((prev) => [
          ...prev,
          {
            index: cursorIdx,
            correct: targetText[cursorIdx],
            wrong: e.key,
          },
        ]);
      } else {
        setCorrectTyped((t) => t + 1);
      }
      setTypedArr(newTypedArr);
      setCursorIdx((idx) => idx + 1);
    } else if (e.key === "Backspace" && cursorIdx > 0) {
      const newTypedArr = [...typedArr];
      newTypedArr[cursorIdx - 1] = "";
      setTypedArr(newTypedArr);
      setCursorIdx((idx) => idx - 1);
    }
  };

  const reloadContent = async () => {
    try {
      await axios.post(
        // "http://localhost:3000/api/data/postdata/",
        `${backendUrl}/api/data/postdata/`,
        { mistakes, wpm, accuracy },
        { withCredentials: true },
      );
      toast.success("Result saved");
    } catch (error) {
      console.log(error);
      toast.error("please login to save results");
    }
    setAccuracy(null);
    setWpm(null);
    setCorrectTyped(0);
    setTotalTyped(0);
    setTimerRunning(false);
    setTimeLeft(30);
    setTypedArr([]);
    setCursorIdx(0);
    setFocused(true);
    setMistakes([]);
    const setText = async () => {
      const text = await fetchText();
      setTargetText(text);
    };
    setText();
  };
  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return (
    <div
      onClick={focusInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`flex flex-col grow max-w-10/12 m-auto p-4 border-3 ${
        focused ? "border-yellow-300" : "border-slate-500"
      } transition-all duration-200 rounded-md`}
    >
      <div className="text-yellow-500">Timer : {timeLeft}</div>
      <input
        type="text"
        ref={inputRef}
        autoFocus
        className="opacity-0 absolute w-1 h-1"
        onKeyDown={handleKeyDown}
      />
      <div className="grow tracking-wider text-2xl text-center max-w-full flex flex-wrap whitespace-pre-wrap font-mono leading-relaxed">
        {targetText.split("").map((char, idx) => {
          const typedChar = typedArr[idx];
          const isTyped = typedChar !== undefined && typedChar !== "";
          const showCursor = idx === cursorIdx;
          const isCorrect = typedChar === char;
          return (
            <Letter
              key={idx}
              char={char}
              typedChar={typedChar}
              showCursor={showCursor}
              isTyped={isTyped}
              isCorrect={isCorrect}
            />
          );
        })}
      </div>
      {timeLeft === 0 && wpm !== null && accuracy !== null && (
        <div className="mt-4 text-center text-lg text-white space-y-1">
          <div>
            WPM: <span className="text-yellow-400">{wpm}</span>
          </div>
          <div>
            Accuracy: <span className="text-yellow-400">{accuracy}%</span>
          </div>
        </div>
      )}
      {timeLeft <= 0 && (
        <div className="text-center">
          <button
            className="backdrop-blur-md p-2 m-1 rounded-lg w-fit flex flex-row gap-3 h-full bg-slate-300/30 hover:scale-105 transition-all duration-200 cursor-pointer mx-auto"
            onClick={reloadContent}
          >
            <IoReload className="text-4xl" />
            <div>Save result and start new test</div>
          </button>
        </div>
      )}
      {/* <div>
        {mistakes.map((mistake, idx) => (
          <div key={idx} className="text-red-500">
            Mistake {idx + 1}: Correct "{mistake.correct}", Typed "{mistake.wrong}" at index {mistake.index}
          </div>
        ))}
      </div> */}
    </div>
  );
}
