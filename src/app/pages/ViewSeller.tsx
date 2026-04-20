import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, MapPin, Home, Building, IndianRupee, Calendar, TrendingUp, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

 
const sellers = [
  {
    id: 1,
    name: "Vikram Malhotra",
    email: "vikram.malhotra@email.com",
    phone: "+91 98765 12345",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    address: "Powai, Mumbai",
    status: "Active",
    registrationDate: "2024-01-15",
    totalProperties: 3,
    soldProperties: 1,
    activeListings: 2,
    totalValue: "₹18.5Cr",
    preferredAgent: "Priya Sharma",
    properties: [
      {
        id: 1,
        title: "Luxury Villa in Bandra West",
        address: "15th Road, Bandra West",
        city: "Mumbai",
        price: "₹6,50,00,000",
        type: "Villa",
        status: "Available",
        bedrooms: 4,
        bathrooms: 3,
        area: 3200,
        listedDate: "2026-03-10",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      },
      {
        id: 2,
        title: "Penthouse in Worli",
        address: "Worli Sea Face",
        city: "Mumbai",
        price: "₹4,20,00,000",
        type: "Penthouse",
        status: "Available",
        bedrooms: 3,
        bathrooms: 2,
        area: 2800,
        listedDate: "2026-02-20",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      },
      {
        id: 3,
        title: "Beach Villa in Goa",
        address: "Anjuna Beach Road",
        city: "Goa",
        price: "₹7,80,00,000",
        type: "Villa",
        status: "Sold",
        bedrooms: 5,
        bathrooms: 4,
        area: 4200,
        listedDate: "2025-12-15",
        soldDate: "2026-02-28",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      },
    ],
    notes: "High-value property owner looking to liquidate real estate portfolio. Prefers quick transactions with minimal hassle.",
    sellingReason: "Portfolio restructuring and investment diversification",
    timeline: "3-6 months for remaining properties",
  },
  {
    id: 2,
    name: "Meera Nair",
    email: "meera.nair@email.com",
    phone: "+91 97654 32100",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    address: "Indiranagar, Bangalore",
    status: "Active",
    registrationDate: "2024-02-10",
    totalProperties: 2,
    soldProperties: 0,
    activeListings: 2,
    totalValue: "₹6.8Cr",
    preferredAgent: "Amit Singh",
    properties: [
      {
        id: 4,
        title: "Modern Apartment in Koramangala",
        address: "80 Feet Road, Koramangala",
        city: "Bangalore",
        price: "₹45,00,000",
        type: "Apartment",
        status: "Available",
        bedrooms: 2,
        bathrooms: 2,
        area: 1800,
        listedDate: "2026-03-05",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      },
      {
        id: 5,
        title: "Villa in Whitefield",
        address: "ITPL Main Road, Whitefield",
        city: "Bangalore",
        price: "₹2,35,00,000",
        type: "Villa",
        status: "Available",
        bedrooms: 4,
        bathrooms: 3,
        area: 3500,
        listedDate: "2026-02-15",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      },
    ],
    notes: "Relocating to Dubai for work. Looking for buyers who can close quickly. All properties are well-maintained.",
    sellingReason: "International relocation",
    timeline: "1-3 months",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 96543 21098",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    address: "Hitech City, Hyderabad",
    status: "Active",
    registrationDate: "2023-11-20",
    totalProperties: 1,
    soldProperties: 2,
    activeListings: 1,
    totalValue: "₹3.2Cr",
    preferredAgent: "Vikram Malhotra",
    properties: [
      {
        id: 6,
        title: "Luxury Apartment in Jubilee Hills",
        address: "Road No. 36, Jubilee Hills",
        city: "Hyderabad",
        price: "₹3,20,00,000",
        type: "Apartment",
        status: "Available",
        bedrooms: 3,
        bathrooms: 3,
        area: 2400,
        listedDate: "2026-03-01",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      },
    ],
    notes: "Experienced seller with previous successful transactions. Realistic about pricing and timeline.",
    sellingReason: "Downsizing after children moved abroad",
    timeline: "Flexible, no rush",
  },
];

export default function ViewSeller() {
  const navigate = useNavigate();
  const { id } = useParams();
  const seller = sellers.find(s => s.id === Number(id));

  if (!seller) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Not Found</h1>
          <Button onClick={() => navigate("/sellers")}>Back to Sellers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
   
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/sellers")}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sellers
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{seller.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={
                    seller.status === "Active"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }
                >
                  {seller.status}
                </Badge>
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
 
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Value</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{seller.totalValue}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <IndianRupee className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Listings</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{seller.activeListings}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <Building className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Sold Properties</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{seller.soldProperties}</p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Total Properties</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">{seller.totalProperties}</p>
              </div>
              <div className="bg-amber-200 p-3 rounded-full">
                <Home className="w-6 h-6 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
        <div className="lg:col-span-2 space-y-6">
 
          <Card>
            <CardHeader>
              <CardTitle>Properties ({seller.properties.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {seller.properties.map((property) => (
                <div
                  key={property.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{property.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          {property.address}, {property.city}
                        </div>
                      </div>
                      <Badge
                        className={
                          property.status === "Available"
                            ? "bg-green-500"
                            : property.status === "Sold"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-semibold text-gray-900">{property.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold text-gray-900">{property.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="font-semibold text-gray-900">{property.area} sq ft</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Calendar className="w-3 h-3" />
                      Listed: {new Date(property.listedDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {property.soldDate && (
                        <>
                          {' • Sold: '}
                          {new Date(property.soldDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>Notes & Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Agent Notes</p>
                <p className="text-gray-900">{seller.notes}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Selling Reason</p>
                  <p className="text-gray-900 font-medium">{seller.sellingReason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Timeline</p>
                  <p className="text-gray-900 font-medium">{seller.timeline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
 
        <div className="space-y-6">
 
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{seller.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{seller.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">{seller.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(seller.registrationDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Preferred Agent</p>
                  <p className="text-gray-900 font-semibold">{seller.preferredAgent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Phone className="w-4 h-4" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building className="w-4 h-4" />
                Add New Property
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}