import { useState } from "react";
import { Disclosure } from "@react-ui-suite/core";
import type { ComponentRegistryEntry } from "../component-registry";

const faqs = [
  {
    q: "What happens after trial?",
    a: "We ask you to choose a plan. Your data stays intact during the decision."
  },
  {
    q: "Can I invite my team?",
    a: "Yes, unlimited collaborators on any paid plan. Invite via email or SSO."
  },
  {
    q: "How do refunds work?",
    a: "If something goes wrong, contact support within 14 days for a full refund."
  }
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
        FAQ
      </p>
      <div className="mt-3 space-y-2">
        {faqs.map((item, index) => (
          <Disclosure
            key={item.q}
            open={openIndex === index}
            onClick={(e) => {
              const target = e.target as HTMLElement | null;
              const isSummaryClick = target?.closest("summary");
              if (!isSummaryClick) return; // ignore clicks inside content
              e.preventDefault(); // stop native toggle; we fully control the open state
              setOpenIndex((prev) => (prev === index ? null : index));
            }}
            title={item.q}
          >
            <p>{item.a}</p>
          </Disclosure>
        ))}
      </div>
    </div>
  );
}

function ReleaseChangelog() {
  return (
    <div className="space-y-2 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
        Changelog
      </p>
      <Disclosure title="v1.8.0 - Workflow builder" defaultOpen subtle>
        <ul className="list-disc space-y-1 pl-4">
          <li>Added conditional branches to automation builder.</li>
          <li>New templates for onboarding and customer success.</li>
          <li>Improved logs with live tail and filters.</li>
        </ul>
      </Disclosure>
      <Disclosure title="v1.7.2 - Stability" subtle>
        <p>Fixed latency spikes in EU-West and reduced cold start times by 25%.</p>
      </Disclosure>
      <Disclosure title="v1.7.0 - Collaboration" subtle>
        <p>Mentions now support groups; added inline reactions for comments.</p>
      </Disclosure>
    </div>
  );
}

function DisclosurePreview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FAQAccordion />
      <ReleaseChangelog />
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "disclosure",
  name: "Disclosure",
  description: "details/summary-based accordion with animated caret and soft shells.",
  tags: ["content", "faq"],
  Preview: DisclosurePreview,
  sourcePath: "src/components/Disclosure/Disclosure.tsx"
};

export default entry;
export { Disclosure };

