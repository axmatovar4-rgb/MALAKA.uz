import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { Services } from "@/components/marketing/services";
import { Stats } from "@/components/marketing/stats";
import { PhoneAuthWizard } from "@/components/auth/phone-auth-wizard";
import { Steps } from "@/components/marketing/steps";
import { Groups } from "@/components/marketing/groups";
import { DistrictStats } from "@/components/marketing/district-stats";
import { Faq } from "@/components/marketing/faq";
import { News } from "@/components/marketing/news";
import { Testimonials } from "@/components/marketing/testimonials";
import { SiteFooter } from "@/components/marketing/site-footer";
import { BottomNav } from "@/components/marketing/bottom-nav";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function Home() {
  // Live registration counts and reviews must never be frozen at build time.
  await connection();

  const regions = await prisma.region.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-white pb-16 dark:bg-slate-950 lg:pb-0">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Services />
        <Stats />
        <PhoneAuthWizard regions={regions} />
        <Steps />
        <Groups />
        <DistrictStats />
        <Faq />
        <Testimonials />
        <News />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
