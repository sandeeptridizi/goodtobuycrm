import { useState } from "react";
import { Plus, Search, Mail as MailIcon, Phone, MapPin, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { useSellers, Seller } from "../../hooks/useSellers";

export default function Sellers() {
  const { data: sellers, loading, error } = useSellers();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredSellers = sellers.filter(
    (seller: Seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Sellers</h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </span>
          </div>
          <p className="text-slate-600">Manage your seller clients with intelligent insights</p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#00AEEF] shadow-lg shadow-[#00AEEF]/30 transition-all"
          onClick={() => navigate("/sellers/create")}
        >
          <Plus className="w-4 h-4" />
          Add Seller
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search sellers with AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load sellers. Please refresh.</p>
        </div>
      ) : filteredSellers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No sellers found. Add your first seller!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSellers.map((seller: Seller) => (
            <Card
              key={seller.id}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate(`/sellers/${seller.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {seller.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#004274]">{seller.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(seller.status)}`}>
                        {seller.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MailIcon className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    {seller.email || 'Not provided'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    {seller.phone}
                  </div>

                  <div className="pt-3 border-t border-[#00AEEF]/10">
                    {seller.address && (
                      <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                        {seller.address}
                      </div>
                    )}
                    {seller.selling_reason && (
                      <div className="mb-2">
                        <p className="text-xs text-slate-500">Reason for selling</p>
                        <p className="text-sm font-medium text-[#004274]">{seller.selling_reason}</p>
                      </div>
                    )}
                    {seller.timeline && (
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">Timeline</p>
                        <p className="text-sm font-semibold text-[#004274]">{seller.timeline}</p>
                      </div>
                    )}
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