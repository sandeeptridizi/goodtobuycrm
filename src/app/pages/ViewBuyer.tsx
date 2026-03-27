import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mail, Phone, User, DollarSign, MapPin, Home, Bed, Bath, Building, ChevronLeft, ChevronRight, Square, Calendar, Car } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Mock buyers data with detailed requirements
const buyers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    budget: { min: 60000000, max: 80000000 },
    propertyTypes: ["Villa", "House"],
    minBedrooms: 3,
    maxBedrooms: 5,
    minBathrooms: 2,
    maxBathrooms: 4,
    minArea: 2500,
    preferredLocations: ["Mumbai", "Bandra", "Worli"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    status: "Active",
    leadSource: "Website",
    assignedAgent: "Priya Sharma",
    notes: "Looking for a family home with good schools nearby. Prefers modern architecture and open floor plans.",
    timeline: "3-6 months",
    financing: "Pre-approved",
    amenitiesRequired: ["Parking", "Garden", "Security"],
    registrationDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 98234 56789",
    budget: { min: 40000000, max: 55000000 },
    propertyTypes: ["Apartment", "Condo"],
    minBedrooms: 2,
    maxBedrooms: 3,
    minBathrooms: 2,
    maxBathrooms: 2,
    minArea: 1500,
    preferredLocations: ["Mumbai", "Andheri", "Powai"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    status: "Active",
    leadSource: "Referral",
    assignedAgent: "Amit Singh",
    notes: "First-time buyer looking for a move-in ready apartment in a good locality.",
    timeline: "1-3 months",
    financing: "Pre-approved",
    amenitiesRequired: ["Gym", "Elevator", "Security"],
    registrationDate: "2024-02-10",
  },
  {
    id: 3,
    name: "Arjun Reddy",
    email: "arjun.reddy@email.com",
    phone: "+91 97654 32109",
    budget: { min: 120000000, max: 150000000 },
    propertyTypes: ["Penthouse", "Villa"],
    minBedrooms: 4,
    maxBedrooms: 6,
    minBathrooms: 3,
    maxBathrooms: 5,
    minArea: 4000,
    preferredLocations: ["Mumbai", "Worli Sea Face"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    status: "Qualified",
    leadSource: "Walk-in",
    assignedAgent: "Priya Sharma",
    notes: "High-net-worth buyer looking for luxury property with sea views.",
    timeline: "6-12 months",
    financing: "Cash buyer",
    amenitiesRequired: ["Pool", "Gym", "Security", "Smart Home"],
    registrationDate: "2024-01-05",
  },
];

// Properties data for matching
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Bandra West",
    address: "15th Road, Bandra West",
    city: "Mumbai",
    country: "India",
    price: "₹6,50,00,000",
    type: "Villa",
    status: "Available",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    yearBuilt: 2020,
    carParking: 2,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    matchScore: 95,
  },
  {
    id: 2,
    title: "Modern Apartment in Powai",
    address: "Hiranandani Gardens, Powai",
    city: "Mumbai",
    country: "India",
    price: "₹48,00,000",
    type: "Apartment",
    status: "Available",
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    yearBuilt: 2019,
    carParking: 1,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    matchScore: 88,
  },
  {
    id: 3,
    title: "Spacious Family House in Bandra",
    address: "Linking Road, Bandra",
    city: "Mumbai",
    country: "India",
    price: "₹72,00,000",
    type: "House",
    status: "Available",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    yearBuilt: 2018,
    carParking: 2,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
    ],
    matchScore: 92,
  },
  {
    id: 4,
    title: "Contemporary Villa with Pool in Worli",
    address: "Worli Sea Face",
    city: "Mumbai",
    country: "India",
    price: "₹78,00,000",
    type: "Villa",
    status: "Available",
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    yearBuilt: 2021,
    carParking: 3,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    ],
    matchScore: 90,
  },
  {
    id: 5,
    title: "Modern House with Garden in Andheri",
    address: "Versova, Andheri West",
    city: "Mumbai",
    country: "India",
    price: "₹65,00,000",
    type: "House",
    status: "Available",
    bedrooms: 3,
    bathrooms: 2,
    area: 2600,
    yearBuilt: 2019,
    carParking: 2,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    ],
    matchScore: 87,
  },
];

// Function to find matching properties for a buyer
const findMatchingProperties = (buyer: any) => {
  return properties.filter(property => {
    const propertyPrice = parseInt(property.price.replace(/[₹,]/g, ''));
    
    const meetsPrice = propertyPrice >= buyer.budget.min && propertyPrice <= buyer.budget.max;
    const meetsType = buyer.propertyTypes.includes(property.type);
    const meetsBedrooms = property.bedrooms >= buyer.minBedrooms && property.bedrooms <= buyer.maxBedrooms;
    const meetsBathrooms = property.bathrooms >= buyer.minBathrooms && property.bathrooms <= buyer.maxBathrooms;
    const meetsArea = property.area >= buyer.minArea;
    const meetsLocation = buyer.preferredLocations.some((loc: string) => 
      property.city.includes(loc) || property.address.includes(loc)
    );
    
    return meetsPrice && meetsType && meetsBedrooms && meetsBathrooms && meetsArea && meetsLocation;
  }).sort((a, b) => b.matchScore - a.matchScore);
};

