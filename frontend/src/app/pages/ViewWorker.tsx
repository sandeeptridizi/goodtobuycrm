import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, HardHat, Pencil, Building2, CheckCircle2, XCircle, Clock, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { useWorker } from "../../hooks/useWorkers";
import { usePromotions, Promotion } from "../../hooks/usePromotions";
import { formatPrice } from "../../hooks/useDashboard";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-gradient-to-r from-blue-400 to-blue-500 text-white",
  Contacted: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
  Interested: "bg-gradient-to-r from-green-400 to-green-500 text-white",
  "Not Interested": "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
  Converted: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
};

function isVerified(status: string): boolean {
  return status === "Interested" || status === "Converted";
}

function isRejected(status: string): boolean {
  return status === "Not Interested";
}

function getWeekStart(dateStr: string): Date {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 = Sunday ... 6 = Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const yearOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${monday.toLocaleDateString("en-IN", opts)} – ${sunday.toLocaleDateString("en-IN", yearOpts)}`;
}

interface WeeklyRow {
  weekKey: number;
  label: string;
  listed: number;
  verified: number;
  rejected: number;
  paid: number;
}

function buildWeeklyRows(leads: Promotion[]): WeeklyRow[] {
  const buckets = new Map<number, WeeklyRow>();

  leads.forEach((lead) => {
    const monday = getWeekStart(lead.created_at);
    const weekKey = monday.getTime();
    if (!buckets.has(weekKey)) {
      buckets.set(weekKey, { weekKey, label: formatWeekRange(monday), listed: 0, verified: 0, rejected: 0, paid: 0 });
    }
    const row = buckets.get(weekKey)!;
    row.listed += 1;
    if (isVerified(lead.status)) row.verified += 1;
    if (isRejected(lead.status)) row.rejected += 1;
    if (lead.is_paid) row.paid += 1;
  });

  return Array.from(buckets.values()).sort((a, b) => b.weekKey - a.weekKey);
}

export default function ViewWorker() {
  const navigate = useNavigate();
  const { id } = useParams();
  const workerId = String(id);
  const { data: worker, loading: workerLoading, error: workerError } = useWorker(workerId);
  const { data: promotions, loading: promotionsLoading, update } = usePromotions();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [commissionDrafts, setCommissionDrafts] = useState<Record<string, string>>({});

  const workerLeads = promotions.filter((p) => p.worker_id === workerId);
  const verifiedLeads = workerLeads.filter((p) => isVerified(p.status));
  const rejectedLeads = workerLeads.filter((p) => isRejected(p.status));
  const paidLeads = workerLeads.filter((p) => p.is_paid);
  const unpaidLeads = workerLeads.filter((p) => !p.is_paid);
  const totalCommission = workerLeads.reduce((sum, p) => sum + (p.commission_amount || 0), 0);
  const paidAmount = paidLeads.reduce((sum, p) => sum + (p.commission_amount || 0), 0);
  const unpaidAmount = unpaidLeads.reduce((sum, p) => sum + (p.commission_amount || 0), 0);
  const weeklyRows = buildWeeklyRows(workerLeads);

  const getWorkerStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white";
      case "Inactive":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  const handleCommissionChange = (id: string, value: string) => {
    setCommissionDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommissionSave = async (lead: Promotion) => {
    const draft = commissionDrafts[lead.id];
    if (draft === undefined) return;
    const amount = parseFloat(draft.replace(/[^0-9.]/g, "")) || 0;
    if (amount === lead.commission_amount) return;
    setSavingId(lead.id);
    try {
      await update(lead.id, { commission_amount: amount });
      toast.success("Commission updated");
    } catch (err) {
      console.error("Failed to update commission:", err);
      toast.error("Failed to update commission");
    } finally {
      setSavingId(null);
    }
  };

  const handleTogglePaid = async (lead: Promotion) => {
    setSavingId(lead.id);
    try {
      const nextPaid = !lead.is_paid;
      await update(lead.id, {
        is_paid: nextPaid,
        paid_at: nextPaid ? new Date().toISOString() : null,
      });
      toast.success(nextPaid ? "Marked as paid" : "Marked as unpaid");
    } catch (err) {
      console.error("Failed to update payment status:", err);
      toast.error("Failed to update payment status");
    } finally {
      setSavingId(null);
    }
  };

  if (workerLoading || promotionsLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading field worker...</p>
        </div>
      </div>
    );
  }

  if (workerError || !worker) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Field Worker Not Found</h1>
          <Button onClick={() => navigate("/workers")}>Back to Field Workers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/workers")} className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Field Workers
          </Button>
          <Button variant="outline" onClick={() => navigate(`/workers/${workerId}/edit`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00AEEF] to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00AEEF]/30">
            <HardHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{worker.name}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <Badge className={getWorkerStatusColor(worker.status)}>{worker.status}</Badge>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-[#00AEEF]" />
                {worker.email}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#00AEEF]" />
                {worker.phone || "Not provided"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Card className="border-slate-100">
          <CardContent className="p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">Listed</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{workerLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100">
          <CardContent className="p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">Verified</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{verifiedLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100">
          <CardContent className="p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">Rejected</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{rejectedLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100">
          <CardContent className="p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">Paid</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{paidLeads.length}</p>
              <p className="text-[11px] text-gray-400 truncate">{formatPrice(paidAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100">
          <CardContent className="p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">Unpaid</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{unpaidLeads.length}</p>
              <p className="text-[11px] text-gray-400 truncate">{formatPrice(unpaidAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100">
          <CardContent className="p-3.5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">Commission</p>
              <p className="text-lg font-bold text-gray-900 leading-tight truncate">{formatPrice(totalCommission)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="listed">
            <TabsList>
              <TabsTrigger value="listed">Listed Properties</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
            </TabsList>

            <TabsContent value="listed">
              {workerLeads.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No properties submitted by this worker yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="pb-2 pr-4">Property</th>
                        <th className="pb-2 pr-4">Location</th>
                        <th className="pb-2 pr-4">Status</th>
                        <th className="pb-2 pr-4">Commission</th>
                        <th className="pb-2 pr-4">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workerLeads.map((lead) => (
                        <tr key={lead.id} className="border-b border-gray-50">
                          <td className="py-1.5 pr-4 font-medium text-gray-900">{lead.property_name}</td>
                          <td className="py-1.5 pr-4 text-gray-700">{lead.location_area || lead.address || "Not provided"}</td>
                          <td className="py-1.5 pr-4">
                            <Badge className={STATUS_COLORS[lead.status] || STATUS_COLORS.New}>{lead.status}</Badge>
                          </td>
                          <td className="py-1.5 pr-4">
                            <Input
                              value={commissionDrafts[lead.id] ?? String(lead.commission_amount || 0)}
                              onChange={(e) => handleCommissionChange(lead.id, e.target.value)}
                              onBlur={() => handleCommissionSave(lead)}
                              disabled={savingId === lead.id}
                              className="w-28 h-7"
                            />
                          </td>
                          <td className="py-1.5 pr-4">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={savingId === lead.id}
                              onClick={() => handleTogglePaid(lead)}
                              className={`h-7 ${lead.is_paid ? "text-green-700 border-green-200" : "text-amber-700 border-amber-200"}`}
                            >
                              {lead.is_paid ? "Paid" : "Unpaid"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="weekly">
              <p className="text-sm text-gray-500 mb-3">Monday to Sunday, based on when each property was listed</p>
              {weeklyRows.length === 0 ? (
                <p className="text-center text-slate-400 py-8">No weekly data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="pb-2 pr-4">Week</th>
                        <th className="pb-2 pr-4">Listed</th>
                        <th className="pb-2 pr-4">Verified</th>
                        <th className="pb-2 pr-4">Rejected</th>
                        <th className="pb-2 pr-4">Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyRows.map((row) => (
                        <tr key={row.weekKey} className="border-b border-gray-50">
                          <td className="py-1.5 pr-4 font-medium text-gray-900">{row.label}</td>
                          <td className="py-1.5 pr-4 text-gray-700">{row.listed}</td>
                          <td className="py-1.5 pr-4">
                            <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white">{row.verified}</Badge>
                          </td>
                          <td className="py-1.5 pr-4">
                            <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white">{row.rejected}</Badge>
                          </td>
                          <td className="py-1.5 pr-4">
                            <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">{row.paid}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
