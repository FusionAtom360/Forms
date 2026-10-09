"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  Copy,
  Ellipsis,
  FileText,
  Filter,
  Folder,
  Grid2X2,
  HelpCircle,
  LayoutTemplate,
  Link2,
  Menu,
  Plus,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormStatus = "Published" | "Draft";
type FormItem = {
  id: number;
  title: string;
  description: string;
  status: FormStatus;
  responses: number;
  updated: string;
  icon: string;
  accent: string;
};

const initialForms: FormItem[] = [
  {
    id: 1,
    title: "Customer feedback",
    description: "Understand how customers feel about your product.",
    status: "Published",
    responses: 248,
    updated: "Updated 2h ago",
    icon: "✦",
    accent: "bg-[#e5f1ee] text-[#1b806f]",
  },
  {
    id: 2,
    title: "Product launch waitlist",
    description: "Collect early access signups for the new release.",
    status: "Published",
    responses: 156,
    updated: "Updated yesterday",
    icon: "◒",
    accent: "bg-[#f7eddc] text-[#ad7235]",
  },
  {
    id: 3,
    title: "Team pulse check",
    description: "A quick monthly check-in for your growing team.",
    status: "Draft",
    responses: 0,
    updated: "Edited 3 days ago",
    icon: "⌁",
    accent: "bg-[#ece8f7] text-[#7259a9]",
  },
  {
    id: 4,
    title: "Partner onboarding",
    description: "Bring new partners into your ecosystem smoothly.",
    status: "Published",
    responses: 89,
    updated: "Updated 5 days ago",
    icon: "◈",
    accent: "bg-[#e8eef7] text-[#4675a9]",
  },
];

const activities = [
  { name: "Jordan Lee", action: "submitted Customer feedback", time: "12 min ago", initials: "JL", color: "bg-[#dcece8] text-[#317c71]" },
  { name: "Avery Morgan", action: "submitted Customer feedback", time: "34 min ago", initials: "AM", color: "bg-[#f3e6d6] text-[#a96f34]" },
  { name: "Sam Rivera", action: "submitted Product launch waitlist", time: "1 hr ago", initials: "SR", color: "bg-[#e7e3f4] text-[#725ca7]" },
  { name: "Casey Brown", action: "submitted Customer feedback", time: "2 hrs ago", initials: "CB", color: "bg-[#e1e9f3] text-[#5277a2]" },
];

const templates = [
  { title: "Event registration", icon: ClipboardList, color: "bg-[#e6f1ee] text-[#237c6d]" },
  { title: "Contact form", icon: Users, color: "bg-[#f6eddd] text-[#ac7237]" },
  { title: "Job application", icon: FileText, color: "bg-[#ece8f6] text-[#745ca7]" },
];

