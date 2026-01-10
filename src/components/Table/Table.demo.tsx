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
  Active: "rui-table-demo__u-background-color-rgb-16-185-129---5a31c1c8ef rui-table-demo__u-rui-text-opacity-1--72a4c7cdee",
  Paused: "rui-table-demo__u-background-color-rgb-251-191-36---2d0a4f72fa rui-table-demo__u-rui-text-opacity-1--f5f136c41d",
  Error: "rui-table-demo__u-background-color-rgb-244-63-94-0--9c84066f4b rui-table-demo__u-rui-text-opacity-1--72a4c7cdee",
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
          className={clsx("rui-table-demo__statusPill", statusTone[value])}
        >
          <span className="rui-table-demo__u-display-block--0214b4b355 rui-table-demo__u-width-0-375rem--d75e0c426b rui-table-demo__u-border-radius-9999px--ac204c1088 rui-table-demo__u-background-color-rgb-255-255-255--845918557e" />
          {value}
        </span>
      ),
    },
    {
      key: "latency",
      header: "p95",
      align: "right",
      render: (value: number) => (
        <span className="rui-table-demo__u-font-weight-600--e83a7042bc rui-table-demo__u-rui-text-opacity-1--f5f136c41d rui-table-demo__u-rui-text-opacity-1--e1d41ccd69">
          {value ? `${value}ms` : "N/A"}
        </span>
      ),
    },
    { key: "region", header: "Region" },
  ];

  return (
    <DemoExample
      title="Services"
      className="rui-table-demo__u-border-radius-1-5rem--ea189a088a rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-background-color-rgb-255-255-255--6c21de570d rui-table-demo__u-padding-1rem--8e63407b5c rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table-demo__u-rui-border-opacity-1--2072c87505 rui-table-demo__u-background-color-rgb-15-23-42-0---5212cbf15b rui-table-demo__u-overflow-hidden--2cd02d11d1"
    >
      <div className="rui-table-demo__u-display-flex--60fbb77139 rui-table-demo__u-align-items-center--3960ffc248 rui-table-demo__u-justify-content-space-between--8ef2268efb rui-table-demo__u-gap-0-75rem--1004c0c395">
        <div>
          <p className="rui-table-demo__u-font-size-0-875rem--fc7473ca09 rui-table-demo__u-rui-text-opacity-1--2d6fbf48fa rui-table-demo__u-rui-text-opacity-1--cc0274aad9">
            Native table with soft zebra styling.
          </p>
        </div>
        <Checkbox
          label="Hide paused"
          checked={hidePaused}
          onChange={setHidePaused}
          className="rui-table-demo__u-width-moz-fit-content--92e7450ad2 rui-table-demo__u-border-radius-0-75rem--a217b4eaa9 rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-rui-bg-opacity-1--5e10cdb8f1 rui-table-demo__u-padding-left-0-5rem--d5eab218aa rui-table-demo__u-padding-top-0-25rem--660d2effb8 rui-table-demo__u-rui-border-opacity-1--4e12bcf58d rui-table-demo__u-background-color-rgb-24-24-27-0---5cd2915a74"
        />
      </div>
      <div className="rui-table-demo__u-margin-top-0-75rem--eccd13ef4f">
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
  Active: "rui-table-demo__u-background-color-rgb-16-185-129---5a31c1c8ef rui-table-demo__u-rui-text-opacity-1--72a4c7cdee",
  Invited: "rui-table-demo__u-background-color-rgb-56-189-248---d2f1dd6d0a rui-table-demo__u-rui-text-opacity-1--72a4c7cdee",
  Suspended: "rui-table-demo__u-background-color-rgb-244-63-94-0--9c84066f4b rui-table-demo__u-rui-text-opacity-1--72a4c7cdee",
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
        <span className={clsx("rui-table-demo__statusPill", memberStatusTone[value])}>
          {value}
        </span>
      ),
    },
  ];

  const filters: Array<MemberRow["status"] | "All"> = ["All", "Active", "Invited", "Suspended"];

  return (
    <DemoExample
      title="Members"
      className="rui-table-demo__u-border-radius-1-5rem--ea189a088a rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-background-color-rgb-255-255-255--6c21de570d rui-table-demo__u-padding-1rem--8e63407b5c rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table-demo__u-rui-border-opacity-1--2072c87505 rui-table-demo__u-background-color-rgb-15-23-42-0---5212cbf15b rui-table-demo__u-overflow-hidden--2cd02d11d1"
    >
      <div className="rui-table-demo__u-display-flex--60fbb77139 rui-table-demo__u-flex-wrap-wrap--1eb5c6df38 rui-table-demo__u-align-items-center--3960ffc248 rui-table-demo__u-justify-content-space-between--8ef2268efb rui-table-demo__u-gap-0-75rem--1004c0c395">
        <div>
          <p className="rui-table-demo__u-font-size-0-875rem--fc7473ca09 rui-table-demo__u-rui-text-opacity-1--2d6fbf48fa rui-table-demo__u-rui-text-opacity-1--cc0274aad9">Quick filter chips + search.</p>
        </div>
        <div className="rui-table-demo__u-width-100--6da6a3c3f7 rui-table-demo__u-max-width-32rem--6199866f61">
          <InputField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people or teams"
            className="rui-table-demo__u-width-100--6da6a3c3f7"
          />
        </div>
      </div>
      <div className="rui-table-demo__u-margin-top-0-75rem--eccd13ef4f rui-table-demo__u-display-flex--60fbb77139 rui-table-demo__u-flex-wrap-wrap--1eb5c6df38 rui-table-demo__u-gap-0-5rem--77a2a20e90">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={clsx(
              "rui-table-demo__u-border-radius-9999px--ac204c1088 rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-padding-left-0-75rem--0e17f2bd90 rui-table-demo__u-padding-top-0-25rem--660d2effb8 rui-table-demo__u-font-size-11px--d058ca6de6 rui-table-demo__u-font-weight-600--e83a7042bc rui-table-demo__u-text-transform-uppercase--117ec720ea rui-table-demo__u-letter-spacing-0-2em--2da1a7016e rui-table-demo__u-rui-text-opacity-1--30426eb75c rui-table-demo__u-transition-property-color-backgr--56bf8ae82a rui-table-demo__u-rui-translate-y-1px--2464a58ddc rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--ab1dd417ce rui-table-demo__u-rui-text-opacity-1--ca11017ff7",
              filter === item
                ? "rui-table-demo__u-rui-border-opacity-1--6b0439773b rui-table-demo__u-rui-bg-opacity-1--5e10cdb8f1 rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table-demo__u-rui-border-opacity-1--ba51e3e27c rui-table-demo__u-rui-bg-opacity-1--16ce49611c"
                : "rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-rui-bg-opacity-1--5e10cdb8f1 rui-table-demo__u-rui-border-opacity-1--30fb741464 rui-table-demo__u-rui-bg-opacity-1--f2a0c62312"
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="rui-table-demo__u-margin-top-0-75rem--eccd13ef4f">
        <Table<MemberRow> columns={columns} data={filtered} caption="Workspace members" />
      </div>
    </DemoExample>
  );
}

type InvoiceRow = {
  invoice: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  issued: string;
};

const invoiceRows: InvoiceRow[] = [
  { invoice: "INV-2041", amount: 1280, status: "Paid", issued: "2025-10-04" },
  { invoice: "INV-2042", amount: 760, status: "Pending", issued: "2025-10-12" },
  { invoice: "INV-2043", amount: 420, status: "Paid", issued: "2025-11-01" },
  { invoice: "INV-2044", amount: 1520, status: "Overdue", issued: "2025-11-15" },
  { invoice: "INV-2045", amount: 940, status: "Pending", issued: "2025-11-20" },
];

const invoiceTone: Record<InvoiceRow["status"], string> = {
  Paid: "rui-table-demo__u-background-color-rgb-16-185-129---5a31c1c8ef rui-table-demo__u-rui-text-opacity-1--72a4c7cdee",
  Pending: "rui-table-demo__u-background-color-rgb-251-191-36---2d0a4f72fa rui-table-demo__u-rui-text-opacity-1--f5f136c41d",
  Overdue: "rui-table-demo__u-background-color-rgb-244-63-94-0--9c84066f4b rui-table-demo__u-rui-text-opacity-1--72a4c7cdee",
};

function BillingTable() {
  const [onlyOpen, setOnlyOpen] = useState(false);
  const rows = useMemo(
    () => (onlyOpen ? invoiceRows.filter((row) => row.status !== "Paid") : invoiceRows),
    [onlyOpen]
  );

  const columns: TableColumn<InvoiceRow>[] = [
    { key: "invoice", header: "Invoice" },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (value: number) => (
        <span className="rui-table-demo__u-font-weight-600--e83a7042bc rui-table-demo__u-rui-text-opacity-1--f5f136c41d rui-table-demo__u-rui-text-opacity-1--e1d41ccd69">
          ${value.toFixed(2)}
        </span>
      ),
    },
    { key: "issued", header: "Issued" },
    {
      key: "status",
      header: "Status",
      render: (value: InvoiceRow["status"]) => (
        <span className={clsx("rui-table-demo__statusPill", invoiceTone[value])}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <DemoExample
      title="Billing"
      className="rui-table-demo__u-border-radius-1-5rem--ea189a088a rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-background-color-rgb-255-255-255--6c21de570d rui-table-demo__u-padding-1rem--8e63407b5c rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table-demo__u-rui-border-opacity-1--2072c87505 rui-table-demo__u-background-color-rgb-15-23-42-0---5212cbf15b rui-table-demo__u-overflow-hidden--2cd02d11d1"
    >
      <div className="rui-table-demo__u-display-flex--60fbb77139 rui-table-demo__u-align-items-center--3960ffc248 rui-table-demo__u-justify-content-space-between--8ef2268efb rui-table-demo__u-gap-0-75rem--1004c0c395">
        <div>
          <p className="rui-table-demo__u-font-size-0-875rem--fc7473ca09 rui-table-demo__u-rui-text-opacity-1--2d6fbf48fa rui-table-demo__u-rui-text-opacity-1--cc0274aad9">
            Zebra rows with amount column.
          </p>
        </div>
        <Checkbox
          label="Open only"
          checked={onlyOpen}
          onChange={setOnlyOpen}
          className="rui-table-demo__u-width-moz-fit-content--92e7450ad2 rui-table-demo__u-border-radius-0-75rem--a217b4eaa9 rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-rui-bg-opacity-1--5e10cdb8f1 rui-table-demo__u-padding-left-0-5rem--d5eab218aa rui-table-demo__u-padding-top-0-25rem--660d2effb8 rui-table-demo__u-rui-border-opacity-1--4e12bcf58d rui-table-demo__u-background-color-rgb-24-24-27-0---5cd2915a74"
        />
      </div>
      <div className="rui-table-demo__u-margin-top-0-75rem--eccd13ef4f">
        <Table<InvoiceRow> columns={columns} data={rows} caption="Invoices" />
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
      className="rui-table-demo__u-border-radius-1-5rem--ea189a088a rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-background-color-rgb-255-255-255--6c21de570d rui-table-demo__u-padding-1rem--8e63407b5c rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table-demo__u-rui-border-opacity-1--2072c87505 rui-table-demo__u-background-color-rgb-15-23-42-0---5212cbf15b rui-table-demo__u-overflow-hidden--2cd02d11d1"
    >
      <div className="rui-table-demo__u-display-flex--60fbb77139 rui-table-demo__u-align-items-center--3960ffc248 rui-table-demo__u-justify-content-space-between--8ef2268efb rui-table-demo__u-gap-0-75rem--1004c0c395">
        <div>
          <p className="rui-table-demo__u-font-size-0-875rem--fc7473ca09 rui-table-demo__u-rui-text-opacity-1--2d6fbf48fa rui-table-demo__u-rui-text-opacity-1--cc0274aad9">Vertical overflow example.</p>
        </div>
      </div>
      <div className="rui-table-demo__u-margin-top-0-75rem--eccd13ef4f">
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
      className="rui-table-demo__u-border-radius-1-5rem--ea189a088a rui-table-demo__u-border-width-1px--ca6bcd4b6f rui-table-demo__u-rui-border-opacity-1--52f4da2ca5 rui-table-demo__u-background-color-rgb-255-255-255--6c21de570d rui-table-demo__u-padding-1rem--8e63407b5c rui-table-demo__u-rui-shadow-0-1px-2px-0-rgb-0-0-0--438b2237b8 rui-table-demo__u-rui-border-opacity-1--2072c87505 rui-table-demo__u-background-color-rgb-15-23-42-0---5212cbf15b rui-table-demo__u-overflow-hidden--2cd02d11d1"
    >
      <div className="rui-table-demo__u-display-flex--60fbb77139 rui-table-demo__u-align-items-center--3960ffc248 rui-table-demo__u-justify-content-space-between--8ef2268efb rui-table-demo__u-gap-0-75rem--1004c0c395">
        <div>
          <p className="rui-table-demo__u-font-size-0-875rem--fc7473ca09 rui-table-demo__u-rui-text-opacity-1--2d6fbf48fa rui-table-demo__u-rui-text-opacity-1--cc0274aad9">
            Vertical + horizontal overflow example.
          </p>
        </div>
      </div>
      <div className="rui-table-demo__u-margin-top-0-75rem--eccd13ef4f">
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
      <div className="rui-table-demo__u-display-grid--f3c543ad5f rui-table-demo__u-gap-1rem--0c3bc98565">
        <ServiceTable />
        <div className="rui-table-demo__u-display-grid--f3c543ad5f rui-table-demo__u-gap-1rem--0c3bc98565 rui-table-demo__u-grid-template-columns-repeat-2-m--e4d6f343b9">
          <MembersTable />
          <BillingTable />
        </div>
        <div className="rui-table-demo__u-display-grid--f3c543ad5f rui-table-demo__u-gap-1rem--0c3bc98565 rui-table-demo__u-grid-template-columns-repeat-2-m--e4d6f343b9">
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
