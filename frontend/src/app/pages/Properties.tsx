import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, MapPin, Bed, Bath, Square, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { useProperties, Property } from "../../hooks/useProperties";
import { formatPrice } from "../../hooks/useDashboard";

export default function Properties() {
  const { data: properties, loading, error } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredProperties = properties.filter(
    (property: Property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white";
      case "Sold":
        return "bg-gradient-to-r from-red-400 to-red-500 text-white";
      case "Pending":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400";

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Properties</h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </span>
          </div>
          <p className="text-slate-600">Manage all your property listings with intelligent insights</p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#00AEEF] shadow-lg shadow-[#00AEEF]/30 transition-all"
          onClick={() => navigate("/properties/create")}
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search properties with AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
        <Button variant="outline" className="gap-2 border-[#00AEEF]/20 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5">
          <Filter className="w-4 h-4 text-[#00AEEF]" />
          Filters
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-5">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load properties. Please refresh.</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No properties found. Add your first property!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property: Property) => (
            <Card
              key={property.id}
              className="overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer border-[#00AEEF]/10 hover:border-[#00AEEF]/30 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate(`/properties/${property.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.images?.[0] || defaultImage}
                  alt={property.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <span className={`absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg text-[#004274] mb-1">{property.title}</h3>
                <div className="flex items-center gap-1 text-slate-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-[#00AEEF]" />
                  {property.address}, {property.city}
                </div>
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-[#00AEEF]" />
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-[#00AEEF]" />
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  )}
                  {property.area > 0 && (
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4 text-[#00AEEF]" />
                      <span className="font-medium">{property.area} sq ft</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#00AEEF]/10">
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">
                    {formatPrice(property.price)}
                  </span>
                  <span className="text-sm text-slate-500 font-semibold px-3 py-1 rounded-full bg-[#00AEEF]/10">
                    {property.type}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
