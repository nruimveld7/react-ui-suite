import { useState, type CSSProperties } from "react";
import { Alert } from "react-ui-suite";
import type { AlertProps } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import "./Alert.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

const examplePanelStyle: CSSProperties = {
  padding: "var(--rui-space-3) var(--rui-space-4) var(--rui-space-2)",
};

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

function NoticeAlertExample() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="alert-demo-stack">
      {visible && (
        <Alert
          title="Quota at 82%"
          variant="warning"
          description="Upgrade to unlock more automations."
          onDismiss={() => setVisible(false)}
        />
      )}
    </div>
  );
}

function PersistentAlertExample() {
  return (
    <div className="alert-demo-stack" style={{ gap: "var(--rui-space-2)" }}>
      <Alert
        title="Payment required"
        description="We could not charge your default payment method."
        variant="danger"
      />
      <p className="alert-demo-note" style={{ margin: 0 }}>
        Leave off onDismiss to keep alerts present.
      </p>
    </div>
  );
}

function AlertPreview() {
  return (
    <div className="alert-demo-preview">
      <DemoExample title="Stack">
        <AlertsStack />
      </DemoExample>
      <div className="alert-demo-grid">
        <DemoExample title="Notice" style={examplePanelStyle}>
          <NoticeAlertExample />
        </DemoExample>
        <DemoExample title="Persistent notice" style={examplePanelStyle}>
          <PersistentAlertExample />
        </DemoExample>
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
