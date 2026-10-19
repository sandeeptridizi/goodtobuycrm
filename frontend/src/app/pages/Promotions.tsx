import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Phone, Ruler, User, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { usePromotions } from "../../hooks/usePromotions";
import { useWorkers } from "../../hooks/useWorkers";
import { toast } from "sonner";

const STATUS_OPTIONS = ["All", "New", "Contacted", "Interested", "Not Interested", "Converted"];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-gradient-to-r from-blue-400 to-blue-500 text-white",
  Contacted: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
  Interested: "bg-gradient-to-r from-green-400 to-green-500 text-white",
  "Not Interested": "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
  Converted: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
};

export default function Promotions() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");
  const [workerFilter, setWorkerFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: promotions, loading, error, updateStatus, remove } = usePromotions(
    statusFilter === "All" ? undefined : statusFilter
  );
  const { data: workers } = useWorkers();

  const filtered = useMemo(
    () =>
      promotions.filter(
        (p) =>
          (workerFilter === "All" || p.worker_id === workerFilter) &&
          (p.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.location_area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.phone?.includes(searchTerm))
      ),
    [promotions, searchTerm, workerFilter]
  );

  const countByWorker = useMemo(() => {
    const counts: Record<string, number> = {};
    promotions.forEach((p) => {
      if (p.worker_id) counts[p.worker_id] = (counts[p.worker_id] || 0) + 1;
    });
    return counts;
  }, [promotions]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);
      toast.success("Status updated");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string, propertyName: string) => {
    if (!window.confirm(`Delete the lead for ${propertyName}? This cannot be undone.`)) {
      return;
    }
    try {
      await remove(id);
      toast.success("Promotion deleted");
    } catch (err) {
      console.error("Failed to delete promotion:", err);
      toast.error("Failed to delete promotion");
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent mb-2">Promotions</h1>
        <p className="text-slate-600">Property leads submitted by field workers</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search by property, location or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-lg shadow-[#00AEEF]/30"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#00AEEF]/40"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Select value={workerFilter} onValueChange={setWorkerFilter}>
          <SelectTrigger className="w-full md:w-56 bg-white/80 backdrop-blur-sm border-[#00AEEF]/20">
            <SelectValue placeholder="Filter by field worker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Field Workers</SelectItem>
            {workers.map((worker) => (
              <SelectItem key={worker.id} value={worker.id}>
                {worker.name} ({countByWorker[worker.id] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load promotions. Please refresh.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No promotions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((promo) => {
            const photos = promo.photo_urls?.length ? promo.photo_urls : promo.photo_url ? [promo.photo_url] : [];
            return (
            <Card key={promo.id} className="overflow-hidden border-[#00AEEF]/10 bg-white/80 backdrop-blur-sm">
              {photos.length > 0 && (
                <div className="relative">
                  {/* Swipe or scroll sideways through the photos; click one to open it full size. */}
                  <div className="flex overflow-x-auto snap-x snap-mandatory">
                    {photos.map((url, index) => (
                      <a key={index} href={url} target="_blank" rel="noreferrer" className="w-full flex-shrink-0 snap-center">
                        <img src={url} alt={`${promo.property_name} ${index + 1}`} className="w-full h-40 object-cover" />
                      </a>
                    ))}
                  </div>
                  {photos.length > 1 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs pointer-events-none">
                      {photos.length} photos
                    </span>
                  )}
                </div>
              )}
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg text-[#004274]">{promo.property_name}</h3>
                    <p className="text-sm text-slate-500">
                      {promo.flat_type} {promo.flat_no ? `· Flat ${promo.flat_no}` : ""}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${STATUS_COLORS[promo.status] || STATUS_COLORS.New}`}>
                    {promo.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    {promo.square_feet ? `${promo.square_feet} sq.ft` : "N/A"} · {promo.furnishing_type}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    {promo.location_area || promo.address || "Not provided"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    {promo.phone}
                    {promo.alternate_phone ? ` / ${promo.alternate_phone}` : ""}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    Submitted by {promo.worker_name}
                  </div>
                </div>

                {promo.gps_lat && promo.gps_lng && (
                  <a
                    href={`https://www.google.com/maps?q=${promo.gps_lat},${promo.gps_lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm text-[#00AEEF] hover:underline"
                  >
                    View on map
                  </a>
                )}

                <div className="pt-2 border-t border-[#00AEEF]/10 flex items-center gap-2">
                  <Select value={promo.status} onValueChange={(value) => handleStatusChange(promo.id, value)}>
                    <SelectTrigger className="mt-1 flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.filter((s) => s !== "All").map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="mt-1 flex-shrink-0"
                    onClick={() => navigate(`/promotions/${promo.id}/edit`)}
                    aria-label="Edit promotion"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="mt-1 flex-shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(promo.id, promo.property_name)}
                    aria-label="Delete promotion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