export default function ViewBuyer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const buyer = buyers.find(b => b.id === Number(id));
  const [propertyScrollPosition, setPropertyScrollPosition] = useState(0);
  const propertyScrollRef = useRef<HTMLDivElement>(null);

  // Get matching properties
  const matchingProperties = buyer ? findMatchingProperties(buyer) : [];

  // Auto-scroll properties horizontally every 3 seconds
  useEffect(() => {
    if (!matchingProperties.length || !propertyScrollRef.current) return;

    const interval = setInterval(() => {
      if (propertyScrollRef.current) {
        const cardWidth = 360; // Width of each property card + gap
        const maxScroll = (matchingProperties.length - 3) * cardWidth;
        
        setPropertyScrollPosition((prev) => {
          const newPosition = prev + cardWidth;
          return newPosition > maxScroll ? 0 : newPosition;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [matchingProperties.length]);

  // Apply scroll position
  useEffect(() => {
    if (propertyScrollRef.current) {
      propertyScrollRef.current.scrollTo({
        left: propertyScrollPosition,
        behavior: 'smooth'
      });
    }
  }, [propertyScrollPosition]);

  if (!buyer) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Buyer Not Found</h1>
          <Button onClick={() => navigate("/buyers")}>Back to Buyers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/buyers")}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Buyers
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={buyer.avatar}
              alt={buyer.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{buyer.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={
                    buyer.status === "Active"
                      ? "bg-green-500"
                      : buyer.status === "Qualified"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }
                >
                  {buyer.status}
                </Badge>
                <Badge variant="secondary">{buyer.financing}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button className="gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{buyer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{buyer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Assigned Agent</p>
                  <p className="text-gray-900">{buyer.assignedAgent}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget & Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Budget & Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Budget Range</p>
                    <p className="text-gray-900 font-semibold">
                      ₹{(buyer.budget.min / 10000000).toFixed(1)}Cr - ₹{(buyer.budget.max / 10000000).toFixed(1)}Cr
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-gray-900 font-semibold">
                      {buyer.minBedrooms} - {buyer.maxBedrooms}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="text-gray-900 font-semibold">
                      {buyer.minBathrooms} - {buyer.maxBathrooms}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Square className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Min Area</p>
                    <p className="text-gray-900 font-semibold">{buyer.minArea.toLocaleString()} sq ft</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Property Types</p>
                <div className="flex flex-wrap gap-2">
                  {buyer.propertyTypes.map((type, index) => (
                    <Badge key={index} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Preferred Locations</p>
                <div className="flex flex-wrap gap-2">
                  {buyer.preferredLocations.map((location, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Required Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {buyer.amenitiesRequired.map((amenity, index) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{buyer.notes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Expected Timeline</p>
                  <p className="text-gray-900 font-semibold">{buyer.timeline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Lead Source</p>
                <p className="text-gray-900 font-semibold">{buyer.leadSource}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(buyer.registrationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Match Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Matching Properties</span>
                  <span className="text-2xl font-bold text-blue-600">{matchingProperties.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Avg Match Score</span>
                  <span className="text-lg font-semibold text-green-600">
                    {matchingProperties.length > 0
                      ? Math.round(matchingProperties.reduce((acc, p) => acc + p.matchScore, 0) / matchingProperties.length)
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Matching Properties Section - Full Width at Bottom */}
      {matchingProperties.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Matching Properties</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {matchingProperties.length} propert{matchingProperties.length > 1 ? 'ies' : 'y'} matching buyer requirements
                </p>
              </div>
              <Badge variant="secondary">{matchingProperties.length} Matches</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={propertyScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {matchingProperties.map((property) => (
                <Card 
                  key={property.id} 
                  className="flex-none w-[350px] hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 mt-1 text-gray-500">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">{property.city}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-500 ml-2">{property.matchScore}% Match</Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-2xl font-bold text-gray-900">{property.price}</span>
                        <Badge variant="outline">{property.status}</Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                        <div className="text-center">
                          <Bed className="w-4 h-4 mx-auto text-gray-400" />
                          <p className="text-xs text-gray-600 mt-1">{property.bedrooms} Bed</p>
                        </div>
                        <div className="text-center">
                          <Bath className="w-4 h-4 mx-auto text-gray-400" />
                          <p className="text-xs text-gray-600 mt-1">{property.bathrooms} Bath</p>
                        </div>
                        <div className="text-center">
                          <Square className="w-4 h-4 mx-auto text-gray-400" />
                          <p className="text-xs text-gray-600 mt-1">{property.area} sqft</p>
                        </div>
                        <div className="text-center">
                          <Car className="w-4 h-4 mx-auto text-gray-400" />
                          <p className="text-xs text-gray-600 mt-1">{property.carParking} Car</p>
                        </div>
                      </div>

                      <Button className="w-full mt-2" size="sm">
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