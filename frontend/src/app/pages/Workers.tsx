import { useState } from "react";
import { Search, Mail as MailIcon, Phone, HardHat, Pencil, Building2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useWorkers, Worker } from "../../hooks/useWorkers";
import { usePromotions } from "../../hooks/usePromotions";

export default function Workers() {
  const { data: workers, loading, error } = useWorkers();
  const { data: promotions } = usePromotions();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const metricsByWorker = (workerId: string) => {
    const listed = promotions.filter((p) => p.worker_id === workerId);
    const paid = listed.filter((p) => p.is_paid).length;
    return { listed: listed.length, paid, unpaid: listed.length - paid };
  };

  const filteredWorkers = workers.filter(
    (worker: Worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm";
      case "Inactive":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent mb-2">Field Workers</h1>
          <p className="text-slate-600">Create logins for field workers who submit property leads</p>
        </div>
        <Button
          onClick={() => navigate('/workers/create')}
          className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#00AEEF] shadow-lg shadow-[#00AEEF]/30 transition-all"
        >
          <span className="text-lg">+</span>
          Add Worker
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search field workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load field workers. Please refresh.</p>
        </div>
      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No field workers yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkers.map((worker: Worker) => {
            const metrics = metricsByWorker(worker.id);
            return (
              <Card
                key={worker.id}
                className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 bg-white/80 backdrop-blur-sm"
                onClick={() => navigate(`/workers/${worker.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00AEEF] to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00AEEF]/30">
                      <HardHat className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#004274]">{worker.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(worker.status)}`}>
                        {worker.status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-[#00AEEF]"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workers/${worker.id}/edit`);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MailIcon className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                      {worker.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                      {worker.phone || 'Not provided'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700">
                      <Building2 className="w-3 h-3" />
                      {metrics.listed} Listed
                    </Badge>
                    <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white">
                      {metrics.paid} Paid
                    </Badge>
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white">
                      {metrics.unpaid} Unpaid
                    </Badge>
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
