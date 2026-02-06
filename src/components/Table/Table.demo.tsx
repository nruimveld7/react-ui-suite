import { useMemo, useState } from "react";
import { Checkbox, InputField, Table } from "react-ui-suite";
import type { TableColumn } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../../../demo/component-registry";
import clsx from "clsx";
import "./Table.demo.css";
import { DemoExample } from "../../../demo/src/components/DemoExample";

type Row = {
  name: string;
  status: "Active" | "Paused" | "Error";
  latency: number;
  region: string;
};

const baseRows: Row[] = [
  { name: "Billing API", status: "Active", latency: 142, region: "us-east-1" },
  { name: "Notifications", status: "Paused", latency: 0, region: "eu-west-1" },
  { name: "Realtime", status: "Active", latency: 88, region: "us-west-2" },
  { name: "Ingestion", status: "Error", latency: 420, region: "us-east-1" },
  { name: "Exports", status: "Active", latency: 215, region: "ap-southeast-1" },
];

const statusTone: Record<Row["status"], string> = {
  Active: "rui-table-demo__status-pill--active",
  Paused: "rui-table-demo__status-pill--paused",
  Error: "rui-table-demo__status-pill--error",
};

function ServiceTable() {
  const [hidePaused, setHidePaused] = useState(false);
  const rows = useMemo(
    () => (hidePaused ? baseRows.filter((row) => row.status !== "Paused") : baseRows),
    [hidePaused]
  );

  const columns: TableColumn<Row>[] = [
    { key: "name", header: "Service" },
    {
      key: "status",
      header: "Status",
      render: (value: Row["status"]) => (
        <span
          className={clsx("rui-table-demo__status-pill", statusTone[value])}
        >
          <span className="rui-table-demo__status-dot" />
          {value}
        </span>
      ),
    },
    {
      key: "latency",
      header: "p95",
      align: "right",
      render: (value: number) => (
        <span className="rui-table-demo__metric">
          {value ? `${value}ms` : "N/A"}
        </span>
      ),
    },
    { key: "region", header: "Region" },
  ];

  return (
    <DemoExample
      title="Services"
      className="rui-table-demo__card"
    >
      <div className="rui-table-demo__header">
        <div>
          <p className="rui-table-demo__copy">
            Native table with soft zebra styling.
          </p>
        </div>
        <Checkbox
          label="Hide paused"
          checked={hidePaused}
          onChange={setHidePaused}
          className="rui-table-demo__filter-checkbox"
        />
      </div>
      <div className="rui-table-demo__table-wrap">
        <Table<Row> columns={columns} data={rows} caption="Service health" />
      </div>
    </DemoExample>
  );
}

type MemberRow = {
  user: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Invited" | "Suspended";
  team: string;
};

const memberRows: MemberRow[] = [
  { user: "Alex Rivera", role: "Admin", status: "Active", team: "Core" },
  { user: "Jamie Chen", role: "Editor", status: "Active", team: "Data" },
  { user: "Morgan Patel", role: "Editor", status: "Invited", team: "Growth" },
  { user: "Priya Das", role: "Viewer", status: "Active", team: "Core" },
  { user: "Riley Brooks", role: "Viewer", status: "Suspended", team: "Ops" },
];

const memberStatusTone: Record<MemberRow["status"], string> = {
  Active: "rui-table-demo__status-pill--active",
  Invited: "rui-table-demo__status-pill--invited",
  Suspended: "rui-table-demo__status-pill--error",
};

