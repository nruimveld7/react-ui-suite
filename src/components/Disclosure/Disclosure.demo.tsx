import { useState } from "react";
import { Disclosure } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Disclosure.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const faqs = [
  {
    q: "What happens after trial?",
    a: "We ask you to choose a plan. Your data stays intact during the decision.",
  },
  {
    q: "Can I invite my team?",
    a: "Yes, unlimited collaborators on any paid plan. Invite via email or SSO.",
  },
  {
    q: "How do refunds work?",
    a: "If something goes wrong, contact support within 14 days for a full refund.",
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <DemoExample
      title="FAQ"
      className="disclosure-demo-card"
    >
      <div className="disclosure-demo-list">
        {faqs.map((item, index) => (
          <div key={item.q} className="disclosure-demo__faq-item">
            <Disclosure
              subtle
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
          </div>
        ))}
      </div>
    </DemoExample>
  );
}

function ReleaseChangelog() {
  return (
    <DemoExample
      title="Changelog"
      className="disclosure-demo-card disclosure-demo-card--stack"
    >
      <div className="disclosure-demo__faq-item">
        <Disclosure title="v1.8.0 - Workflow builder" defaultOpen subtle>
          <ul className="disclosure-demo-bullet-list">
            <li>Added conditional branches to automation builder.</li>
            <li>New templates for onboarding and customer success.</li>
            <li>Improved logs with live tail and filters.</li>
          </ul>
        </Disclosure>
      </div>
      <div className="disclosure-demo__faq-item">
        <Disclosure title="v1.7.2 - Stability" subtle>
          <p>Fixed latency spikes in EU-West and reduced cold start times by 25%.</p>
        </Disclosure>
      </div>
      <div className="disclosure-demo__faq-item">
        <Disclosure title="v1.7.0 - Collaboration" subtle>
          <p>Mentions now support groups; added inline reactions for comments.</p>
        </Disclosure>
      </div>
    </DemoExample>
  );
}

function DisclosurePreview() {
  return (
    <div className="disclosure-demo-grid">
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
  sourcePath: "src/components/Disclosure/Disclosure.tsx",
};

export default entry;
export { Disclosure };



