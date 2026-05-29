import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Home, Car, Droplet, Shield, Video, ExternalLink, ChevronLeft, ChevronRight, Mail, Phone, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useProperty, Property, useMatchingBuyers } from "../../hooks/useProperties";
import { Buyer } from "../../hooks/useBuyers";
import { formatPrice } from "../../hooks/useDashboard";

export default function ViewProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const propertyId = Number(id);
  const { data: property, loading: propertyLoading, error: propertyError } = useProperty(propertyId);
  const { data: matchingBuyers, loading: buyersLoading } = useMatchingBuyers(propertyId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!property || !property.images || property.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [property]);

  const handlePrevious = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
  };

  const handleNext = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
  };

  if (propertyLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Button onClick={() => navigate("/properties")}>Back to Properties</Button>
        </div>
      </div>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
  ];

  const images = property.images && property.images.length > 0 ? property.images : defaultImages;
  const mainImage = images[currentImageIndex];
  const thumbnailImages = images.slice(1, 5);

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

  const getBuyerStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white";
      case "Qualified":
        return "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white";
      case "Closed":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/properties")} className="gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin className="w-4 h-4 text-[#00AEEF]" />
              <span>{property.address}, {property.city}, {property.country} {property.zip_code}</span>
            </div>
          </div>
          <Badge className={getStatusColor(property.status)}>
            {property.status}
          </Badge>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <span className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">
            {formatPrice(property.price)}
          </span>
          <span className="text-lg text-gray-600 px-3 py-1 rounded-full bg-[#00AEEF]/10">{property.type}</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="p-2 space-y-2">
            <div className="relative">
              <img src={mainImage} alt={property.title} className="w-full object-cover rounded-lg h-96" />
              {images.length > 1 && (
                <>
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <Button variant="ghost" onClick={handlePrevious} className="p-2 bg-white/80 hover:bg-white">
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" onClick={handleNext} className="p-2 bg-white/80 hover:bg-white">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {thumbnailImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {thumbnailImages.map((image, index) => (
                  <div key={index} className="h-32">
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{property.description || 'No description available.'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-start gap-3">
                    <Bed className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-start gap-3">
                    <Bath className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.area > 0 && (
                  <div className="flex items-start gap-3">
                    <Square className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Built-up Area</p>
                      <p className="font-semibold text-gray-900">{property.area} sq ft</p>
                    </div>
                  </div>
                )}
                {property.land_area > 0 && (
                  <div className="flex items-start gap-3">
                    <Square className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Land Area</p>
                      <p className="font-semibold text-gray-900">{property.land_area} sq ft</p>
                    </div>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Year Built</p>
                      <p className="font-semibold text-gray-900">{property.year_built}</p>
                    </div>
                  </div>
                )}
                {property.floors > 0 && (
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Total Floors</p>
                      <p className="font-semibold text-gray-900">{property.floors}</p>
                    </div>
                  </div>
                )}
                {property.car_parking > 0 && (
                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Car Parking</p>
                      <p className="font-semibold text-gray-900">{property.car_parking} spaces</p>
                    </div>
                  </div>
                )}
                {property.facing && (
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Facing</p>
                      <p className="font-semibold text-gray-900">{property.facing}</p>
                    </div>
                  </div>
                )}
                {property.water_source && (
                  <div className="flex items-start gap-3">
                    <Droplet className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Water Source</p>
                      <p className="font-semibold text-gray-900">{property.water_source}</p>
                    </div>
                  </div>
                )}
                {property.boundary_wall && (
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#00AEEF] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Boundary</p>
                      <p className="font-semibold text-gray-900">{property.boundary_wall}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 bg-[#00AEEF]/10 text-[#004274]">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(property.youtube_url || property.instagram_url) && (
            <Card>
              <CardHeader>
                <CardTitle>Video Tours & Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.youtube_url && (
                    <a href={property.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Video className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">YouTube Video Tour</p>
                        <p className="text-sm text-gray-500">Watch property walkthrough</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  {property.instagram_url && (
                    <a href={property.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-5 h-5 text-pink-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Instagram Post</p>
                        <p className="text-sm text-gray-500">View on Instagram</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Listed By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0096d1] flex items-center justify-center shadow-md">
                  <span className="text-white text-xl font-bold">GTB</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">GoodToBuy Team</h3>
                  <p className="text-sm text-gray-600">Property Agent</p>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-blue-100">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">contact@goodtobuy.in</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    Listed on {new Date(property.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-3 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:opacity-90">
                <Phone className="w-4 h-4 mr-2" />
                Contact Agent
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interested in this property?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1]">Schedule a Viewing</Button>
              <Button variant="outline" className="w-full">Request More Info</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {matchingBuyers.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Matching Buyers</CardTitle>
                  <Sparkles className="w-4 h-4 text-[#00AEEF]" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {matchingBuyers.length} buyer{matchingBuyers.length > 1 ? 's' : ''} interested in properties like this
                </p>
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white">{matchingBuyers.length} Matches</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {matchingBuyers.map((buyer: Buyer & { matchScore?: number }) => (
                <Card key={buyer.id} className="flex-none w-80 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0096d1] flex items-center justify-center">
                          <span className="text-white font-bold">
                            {buyer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{buyer.name}</p>
                          <Badge className={`text-xs ${getBuyerStatusColor(buyer.status)}`}>{buyer.status}</Badge>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white">{buyer.matchScore || 0}% Match</Badge>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 truncate">{buyer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{buyer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          Budget: {formatPrice(buyer.budget_min)} - {formatPrice(buyer.budget_max)}
                        </span>
                      </div>
                      {buyer.min_bedrooms > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Bed className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">
                            {buyer.min_bedrooms}+ Bed, {buyer.min_bathrooms}+ Bath
                          </span>
                        </div>
                      )}
                    </div>
                    {buyer.property_types && buyer.property_types.length > 0 && (
                      <div className="pt-2">
                        <div className="flex flex-wrap gap-1">
                          {buyer.property_types.slice(0, 2).map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-[#00AEEF]/10 text-[#004274]">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button className="w-full mt-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1]" onClick={() => navigate(`/buyers/${buyer.id}`)}>
                      View Buyer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
