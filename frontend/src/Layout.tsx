import { Outlet } from "react-router";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-800 font-mono flex flex-col">
      <Header />
      <Toaster />
      <main className="flex grow pt-20 px-3">
        <Outlet />
      </main>
    </div>
  );
}
