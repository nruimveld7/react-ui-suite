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
      className="rui-disclosure-demo__u-border-radius-1-5rem--ea189a088a rui-disclosure-demo__u-border-width-1px--ca6bcd4b6f rui-disclosure-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-disclosure-demo__u-background-color-rgb-255-255-255--6c21de570d rui-disclosure-demo__u-padding-1rem--8e63407b5c rui-disclosure-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-disclosure-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-disclosure-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-disclosure-demo__u-margin-top-0-75rem--eccd13ef4f rui-disclosure-demo__u-style--6f7e013d64">
        {faqs.map((item, index) => (
          <div key={item.q} className="rui-disclosure-demo__faq-item">
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
      className="rui-disclosure-demo__u-style--6f7e013d64 rui-disclosure-demo__u-border-radius-1-5rem--ea189a088a rui-disclosure-demo__u-border-width-1px--ca6bcd4b6f rui-disclosure-demo__u-border-color-rgb-226-232-240-1--52f4da2ca5 rui-disclosure-demo__u-background-color-rgb-255-255-255--6c21de570d rui-disclosure-demo__u-padding-1rem--8e63407b5c rui-disclosure-demo__u-box-shadow-0-0-0000-0-0-0000-0-1--438b2237b8 rui-disclosure-demo__u-border-color-rgb-30-41-59-1--2072c87505 rui-disclosure-demo__u-background-color-rgb-15-23-42-0---5212cbf15b"
    >
      <div className="rui-disclosure-demo__faq-item">
        <Disclosure title="v1.8.0 - Workflow builder" defaultOpen subtle>
          <ul className="rui-disclosure-demo__u-list-style-type-disc--1f33b438c8 rui-disclosure-demo__u-style--da7c36cd88 rui-disclosure-demo__u-padding-left-1rem--fdb4af3ae0">
            <li>Added conditional branches to automation builder.</li>
            <li>New templates for onboarding and customer success.</li>
            <li>Improved logs with live tail and filters.</li>
          </ul>
        </Disclosure>
      </div>
      <div className="rui-disclosure-demo__faq-item">
        <Disclosure title="v1.7.2 - Stability" subtle>
          <p>Fixed latency spikes in EU-West and reduced cold start times by 25%.</p>
        </Disclosure>
      </div>
      <div className="rui-disclosure-demo__faq-item">
        <Disclosure title="v1.7.0 - Collaboration" subtle>
          <p>Mentions now support groups; added inline reactions for comments.</p>
        </Disclosure>
      </div>
    </DemoExample>
  );
}

function DisclosurePreview() {
  return (
    <div className="rui-disclosure-demo__u-display-grid--f3c543ad5f rui-disclosure-demo__u-gap-1rem--0c3bc98565 rui-disclosure-demo__u-grid-template-columns-repeat-2-m--e4d6f343b9">
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



