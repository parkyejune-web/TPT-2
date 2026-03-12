"use client";

import { useRouter } from "next/navigation";
import { Footer } from "../../Widget/Footer";
import { IntroSection } from "../../Features/landing/IntroSection";
import { AutoJournalSection } from "../../Features/landing/AutoJournalSection";
import { WeeklyFeedbackSection } from "../../Features/landing/WeeklyFeedbackSection";
import { MonthlyFeedbackSection } from "../../Features/landing/MonthlyFeedbackSection";
import { MarketAnalysisSection } from "../../Features/landing/MarketAnalysisSection";
import CustomButton from "../../Shared/ui/CustomButton";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-24">
        <IntroSection />
        <AutoJournalSection />
        <WeeklyFeedbackSection />
        <MonthlyFeedbackSection />
        <MarketAnalysisSection />
      </main>
      <Footer />
    </div>
  );
}
