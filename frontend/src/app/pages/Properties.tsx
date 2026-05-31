import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, MapPin, Bed, Bath, Square, Sparkles, X, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useProperties, Property } from "../../hooks/useProperties";
import { formatPrice } from "../../hooks/useDashboard";

export default function Properties() {
  const { data: properties, loading, error } = useProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    status: [] as string[],
    type: [] as string[],
    bedrooms: [] as number[],
    priceRange: [0, 1000000000] as [number, number],
  });

  const statusOptions = ["Available", "Pending", "Sold"];
  const typeOptions = ["house", "apartment", "villa", "penthouse", "commercial", "land"];
  const bedroomOptions = [1, 2, 3, 4, 5];

  const toggleFilter = (category: "status" | "type" | "bedrooms", value: string | number) => {
    setFilters((prev) => {
      const current = prev[category] as (string | number)[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      type: [],
      bedrooms: [],
      priceRange: [0, 1000000000],
    });
  };

  const activeFilterCount = filters.status.length + filters.type.length + filters.bedrooms.length;

  const filteredProperties = properties.filter((property: Property) => {
    // Search filter
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filters.status.length === 0 || filters.status.includes(property.status);

    // Type filter
    const matchesType = filters.type.length === 0 || filters.type.includes(property.type);

    // Bedrooms filter
    const matchesBedrooms = filters.bedrooms.length === 0 || filters.bedrooms.includes(property.bedrooms);

    // Price filter
    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];

    return matchesSearch && matchesStatus && matchesType && matchesBedrooms && matchesPrice;
  });

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
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`gap-2 border-[#00AEEF]/20 hover:border-[#00AEEF] hover:bg-[#00AEEF]/10 ${
                activeFilterCount > 0 ? "bg-[#00AEEF]/10 text-[#00AEEF]" : "text-slate-600"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 justify-center items-center rounded-full bg-[#00AEEF] text-white text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#00AEEF]" />
                  Filter Properties
                </span>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    Reset All
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* Status Filter */}
              <div>
                <Label className="text-base font-semibold text-slate-800 mb-3 block">Status</Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleFilter("status", status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.status.includes(status)
                          ? status === "Available"
                            ? "bg-green-500 text-white"
                            : status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type Filter */}
              <div>
                <Label className="text-base font-semibold text-slate-800 mb-3 block">Property Type</Label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleFilter("type", type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                        filters.type.includes(type)
                          ? "bg-[#00AEEF] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <Label className="text-base font-semibold text-slate-800 mb-3 block">Bedrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {bedroomOptions.map((bed) => (
                    <button
                      key={bed}
                      onClick={() => toggleFilter("bedrooms", bed)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.bedrooms.includes(bed)
                          ? "bg-[#00AEEF] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    >
                      {bed}+ Beds
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <Label className="text-base font-semibold text-slate-800 mb-3 block">
                  Price Range
                </Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                    min={0}
                    max={1000000000}
                    step={1000000}
                    className="mt-4"
                  />
                  <div className="flex justify-between mt-2 text-sm text-slate-600">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{filters.priceRange[1] >= 1000000000 ? "₹100 Cr+" : formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsFilterOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setIsFilterOpen(false)} className="flex-1 bg-gradient-to-r from-[#00AEEF] to-[#0096d1]">
                Apply Filters ({filteredProperties.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-slate-500">Active filters:</span>
          {filters.status.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="gap-1 px-2 py-1 cursor-pointer hover:bg-slate-200"
              onClick={() => toggleFilter("status", status)}
            >
              {status}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {filters.type.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="gap-1 px-2 py-1 capitalize cursor-pointer hover:bg-slate-200"
              onClick={() => toggleFilter("type", type)}
            >
              {type}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {filters.bedrooms.map((bed) => (
            <Badge
              key={bed}
              variant="secondary"
              className="gap-1 px-2 py-1 cursor-pointer hover:bg-slate-200"
              onClick={() => toggleFilter("bedrooms", bed)}
            >
              {bed}+ Beds
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}

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
          <p className="text-slate-400">No properties found. Try adjusting your filters.</p>
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
                  <span className="text-sm text-slate-500 font-semibold px-3 py-1 rounded-full bg-[#00AEEF]/10 capitalize">
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