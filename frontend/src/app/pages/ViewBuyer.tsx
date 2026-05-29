import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, User, DollarSign, MapPin, Home, Bed, Bath, Building, Square, Calendar, Car, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useBuyer, Buyer } from "../../hooks/useBuyers";
import { Property, useMatchingProperties } from "../../hooks/useProperties";
import { formatPrice } from "../../hooks/useDashboard";

export default function ViewBuyer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const buyerId = Number(id);
  const { data: buyer, loading, error } = useBuyer(buyerId);
  const { data: matchingProperties } = useMatchingProperties(buyerId);

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading buyer...</p>
        </div>
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Buyer Not Found</h1>
          <Button onClick={() => navigate("/buyers")}>Back to Buyers</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
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

  const getPropertyStatusColor = (status: string) => {
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

  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/buyers")} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Buyers
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0096d1] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {buyer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{buyer.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(buyer.status)}>{buyer.status}</Badge>
                {buyer.financing && <Badge variant="secondary">{buyer.financing}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1]">
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{buyer.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{buyer.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget & Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Budget Range</p>
                    <p className="text-gray-900 font-semibold">
                      {buyer.budget_min ? `${formatPrice(buyer.budget_min)} - ${formatPrice(buyer.budget_max)}` : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-gray-900 font-semibold">
                      {buyer.min_bedrooms} - {buyer.max_bedrooms}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="text-gray-900 font-semibold">
                      {buyer.min_bathrooms} - {buyer.max_bathrooms}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Square className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Min Area</p>
                    <p className="text-gray-900 font-semibold">{buyer.min_area?.toLocaleString() || 0} sq ft</p>
                  </div>
                </div>
              </div>

              {buyer.property_types && buyer.property_types.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Property Types</p>
                  <div className="flex flex-wrap gap-2">
                    {buyer.property_types.map((type, index) => (
                      <Badge key={index} variant="secondary" className="bg-[#00AEEF]/10 text-[#004274]">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {buyer.preferred_locations && buyer.preferred_locations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Preferred Locations</p>
                  <div className="flex flex-wrap gap-2">
                    {buyer.preferred_locations.map((location, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        <MapPin className="w-3 h-3" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {buyer.amenities_required && buyer.amenities_required.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Required Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {buyer.amenities_required.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="bg-[#00AEEF]/10 text-[#004274]">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {buyer.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{buyer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Expected Timeline</p>
                  <p className="text-gray-900 font-semibold">{buyer.timeline || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Lead Source</p>
                <p className="text-gray-900 font-semibold">{buyer.lead_source || 'Direct'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="text-gray-900 font-semibold">
                  {buyer.created_at ? new Date(buyer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Matching Properties</p>
                  <span className="text-2xl font-bold text-[#004274]">{matchingProperties?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Avg Match Score</p>
                  <span className="text-lg font-semibold text-green-600">
                    {matchingProperties && matchingProperties.length > 0
                      ? Math.round(matchingProperties.reduce((acc, p) => acc + (p.matchScore || 0), 0) / matchingProperties.length)
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {matchingProperties && matchingProperties.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Matching Properties</CardTitle>
                  <Sparkles className="w-4 h-4 text-[#00AEEF]" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {matchingProperties.length} propert{matchingProperties.length > 1 ? 'ies' : 'y'} matching buyer requirements
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white">{matchingProperties.length} Matches</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {matchingProperties.map((property: Property & { matchScore?: number }) => (
                <Card
                  key={property.id}
                  className="flex-none w-[350px] hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={property.images?.[0] || defaultImage}
                        alt={property.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className={`absolute top-3 right-3 ${getPropertyStatusColor(property.status)}`}>
                        {property.status}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{property.title}</h3>
                          <div className="flex items-center gap-1 mt-1 text-gray-500">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{property.city}</span>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white ml-2">
                          {property.matchScore || 0}% Match
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <p className="text-2xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">
                          {formatPrice(property.price)}
                        </p>
                        <Badge variant="outline">{property.type}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                        {property.bedrooms > 0 && (
                          <div className="text-center">
                            <Bed className="w-4 h-4 mx-auto text-[#00AEEF]" />
                            <p className="text-xs text-gray-600 mt-1">{property.bedrooms} Bed</p>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="text-center">
                            <Bath className="w-4 h-4 mx-auto text-[#00AEEF]" />
                            <p className="text-xs text-gray-600 mt-1">{property.bathrooms} Bath</p>
                          </div>
                        )}
                        {property.area > 0 && (
                          <div className="text-center">
                            <Square className="w-4 h-4 mx-auto text-[#00AEEF]" />
                            <p className="text-xs text-gray-600 mt-1">{property.area} sqft</p>
                          </div>
                        )}
                      </div>

                      <Button className="w-full mt-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1]" size="sm">
                        View Property
                      </Button>
                    </div>
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
