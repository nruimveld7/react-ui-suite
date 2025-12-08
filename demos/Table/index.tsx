import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Checkbox, InputField, Table } from "react-ui-suite";
import type { TableColumn } from "react-ui-suite";
import type { ComponentRegistryEntry } from "../component-registry";

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
  Active: "bg-emerald-500/90 text-white",
  Paused: "bg-amber-400/90 text-slate-900",
  Error: "bg-rose-500/90 text-white",
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
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${statusTone[value]}`}
        >
          <span className="block size-1.5 rounded-full bg-white/80" />
          {value}
        </span>
      ),
    },
    {
      key: "latency",
      header: "p95",
      align: "right",
      render: (value: number) => (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {value ? `${value}ms` : "N/A"}
        </span>
      ),
    },
    { key: "region", header: "Region" },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Services
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Native table with soft zebra styling.
          </p>
        </div>
        <Checkbox
          label="Hide paused"
          checked={hidePaused}
          onChange={setHidePaused}
          className="w-fit rounded-xl border border-slate-200 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900/70"
        />
      </div>
      <div className="mt-3">
        <Table<Row> columns={columns} data={rows} caption="Service health" />
      </div>
    </div>
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
  Active: "bg-emerald-500/90 text-white",
  Invited: "bg-sky-400/90 text-white",
  Suspended: "bg-rose-500/90 text-white",
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
        <span
          className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${memberStatusTone[value]}`}
        >
          {value}
        </span>
      ),
    },
  ];

  const filters: Array<MemberRow["status"] | "All"> = ["All", "Active", "Invited", "Suspended"];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Members
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Quick filter chips + search.</p>
        </div>
        <div className="w-full max-w-lg">
          <InputField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people or teams"
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={twMerge(
              "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:-translate-y-[1px] hover:shadow-sm dark:text-slate-300",
              filter === item
                ? "border-slate-400 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800"
                : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <Table<MemberRow> columns={columns} data={filtered} caption="Workspace members" />
      </div>
    </div>
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
  Paid: "bg-emerald-500/90 text-white",
  Pending: "bg-amber-400/90 text-slate-900",
  Overdue: "bg-rose-500/90 text-white",
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
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          ${value.toFixed(2)}
        </span>
      ),
    },
    { key: "issued", header: "Issued" },
    {
      key: "status",
      header: "Status",
      render: (value: InvoiceRow["status"]) => (
        <span
          className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${invoiceTone[value]}`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Billing
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Zebra rows with amount column.
          </p>
        </div>
        <Checkbox
          label="Open only"
          checked={onlyOpen}
          onChange={setOnlyOpen}
          className="w-fit rounded-xl border border-slate-200 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900/70"
        />
      </div>
      <div className="mt-3">
        <Table<InvoiceRow> columns={columns} data={rows} caption="Invoices" />
      </div>
    </div>
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
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Tickets
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Vertical overflow example.</p>
        </div>
      </div>
      <div className="mt-3">
        <Table<TicketRow>
          columns={columns}
          data={ticketRows}
          caption="Support tickets"
          scrollAreaStyle={{ maxHeight: 320 }}
        />
      </div>
    </div>
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
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Initiatives
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Vertical + horizontal overflow example.
          </p>
        </div>
      </div>
      <div className="mt-3">
        <Table<TicketRow>
          columns={columns}
          data={ticketRowsWide}
          caption="Innovation roadmap (wide, mixed tracks)"
          scrollAreaStyle={{ maxHeight: 320 }}
        />
      </div>
    </div>
  );
}

const entry: ComponentRegistryEntry = {
  slug: "table",
  name: "Table",
  description: "Semantic table with zebra rows, status pills, and quick filtering.",
  tags: ["data", "table"],
  Preview: function TablePreview() {
    return (
      <div className="grid gap-4">
        <ServiceTable />
        <div className="grid gap-4 md:grid-cols-2">
          <MembersTable />
          <BillingTable />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
