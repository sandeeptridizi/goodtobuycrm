import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Search, Filter, MapPin, Bed, Bath, Square, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

const properties = [
  {
    id: 1,
    title: "Luxury Villa in Bandra West",
    address: "15th Road, Bandra West, Mumbai",
    price: "₹6,50,00,000",
    type: "Villa",
    status: "Available",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
  },
  {
    id: 2,
    title: "Modern Apartment in Koramangala",
    address: "80 Feet Road, Koramangala, Bangalore",
    price: "₹45,00,000",
    type: "Apartment",
    status: "Available",
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
  },
  {
    id: 3,
    title: "Beach House in Goa",
    address: "Candolim Beach Road, North Goa",
    price: "₹1,20,00,000",
    type: "House",
    status: "Sold",
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
  },
  {
    id: 4,
    title: "Penthouse Suite in Worli",
    address: "Worli Sea Face, Mumbai",
    price: "₹2,10,00,000",
    type: "Penthouse",
    status: "Available",
    bedrooms: 4,
    bathrooms: 4,
    area: 5000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
  },
  {
    id: 5,
    title: "Villa in Jubilee Hills",
    address: "Road No. 45, Jubilee Hills, Hyderabad",
    price: "₹85,00,000",
    type: "Villa",
    status: "Pending",
    bedrooms: 4,
    bathrooms: 3,
    area: 3800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  },
  {
    id: 6,
    title: "Studio Apartment in Indiranagar",
    address: "100 Feet Road, Indiranagar, Bangalore",
    price: "₹35,00,000",
    type: "Apartment",
    status: "Available",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
  },
];

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card 
            key={property.id} 
            className="overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer border-[#00AEEF]/10 hover:border-[#00AEEF]/30 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <div className="relative h-48 overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              <span
                className={`absolute top-4 right-4 px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm ${
                  property.status === "Available"
                    ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                    : property.status === "Sold"
                    ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                    : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                }`}
              >
                {property.status}
              </span>
            </div>
            <CardContent className="p-5">
              <h3 className="font-bold text-lg text-[#004274] mb-1">{property.title}</h3>
              <div className="flex items-center gap-1 text-slate-600 text-sm mb-4">
                <MapPin className="w-4 h-4 text-[#00AEEF]" />
                {property.address}
              </div>
              <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-[#00AEEF]" />
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4 text-[#00AEEF]" />
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4 text-[#00AEEF]" />
                  <span className="font-medium">{property.area} sq ft</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#00AEEF]/10">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">{property.price}</span>
                <span className="text-sm text-slate-500 font-semibold px-3 py-1 rounded-full bg-[#00AEEF]/10">{property.type}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}