export default function Home() {
  const [forms, setForms] = useState(initialForms);
  const [activeNav, setActiveNav] = useState("All forms");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [copied, setCopied] = useState(false);

  const visibleForms = useMemo(() => {
    return forms.filter((form) => {
      const matchesQuery = `${form.title} ${form.description}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = activeNav === "All forms" || (activeNav === "Published" ? form.status === "Published" : form.status === "Draft");
      return matchesQuery && matchesStatus;
    });
  }, [activeNav, forms, query]);

  function createForm() {
    const title = newTitle.trim() || "Untitled form";
    setForms((current) => [
      {
        id: Date.now(),
        title,
        description: "Start collecting thoughtful responses from your audience.",
        status: "Draft",
        responses: 0,
        updated: "Edited just now",
        icon: "＋",
        accent: "bg-[#e8eef7] text-[#4675a9]",
      },
      ...current,
    ]);
    setNewTitle("");
    setShowCreate(false);
    setActiveNav("All forms");
  }

  return (
    <main className="min-h-screen bg-[#f7f8f7] text-[#202723]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[242px] shrink-0 flex-col border-r border-[#e4e9e6] bg-[#fcfdfc] px-4 py-5 lg:flex">
          <div className="mb-10 flex items-center gap-2.5 px-2">
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#1e695d] text-white shadow-sm">
              <Sparkles className="size-[17px]" strokeWidth={2.2} />
            </div>
            <span className="font-serif text-[20px] font-semibold tracking-[-0.04em] text-[#1f3d36]">forms</span>
          </div>
          <nav className="space-y-1">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a1aaa5]">Workspace</p>
            {[
              { label: "All forms", icon: Grid2X2 },
              { label: "Published", icon: Share2 },
              { label: "Drafts", icon: FileText },
              { label: "Templates", icon: LayoutTemplate },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors",
                  activeNav === label ? "bg-[#e8f1ee] text-[#1d6e61]" : "text-[#6e7973] hover:bg-[#f0f4f1] hover:text-[#27372f]",
                )}
              >
                <Icon className="size-[17px]" strokeWidth={1.8} />
                {label}
                {label === "Drafts" && <span className="ml-auto rounded-full bg-[#e9eeeb] px-2 py-0.5 text-[10px] text-[#77827b]">1</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-1 border-t border-[#e7ebe8] pt-5">
            <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-[#6e7973] hover:bg-[#f0f4f1]"><BarChart3 className="size-[17px]" strokeWidth={1.8} />Analytics</button>
            <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-[#6e7973] hover:bg-[#f0f4f1]"><Settings2 className="size-[17px]" strokeWidth={1.8} />Settings</button>
            <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-[#6e7973] hover:bg-[#f0f4f1]"><HelpCircle className="size-[17px]" strokeWidth={1.8} />Help center</button>
            <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-[#f3f6f4] p-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#d8e7e1] text-xs font-semibold text-[#377467]">JD</div>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#38453e]">Jamie Davis</p><p className="truncate text-[10px] text-[#929d96]">Acme Studio</p></div>
              <ChevronDown className="size-3.5 text-[#89958e]" />
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-[72px] items-center justify-between border-b border-[#e4e9e6] bg-[#fcfdfc] px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button className="lg:hidden"><Menu className="size-5 text-[#607068]" /></button>
              <div className="lg:hidden flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[#1e695d] text-white"><Sparkles className="size-3.5" /></span><span className="font-serif text-lg font-semibold text-[#1f3d36]">forms</span></div>
              <span className="hidden text-[13px] text-[#89958e] lg:block">Workspace / <span className="font-medium text-[#45554c]">All forms</span></span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative rounded-lg p-2 text-[#6d7972] hover:bg-[#f0f4f1]"><Bell className="size-[18px]" strokeWidth={1.8} /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#d88958]" /></button>
              <div className="hidden h-5 w-px bg-[#e3e8e4] sm:block" />
              <button className="flex items-center gap-2 text-left"><span className="flex size-8 items-center justify-center rounded-full bg-[#d8e7e1] text-[11px] font-semibold text-[#377467]">JD</span><ChevronDown className="hidden size-3.5 text-[#89958e] sm:block" /></button>
            </div>
          </header>

          <div className="mx-auto max-w-[1380px] px-5 py-8 sm:px-8 lg:px-12">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9aa59e]">Thursday, October 8, 2026</p>
              </div>
              <Button onClick={() => setShowCreate(true)} className="h-10 rounded-lg bg-[#236f62] px-4 text-[13px] shadow-[0_3px_8px_rgba(31,105,92,0.16)] hover:bg-[#1b5c51]"><Plus className="mr-1.5 size-4" />Create a form</Button>
            </div>

            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Total responses", value: "493", change: "+18.4%", icon: ClipboardList },
                { label: "Published forms", value: "3", change: "+1 this month", icon: Share2 },
                { label: "Response rate", value: "68.2%", change: "+4.6%", icon: BarChart3 },
              ].map(({ label, value, change, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-[#e4eae6] bg-white p-5 shadow-[0_2px_10px_rgba(40,67,55,0.025)]">
                  <div className="mb-4 flex items-center justify-between"><span className="text-[12px] font-medium text-[#7e8982]">{label}</span><span className="flex size-8 items-center justify-center rounded-lg bg-[#eff6f2] text-[#438574]"><Icon className="size-[16px]" strokeWidth={1.8} /></span></div>
                  <div className="flex items-end gap-2"><span className="text-[27px] font-semibold tracking-[-0.04em] text-[#263a31]">{value}</span><span className="mb-1 text-[11px] font-medium text-[#4a9a7d]">{change}</span></div>
                </div>
              ))}
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="min-w-0">
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div><h2 className="text-[16px] font-semibold text-[#304239]">Your forms</h2><p className="mt-1 text-xs text-[#8b968f]">Create, manage, and share your forms.</p></div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-[#e0e6e2] bg-white px-3 sm:w-[190px]"><Search className="size-3.5 text-[#a0aaa4]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search forms..." className="w-full bg-transparent text-xs text-[#35473e] outline-none placeholder:text-[#a5aea8]" /></div>
                    <button className="flex h-9 items-center gap-1.5 rounded-lg border border-[#e0e6e2] bg-white px-3 text-xs font-medium text-[#68756d]"><Filter className="size-3.5" /> <span className="hidden sm:inline">Filter</span></button>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#e4eae6] bg-white">
                  <div className="hidden grid-cols-[minmax(0,1.5fr)_110px_100px_34px] items-center gap-4 border-b border-[#edf0ee] bg-[#fafcfb] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#a0aaa4] sm:grid"><span>Form</span><span>Status</span><span>Responses</span><span /></div>
                  {visibleForms.length > 0 ? visibleForms.map((form) => (
                    <div key={form.id} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-[#edf0ee] px-4 py-4 last:border-0 sm:grid-cols-[minmax(0,1.5fr)_110px_100px_34px] sm:gap-4 sm:px-5">
                      <div className="flex min-w-0 items-center gap-3"><div className={cn("flex size-9 shrink-0 items-center justify-center rounded-[10px] text-lg", form.accent)}>{form.icon}</div><div className="min-w-0"><p className="truncate text-[13px] font-semibold text-[#34463d]">{form.title}</p><p className="mt-0.5 truncate text-[11px] text-[#909b94]">{form.description}</p><p className="mt-1 text-[10px] text-[#adb5b0] sm:hidden">{form.updated}</p></div></div>
                      <span className={cn("hidden w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:inline-flex", form.status === "Published" ? "bg-[#e7f4ee] text-[#378468]" : "bg-[#f8efe2] text-[#af783f]")}><span className={cn("size-1.5 rounded-full", form.status === "Published" ? "bg-[#52a77e]" : "bg-[#d69a55]")} />{form.status}</span>
                      <div className="hidden sm:block"><p className="text-[13px] font-semibold text-[#4a5c52]">{form.responses}</p><p className="mt-0.5 text-[10px] text-[#a5aea8]">{form.updated}</p></div>
                      <button className="rounded-md p-1.5 text-[#a5aea8] opacity-0 transition-opacity hover:bg-[#f0f4f1] hover:text-[#53645a] group-hover:opacity-100"><Ellipsis className="size-4" /></button>
                    </div>
                  )) : <div className="px-5 py-12 text-center text-sm text-[#89958e]">No forms match your search.</div>}
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl border border-[#deebe6] bg-[#eff7f3] px-4 py-3.5 sm:px-5"><div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-lg bg-white text-[#398272]"><Link2 className="size-4" /></div><p className="text-xs text-[#526d61]">Share your workspace link to collect responses anywhere.</p></div><button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#267264] hover:text-[#195c51]">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? "Copied" : "Copy link"}</button></div>
              </div>

              <aside>
                <div className="mb-7"><div className="mb-4 flex items-center justify-between"><h2 className="text-[16px] font-semibold text-[#304239]">Recent activity</h2><button className="text-[11px] font-semibold text-[#3b8475] hover:text-[#236f62]">View all</button></div><div className="rounded-xl border border-[#e4eae6] bg-white p-4">{activities.map((item) => <div key={item.name} className="flex gap-3 border-b border-[#edf0ee] py-3 first:pt-1 last:border-0 last:pb-1"><div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold", item.color)}>{item.initials}</div><div className="min-w-0"><p className="truncate text-[11px] leading-4 text-[#526058]"><span className="font-semibold text-[#34463d]">{item.name}</span> {item.action}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-[#a1aba4]"><Clock3 className="size-3" />{item.time}</p></div></div>)}</div></div>
                <div><div className="mb-4 flex items-center justify-between"><h2 className="text-[16px] font-semibold text-[#304239]">Start with a template</h2><button className="text-[11px] font-semibold text-[#3b8475]">Browse all</button></div><div className="space-y-2.5">{templates.map(({ title, icon: Icon, color }) => <button key={title} onClick={() => { setNewTitle(title); setShowCreate(true); }} className="flex w-full items-center gap-3 rounded-xl border border-[#e4eae6] bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#bdd8ce] hover:shadow-sm"><span className={cn("flex size-9 items-center justify-center rounded-lg", color)}><Icon className="size-[17px]" strokeWidth={1.7} /></span><span className="flex-1 text-xs font-medium text-[#526158]">{title}</span><ArrowUpRight className="size-3.5 text-[#a3ada6]" /></button>)}</div></div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f302a]/25 px-4 backdrop-blur-[2px]"><div className="w-full max-w-[430px] rounded-2xl border border-[#e3ebe6] bg-white p-6 shadow-[0_20px_70px_rgba(26,63,48,0.18)]"><div className="mb-6 flex items-start justify-between"><div><div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#e5f1ee] text-[#287667]"><Plus className="size-5" /></div><h2 className="font-serif text-2xl font-semibold tracking-[-0.03em] text-[#263c32]">Create a new form</h2><p className="mt-1 text-xs text-[#89958e]">Start with a blank canvas and make it yours.</p></div><button onClick={() => setShowCreate(false)} className="rounded-lg p-1.5 text-[#93a099] hover:bg-[#f1f4f2]"><X className="size-4" /></button></div><label className="mb-2 block text-xs font-semibold text-[#516158]">Form name</label><input autoFocus value={newTitle} onChange={(event) => setNewTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && createForm()} placeholder="e.g. Customer feedback" className="mb-6 h-11 w-full rounded-lg border border-[#dce5df] bg-[#fbfcfb] px-3 text-sm text-[#34463d] outline-none ring-[#a7d0c2] placeholder:text-[#aab3ad] focus:ring-2" /><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowCreate(false)} className="h-9 border-[#dce5df] text-xs text-[#607067]">Cancel</Button><Button onClick={createForm} className="h-9 bg-[#236f62] text-xs hover:bg-[#1b5c51]">Create form <ArrowUpRight className="ml-1 size-3.5" /></Button></div></div></div>}
    </main>
  );
}
