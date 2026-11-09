import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Packet } from "@/components/global/Packet";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="grid flex-1 items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div>
        <h1 className="rise display text-[clamp(3rem,7vw,5.5rem)]">
          This page isn&apos;t on the <span className="underline decoration-accent decoration-4 underline-offset-4">menu</span>.
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
        <Packet
          color="squash"
          serving="Not found"
          calories={404}
          unit=""
          title="Page"
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
