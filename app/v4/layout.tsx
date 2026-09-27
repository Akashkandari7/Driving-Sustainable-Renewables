import { Instrument_Serif } from "next/font/google";
import "./brew.css";

// the script accent that cuts into the headlines
const accent = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-accent" });

export default function BrewLayout({ children }: { children: React.ReactNode }) {
  return <div className={`brew ${accent.variable}`}>{children}</div>;
}