function MembersTable() {
  const [filter, setFilter] = useState<MemberRow["status"] | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return memberRows.filter((row) => {
      const matchesStatus = filter === "All" || row.status === filter;
      const matchesQuery =
        row.user.toLowerCase().includes(query.toLowerCase()) ||
        row.team.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [filter, query]);

  const columns: TableColumn<MemberRow>[] = [
    { key: "user", header: "Member" },
    { key: "team", header: "Team" },
    { key: "role", header: "Role" },
    {
      key: "status",
      header: "Status",
      render: (value: MemberRow["status"]) => (
        <span className={clsx("rui-table-demo__status-pill", memberStatusTone[value])}>
          {value}
        </span>
      ),
    },
  ];

  const filters: Array<MemberRow["status"] | "All"> = ["All", "Active", "Invited", "Suspended"];

  return (
    <DemoExample
      title="Members"
      className="rui-table-demo__card"
    >
      <div className="rui-table-demo__header rui-table-demo__header--wrap">
        <div>
          <p className="rui-table-demo__copy">Quick filter chips + search.</p>
        </div>
        <div className="rui-table-demo__search">
          <InputField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people or teams"
            className="rui-table-demo__search-input"
          />
        </div>
      </div>
      <div className="rui-table-demo__filters">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={clsx(
              "rui-table-demo__filter-button",
              filter === item && "rui-table-demo__filter-button--active"
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="rui-table-demo__table-wrap">
        <Table<MemberRow> columns={columns} data={filtered} caption="Workspace members" />
      </div>
    </DemoExample>
  );
}

type BillingAlignRow = {
  invoice: string;
  amount: string;
  colLT: string;
  colCT: string;
  colRT: string;
  colLM: string;
  colCM: string;
  colRM: string;
  colLB: string;
  colCB: string;
  colRB: string;
};

function createBillingRow(invoice: string, amount: string): BillingAlignRow {
  return {
    invoice,
    amount,
    colLT: invoice,
    colCT: invoice,
    colRT: invoice,
    colLM: invoice,
    colCM: invoice,
    colRM: invoice,
    colLB: invoice,
    colCB: invoice,
    colRB: invoice,
  };
}

const billingRows: BillingAlignRow[] = [
  createBillingRow("INV-2041", "$1,280.00"),
  createBillingRow("INV-2042", "$760.00"),
  createBillingRow("INV-2043", "$420.00"),
];

function BillingTable() {
  const renderBillingCell = (_value: string, row: BillingAlignRow, alignY?: "top" | "middle" | "bottom") => {
    const showTopSpacer = alignY === "bottom" || alignY === "middle";
    const showBottomSpacer = alignY === "top" || alignY === "middle";

    return (
      <span className="rui-table-demo__billing-cell">
        {showTopSpacer ? <span className="rui-table-demo__billing-spacer" aria-hidden="true" /> : null}
        <span className="rui-table-demo__billing-title">
          {row.invoice}
        </span>
        <span className="rui-table-demo__billing-amount">
          {row.amount}
        </span>
        {showBottomSpacer ? <span className="rui-table-demo__billing-spacer" aria-hidden="true" /> : null}
      </span>
    );
  };

  const columns: TableColumn<BillingAlignRow>[] = [
    { key: "colLT", header: "L/T", align: "left", render: (value, row) => renderBillingCell(value, row, "top") },
    { key: "colCT", header: "C/T", align: "center", render: (value, row) => renderBillingCell(value, row, "top") },
    { key: "colRT", header: "R/T", align: "right", render: (value, row) => renderBillingCell(value, row, "top") },
    { key: "colLM", header: "L/M", align: "left", render: (value, row) => renderBillingCell(value, row, "middle") },
    { key: "colCM", header: "C/M", align: "center", render: (value, row) => renderBillingCell(value, row, "middle") },
    { key: "colRM", header: "R/M", align: "right", render: (value, row) => renderBillingCell(value, row, "middle") },
    { key: "colLB", header: "L/B", align: "left", render: (value, row) => renderBillingCell(value, row, "bottom") },
    { key: "colCB", header: "C/B", align: "center", render: (value, row) => renderBillingCell(value, row, "bottom") },
    { key: "colRB", header: "R/B", align: "right", render: (value, row) => renderBillingCell(value, row, "bottom") },
  ];

  return (
    <DemoExample
      title="Billing"
      className="rui-table-demo__card"
    >
      <div className="rui-table-demo__header">
        <div>
          <p className="rui-table-demo__copy">
            Alignment matrix (X/Y).
          </p>
        </div>
      </div>
      <div className="rui-table-demo__table-wrap">
        <Table<BillingAlignRow>
          className="rui-table-demo__billing-align-table"
          columns={columns}
          data={billingRows}
          caption="Alignment grid"
        />
      </div>
    </DemoExample>
  );
}

type TicketRow = {
  id: string;
  summary: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Closed";
  queue: string;
  assignee: string;
};

const ticketRows: TicketRow[] = Array.from({ length: 40 }, (_, i) => ({
  id: `TKT-${1000 + i}`,
  summary: `Customer-reported issue number ${i + 1} with details and reproduction steps`,
  priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
  status: i % 4 === 0 ? "Open" : i % 4 === 1 ? "In Progress" : "Closed",
  queue: i % 2 === 0 ? "Billing" : "App",
  assignee: `Agent ${String.fromCharCode(65 + (i % 10))}`,
}));

const ticketRowsWide: TicketRow[] = [
  {
    id: "INIT-2101",
    summary: "Launch adaptive pricing pilot in EU storefronts",
    priority: "High",
    status: "In Progress",
    queue: "Growth",
    assignee: "Lena Ortiz",
  },
  {
    id: "INIT-2102",
    summary: "Embed AI-driven FAQ drafts in support inbox",
    priority: "Medium",
    status: "Open",
    queue: "Support",
    assignee: "Elliot Shaw",
  },
  {
    id: "INIT-2103",
    summary: "Ship offline sync for field reps with conflict resolution",
    priority: "High",
    status: "In Progress",
    queue: "Mobile",
    assignee: "Mara Singh",
  },
  {
    id: "INIT-2104",
    summary: "Enable self-service SSO domain verification",
    priority: "Medium",
    status: "Open",
    queue: "Identity",
    assignee: "Yuki Tan",
  },
  {
    id: "INIT-2105",
    summary: "Add near-real-time anomaly alerts to executive dashboard",
    priority: "Medium",
    status: "Open",
    queue: "Analytics",
    assignee: "Priya Das",
  },
  {
    id: "INIT-2106",
    summary: "Roll out multi-region edge caching for media assets",
    priority: "Low",
    status: "Open",
    queue: "Infra",
    assignee: "Jordan Lake",
  },
  {
    id: "INIT-2107",
    summary: "Introduce carbon footprint reporting to usage exports",
    priority: "Low",
    status: "Closed",
    queue: "Sustainability",
    assignee: "Noel Hart",
  },
  {
    id: "INIT-2108",
    summary: "Create guided onboarding tours with role-aware content",
    priority: "Medium",
    status: "In Progress",
    queue: "Onboarding",
    assignee: "Samira Ali",
  },
];

function TicketsTable() {
  const columns: TableColumn<TicketRow>[] = [
    { key: "id", header: "Ticket" },
    { key: "summary", header: "Summary" },
  ];

  return (
    <DemoExample
      title="Tickets"
      className="rui-table-demo__card"
    >
      <div className="rui-table-demo__header">
        <div>
          <p className="rui-table-demo__copy">Vertical overflow example.</p>
        </div>
      </div>
      <div className="rui-table-demo__table-wrap">
        <Table<TicketRow>
          columns={columns}
          data={ticketRows}
          caption="Support tickets"
          scrollAreaStyle={{ maxHeight: 320 }}
        />
      </div>
    </DemoExample>
  );
}

function TicketsTableDuplicate() {
  const columns: TableColumn<TicketRow>[] = [
    { key: "id", header: "Initiative" },
    { key: "summary", header: "Description" },
    { key: "queue", header: "Track" },
    { key: "priority", header: "Priority" },
    { key: "status", header: "Status" },
    { key: "assignee", header: "Owner" },
  ];

  return (
    <DemoExample
      title="Initiatives"
      className="rui-table-demo__card"
    >
      <div className="rui-table-demo__header">
        <div>
          <p className="rui-table-demo__copy">
            Vertical + horizontal overflow example.
          </p>
        </div>
      </div>
      <div className="rui-table-demo__table-wrap">
        <Table<TicketRow>
          columns={columns}
          data={ticketRowsWide}
          caption="Innovation roadmap (wide, mixed tracks)"
          scrollAreaStyle={{ maxHeight: 320 }}
        />
      </div>
    </DemoExample>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "table",
  name: "Table",
  description: "Semantic table with zebra rows, status pills, and quick filtering.",
  tags: ["data", "table"],
  Preview: function TablePreview() {
    return (
      <div className="rui-table-demo">
        <ServiceTable />
        <div className="rui-table-demo__grid rui-table-demo__grid--two">
          <MembersTable />
          <BillingTable />
        </div>
        <div className="rui-table-demo__grid rui-table-demo__grid--two">
          <TicketsTable />
          <TicketsTableDuplicate />
        </div>
      </div>
    );
  },
  sourcePath: "src/components/Table/Table.tsx",
};

export default entry;
export { Table };









