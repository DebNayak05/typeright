import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

interface Mistake {
  index: number;
  correct: string;
  wrong: string;
}

interface Test {
  _id: string;
  userId: string;
  wpm: number;
  accuracy: number;
  mistake: Mistake[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Profile() {
  const [tests, setTests] = useState<Test[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const sendRequest = async () => {
      try {
        const res = await axios.get(
          // "http://localhost:3000/api/data/getdata/",
          `${backendUrl}/api/data/getdata/`,
          { withCredentials: true },
        );
        setTests(res.data.tests || []);
        setError(null);
        const userDetails = await axios.get(
          // "http://localhost:3000/api/data/",
          `${backendUrl}/api/data/`,
          { withCredentials: true },
        );
        setName(userDetails.data.name);
        setEmail(userDetails.data.email);
      } catch (error) {
        setError("invalid user data");
      }
    };
    sendRequest();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  // Calculate averages
  const avgWpm = tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length;
  const avgAccuracy =
    tests.reduce((sum, t) => sum + t.accuracy, 0) / tests.length;

  // Prepare data for chart
  const labels = tests
    .slice(0)
    .reverse()
    .map((_, i) => `Test ${i + 1}`);
  const wpmData = tests
    .slice(0)
    .reverse()
    .map((t) => t.wpm);
  const accuracyData = tests
    .slice(0)
    .reverse()
    .map((t) => t.accuracy);

  const data = {
    labels,
    datasets: [
      {
        label: "WPM",
        data: wpmData,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.1)",
        yAxisID: "y",
      },
      {
        label: "Accuracy",
        data: accuracyData,
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.1)",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Typing Test Results" },
    },
    scales: {
      y: {
        type: "linear" as const,
        position: "left" as const,
        title: { display: true, text: "WPM" },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        title: { display: true, text: "Accuracy (%)" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="w-full flex flex-col gap-3 justify-center items-center text-gray-100">
      <Card className=" bg-sky-950 border-blue-300 w-8/12 text-white">
        <CardHeader>
          <CardTitle className="text-5xl">{name}</CardTitle>
          <CardDescription className="text-white/70">
            Email: {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Average WPM: {avgWpm}</p>
        </CardContent>
        <CardFooter>
          <p>Accuracy: {avgAccuracy}</p>
        </CardFooter>
      </Card>
      {/* <div style={{ maxWidth: 700, margin: "2rem auto" }}> */}
      <div className="w-8/12">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
