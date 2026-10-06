import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { NutritionLabel } from "@/components/global/NutritionLabel";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="grid flex-1 items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div>
        <p className="rise font-mono text-sm text-ink-3">Error 404</p>
        <h1 className="rise display mt-3 text-[clamp(2.4rem,5vw,4.2rem)]">
          This page isn&apos;t on the <span className="hl px-1">menu</span>.
        </h1>
        <p className="rise mt-5 max-w-md text-lg leading-relaxed text-ink-2">
          The link may be old or mistyped. Your plans and grocery list are safe.
        </p>
        <div className="rise mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary h-12 px-6">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
          <Link href="/dashboard" className="btn btn-secondary h-12 px-6">
            Go to dashboard
          </Link>
        </div>
      </div>

      <div className="rise mx-auto w-full max-w-sm lg:mr-0">
        <NutritionLabel
          serving="Not found"
          calories={404}
          rows={[
            { label: "Content", value: "0 g" },
            { label: "Working links", value: "2" },
            { label: "Damage done", value: "none" },
          ]}
        />
      </div>
    </div>
  );
}
