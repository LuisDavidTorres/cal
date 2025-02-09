import { Geist, Geist_Mono } from "next/font/google";
import Search from "@/components/Search";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="flex justify-center">
        <Search />
    </main>
  );
}
