import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Home, Car, Droplet, Shield, Video, ExternalLink, ChevronLeft, ChevronRight, Mail, Phone, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
 
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Bandra West",
    description: "A stunning modern villa featuring contemporary architecture, spacious living areas, and premium finishes throughout. This property offers the perfect blend of luxury and comfort with high ceilings, large windows, and an open floor plan that creates a bright and airy atmosphere. Located in the heart of Bandra West, Mumbai.",
    address: "15th Road, Bandra West",
    city: "Mumbai",
    country: "India",
    zipCode: "400050",
    price: "₹6,50,00,000",
    type: "Villa",
    status: "Available",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    landArea: 4500,
    yearBuilt: 2020,
    buildingAge: 4,
    floors: 2,
    carParking: 2,
    parkingSize: 200,
    facing: "South",
    waterSource: "Municipal + Borewell",
    drainType: "Public Drainage",
    boundary: "Walled",
    rentalIncome: "₹1,20,000/month",
    amenities: [
      "Air Conditioning",
      "Heating",
      "Swimming Pool",
      "Gym/Fitness Center",
      "24/7 Security",
      "CCTV Surveillance",
      "Power Backup",
      "Lift/Elevator",
      "Fire Safety",
      "Landscape Garden",
      "Reserved Parking"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=example",
    instagramUrl: "https://www.instagram.com/p/example",
    addedBy: {
      name: "Priya Sharma",
      role: "Senior Agent",
      email: "priya.sharma@realestate.com",
      phone: "+91 98111 11111",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    },
    addedDate: "2026-03-10",
  },
  {
    id: 2,
    title: "Modern Apartment in Koramangala",
    description: "Experience urban luxury in this beautifully designed apartment located in the heart of Koramangala, Bangalore. Features include marble floors, granite countertops, modular kitchen, and floor-to-ceiling windows with breathtaking city views. Perfect for modern living.",
    address: "80 Feet Road, Koramangala",
    city: "Bangalore",
    country: "India",
    zipCode: "560095",
    price: "₹45,00,000",
    type: "Apartment",
    status: "Available",
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    landArea: 0,
    yearBuilt: 2019,
    buildingAge: 5,
    floors: 1,
    carParking: 1,
    parkingSize: 150,
    facing: "East",
    waterSource: "Municipal Supply",
    drainType: "Public Drainage",
    boundary: "Building Complex",
    rentalIncome: "₹35,000/month",
    amenities: [
      "Air Conditioning",
      "Balcony",
      "Elevator",
      "Furnished",
      "Internet",
      "Gym/Fitness Center",
      "Clubhouse",
      "Swimming Pool",
      "24/7 Security",
      "Visitor Parking"
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    youtubeUrl: "",
    instagramUrl: "",
    addedBy: {
      name: "Amit Singh",
      role: "Agent",
      email: "amit.singh@realestate.com",
      phone: "+91 97222 22222",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
    },
    addedDate: "2026-03-05",
  },
];
 
