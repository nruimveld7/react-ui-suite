import { useState } from "react";
import { Alert } from "react-ui-suite";
import type { AlertProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Alert.demo.css";

function AlertsStack() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="alert-demo-stack">
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
    <div className="alert-demo-stack">
      <Alert
        title="Payment required"
        description="We could not charge your default payment method."
        variant="danger"
        onDismiss={() => setAcks((value) => value + 1)}
      />
      {acks > 0 && (
        <p className="alert-demo-note">
          Dismissed {acks} {acks === 1 ? "time" : "times"}.
        </p>
      )}
    </div>
  );
}

function PersistentAlertExample() {
  return (
    <div className="alert-demo-stack">
      <Alert
        title="Quota at 82%"
        variant="warning"
        description="Upgrade to unlock more automations."
      />
      <p className="alert-demo-note">Leave off onDismiss to keep alerts present.</p>
    </div>
  );
}

function AlertPreview() {
  return (
    <div className="alert-demo-preview">
      <AlertsStack />
      <div className="alert-demo-grid">
        <div className="alert-demo-panel">
          <p className="alert-demo-panel__label">High priority</p>
          <div className="alert-demo-panel__body">
            <DangerAlertExample />
          </div>
        </div>
        <div className="alert-demo-panel">
          <p className="alert-demo-panel__label">Persistent notice</p>
          <div className="alert-demo-panel__body">
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
