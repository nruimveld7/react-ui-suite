import { useState } from "react";
import { Alert } from "react-ui-suite";
import type { AlertProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";

function AlertsStack() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="space-y-3">
      {visible && (
        <Alert
          title="Workspace updated"
          description="We deployed your latest design tokens. Check the audit log for details."
          variant="success"
          onDismiss={() => setVisible(false)}
        />
      )}
      <Alert
        title="Maintenance window"
        description="API requests may be slower from 01:00-03:00 UTC."
        variant="warning"
      />
      <Alert
        title="Need help?"
        description="Chat with support directly from this panel."
        variant="info"
      />
    </div>
  );
}

function DangerAlertExample() {
  const [acks, setAcks] = useState(0);
  return (
    <div className="space-y-2">
      <Alert
        title="Payment required"
        description="We could not charge your default payment method."
        variant="danger"
        onDismiss={() => setAcks((value) => value + 1)}
      />
      {acks > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Dismissed {acks} {acks === 1 ? "time" : "times"}.
        </p>
      )}
    </div>
  );
}

function PersistentAlertExample() {
  return (
    <div className="space-y-2">
      <Alert
        title="Quota at 82%"
        variant="warning"
        description="Upgrade to unlock more automations."
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Leave off onDismiss to keep alerts present.
      </p>
    </div>
  );
}

function AlertPreview() {
  return (
    <div className="space-y-4">
      <AlertsStack />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            High priority
          </p>
          <div className="mt-2">
            <DangerAlertExample />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
            Persistent notice
          </p>
          <div className="mt-2">
            <PersistentAlertExample />
          </div>
        </div>
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "alert",
  name: "Alert",
  description: "Dismissible inline alert with success, info, warning, and danger variants.",
  tags: ["feedback", "status"],
  Preview: AlertPreview,
  sourcePath: "src/components/Alert/Alert.tsx",
};

export default entry;
export { Alert };
export type { AlertProps };