const buyers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    budget: { min: 50000000, max: 80000000 },
    propertyTypes: ["Villa", "House"],
    minBedrooms: 3,
    minBathrooms: 2,
    preferredLocations: ["Mumbai", "Bandra"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    matchScore: 95,
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98234 56789",
    budget: { min: 60000000, max: 90000000 },
    propertyTypes: ["Villa", "Penthouse"],
    minBedrooms: 4,
    minBathrooms: 3,
    preferredLocations: ["Mumbai", "Worli"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    matchScore: 92,
  },
  {
    id: 3,
    name: "Arjun Reddy",
    email: "arjun.reddy@email.com",
    phone: "+91 97654 32109",
    budget: { min: 55000000, max: 75000000 },
    propertyTypes: ["Villa", "House", "Apartment"],
    minBedrooms: 3,
    minBathrooms: 2,
    preferredLocations: ["Mumbai", "Bandra"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    matchScore: 88,
  },
  {
    id: 4,
    name: "Kavya Menon",
    email: "kavya.menon@email.com",
    phone: "+91 94321 09876",
    budget: { min: 50000000, max: 80000000 },
    propertyTypes: ["Villa", "House"],
    minBedrooms: 4,
    minBathrooms: 3,
    preferredLocations: ["Mumbai", "Juhu"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    matchScore: 90,
  },
  {
    id: 5,
    name: "Rohit Sharma",
    email: "rohit.sharma@email.com",
    phone: "+91 95432 10987",
    budget: { min: 60000000, max: 95000000 },
    propertyTypes: ["Villa", "Luxury Home"],
    minBedrooms: 4,
    minBathrooms: 3,
    preferredLocations: ["Mumbai", "Powai"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    matchScore: 87,
  },
];

 
const findMatchingBuyers = (property: any) => {
  const propertyPrice = parseInt(property.price.replace(/[₹,]/g, ''));
  
  return buyers.filter(buyer => {
    const meetsPrice = propertyPrice >= buyer.budget.min && propertyPrice <= buyer.budget.max;
    const meetsType = buyer.propertyTypes.includes(property.type);
    const meetsBedrooms = property.bedrooms >= buyer.minBedrooms;
    const meetsBathrooms = property.bathrooms >= buyer.minBathrooms;
    const meetsLocation = buyer.preferredLocations.some(loc => 
      property.city.includes(loc) || property.address.includes(loc)
    );
    
    return meetsPrice && meetsType && meetsBedrooms && meetsBathrooms && meetsLocation;
  }).sort((a, b) => b.matchScore - a.matchScore);
};

export default function ViewProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const property = properties.find(p => p.id === Number(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buyerScrollPosition, setBuyerScrollPosition] = useState(0);
  const buyerScrollRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    if (!property || property.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [property]);

 
  const matchingBuyers = property ? findMatchingBuyers(property) : [];

   
  useEffect(() => {
    if (!matchingBuyers.length || !buyerScrollRef.current) return;

    const interval = setInterval(() => {
      if (buyerScrollRef.current) {
        const cardWidth = 320; // Width of each buyer card + gap
        const maxScroll = (matchingBuyers.length - 3) * cardWidth;
        
        setBuyerScrollPosition((prev) => {
          const newPosition = prev + cardWidth;
          return newPosition > maxScroll ? 0 : newPosition;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [matchingBuyers.length]);

   
  useEffect(() => {
    if (buyerScrollRef.current) {
      buyerScrollRef.current.scrollTo({
        left: buyerScrollPosition,
        behavior: 'smooth'
      });
    }
  }, [buyerScrollPosition]);

  const handlePrevious = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleNext = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  if (!property) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Button onClick={() => navigate("/properties")}>Back to Properties</Button>
        </div>
      </div>
    );
  }
 
  const mainImage = property.images[currentImageIndex];
  const thumbnailImages = [];
  for (let i = 1; i <= 4; i++) {
    const index = (currentImageIndex + i) % property.images.length;
    thumbnailImages.push(property.images[index]);
  }

  return (
    <div className="p-8">
 
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/properties")}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.city}, {property.country} {property.zipCode}</span>
            </div>
          </div>
          <Badge className={
            property.status === "Available"
              ? "bg-green-500"
              : property.status === "Sold"
              ? "bg-red-500"
              : "bg-yellow-500"
          }>
            {property.status}
          </Badge>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <span className="text-3xl font-bold text-blue-600">{property.price}</span>
          <span className="text-lg text-gray-600">{property.type}</span>
        </div>
      </div>
 
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="p-2 space-y-2">
            {/* Main Image with Navigation */}
            <div className="relative">
              <img
                src={mainImage}
                alt={`${property.title} - Main Image`}
                className="w-full object-cover rounded-lg h-96"
              />
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  className="p-2 bg-white/80 hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleNext}
                  className="p-2 bg-white/80 hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
 
            <div className="grid grid-cols-4 gap-2">
              {thumbnailImages.map((image, index) => (
                <div key={index} className="h-32">
                  <img
                    src={image}
                    alt={`${property.title} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
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
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Bed className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bath className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Square className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Built-up Area</p>
                    <p className="font-semibold text-gray-900">{property.area} sq ft</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Square className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Land Area</p>
                    <p className="font-semibold text-gray-900">{property.landArea > 0 ? `${property.landArea} sq ft` : "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Year Built</p>
                    <p className="font-semibold text-gray-900">{property.yearBuilt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Building Age</p>
                    <p className="font-semibold text-gray-900">{property.buildingAge} years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Total Floors</p>
                    <p className="font-semibold text-gray-900">{property.floors}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Car Parking</p>
                    <p className="font-semibold text-gray-900">{property.carParking} spaces</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Parking Size</p>
                    <p className="font-semibold text-gray-900">{property.parkingSize} sq ft</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Facing</p>
                    <p className="font-semibold text-gray-900">{property.facing}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Droplet className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Water Source</p>
                    <p className="font-semibold text-gray-900">{property.waterSource}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Droplet className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Drain Type</p>
                    <p className="font-semibold text-gray-900">{property.drainType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Boundary</p>
                    <p className="font-semibold text-gray-900">{property.boundary}</p>
                  </div>
                </div>
                {property.rentalIncome && (
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Rental Income</p>
                      <p className="font-semibold text-gray-900">{property.rentalIncome}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
 
          {(property.youtubeUrl || property.instagramUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Video Tours & Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.youtubeUrl && (
                    <a
                      href={property.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Video className="w-5 h-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">YouTube Video Tour</p>
                        <p className="text-sm text-gray-500">Watch property walkthrough</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  {property.instagramUrl && (
                    <a
                      href={property.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
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
                <img
                  src={property.addedBy.avatar}
                  alt={property.addedBy.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{property.addedBy.name}</h3>
                  <p className="text-sm text-gray-600">{property.addedBy.role}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-blue-100">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">{property.addedBy.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">{property.addedBy.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    Listed on {new Date(property.addedDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
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
              <Button className="w-full">Schedule a Viewing</Button>
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
                <CardTitle>Matching Buyers</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {matchingBuyers.length} buyer{matchingBuyers.length > 1 ? 's' : ''} interested in properties like this
                </p>
              </div>
              <Badge variant="secondary">{matchingBuyers.length} Matches</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={buyerScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {matchingBuyers.map((buyer) => (
                <Card key={buyer.id} className="flex-none w-80 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={buyer.avatar}
                          alt={buyer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{buyer.name}</p>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Active Buyer</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500">{buyer.matchScore}% Match</Badge>
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
                          Budget: ₹{(buyer.budget.min / 10000000).toFixed(1)}Cr - ₹{(buyer.budget.max / 10000000).toFixed(1)}Cr
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Bed className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          {buyer.minBedrooms}+ Bed, {buyer.minBathrooms}+ Bath
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1">
                        {buyer.propertyTypes.slice(0, 2).map((type, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full mt-2" size="sm">
                      Contact Buyer
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