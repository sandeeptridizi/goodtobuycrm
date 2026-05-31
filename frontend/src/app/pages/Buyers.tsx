import { useState } from "react";
import { Plus, Search, Phone, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { useBuyers, Buyer } from "../../hooks/useBuyers";
import { formatPrice } from "../../hooks/useDashboard";

export default function Buyers() {
  const { data: buyers, loading, error } = useBuyers();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredBuyers = buyers.filter(
    (buyer: Buyer) =>
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm";
      case "Qualified":
        return "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-sm";
      case "Closed":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Buyers</h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </span>
          </div>
          <p className="text-slate-600">Manage your buyer database with intelligent insights</p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#00AEEF] shadow-lg shadow-[#00AEEF]/30 transition-all"
          onClick={() => navigate("/buyers/create")}
        >
          <Plus className="w-4 h-4" />
          Add Buyer
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search buyers with AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="flex items-center gap-8">
                  <div className="w-11 h-11 rounded-full bg-gray-200"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load buyers. Please refresh.</p>
        </div>
      ) : filteredBuyers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No buyers found. Add your first buyer!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBuyers.map((buyer: Buyer) => (
            <Card
              key={buyer.id}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate(`/buyers/${buyer.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3 w-64">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0096d1] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00AEEF]/30">
                      <span className="text-white font-semibold text-sm">
                        {buyer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#004274] truncate">{buyer.name}</h3>
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mt-1 ${getStatusColor(buyer.status)}`}>
                        {buyer.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 w-48">
                    <Phone className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    <span>{buyer.phone}</span>
                  </div>

                  <div className="w-52">
                    <span className="text-xs text-slate-500 font-medium">Budget</span>
                    <p className="text-sm font-semibold text-[#004274] truncate">
                      {buyer.budget_min ? `${formatPrice(buyer.budget_min)} - ${formatPrice(buyer.budget_max)}` : 'Not set'}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Preferences</p>
                    <p className="text-sm font-semibold text-[#004274] truncate">
                      {buyer.property_types?.slice(0, 2).join(", ") || 'Any property type'}
                    </p>
                  </div>

                  <div className="w-40">
                    <span className="text-xs text-slate-500 font-medium">Lead Source</span>
                    <p className="text-sm font-semibold text-[#004274]">{buyer.lead_source || 'Direct'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
