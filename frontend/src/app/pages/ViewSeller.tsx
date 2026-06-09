import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, MapPin, Home, Building, IndianRupee, Calendar, TrendingUp, Sparkles, Pencil, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useSeller, useSellers, Seller } from "../../hooks/useSellers";
import { formatPrice } from "../../hooks/useDashboard";
import { toast } from "sonner";

export default function ViewSeller() {
  const navigate = useNavigate();
  const { id } = useParams();
  const sellerId = Number(id);
  const { data: seller, loading, error } = useSeller(sellerId);
  const { remove } = useSellers();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this seller? This action cannot be undone.")) {
      return;
    }
    try {
      await remove(sellerId);
      toast.success("Seller deleted successfully!");
      navigate("/sellers");
    } catch (err) {
      console.error("Failed to delete seller:", err);
      toast.error("Failed to delete seller. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading seller...</p>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Not Found</h1>
          <Button onClick={() => navigate("/sellers")}>Back to Sellers</Button>
        </div>
      </div>
    );
  }

  const properties = (seller as Seller & { properties?: Array<{
    id: number; title: string; address: string; city: string; price: number; type: string; status: string; bedrooms: number; bathrooms: number; area: number; created_at: string; images?: string[];
  }> }).properties || [];
  const totalProperties = properties.length;
  const activeListings = properties.filter((p: any) => p.status === 'Available').length;
  const soldProperties = properties.filter((p: any) => p.status === 'Sold').length;

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

  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800";

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/sellers")} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Sellers
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">
                {seller.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{seller.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={seller.status === "Active" ? "bg-gradient-to-r from-green-400 to-green-500 text-white" : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"}>
                  {seller.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/sellers/${sellerId}/edit`)}>
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1]">
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
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {properties.reduce((acc: number, p: any) => acc + Number(p.price), 0) > 0
                    ? formatPrice(properties.reduce((acc: number, p: any) => acc + Number(p.price), 0))
                    : 'N/A'}
                </p>
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
                <p className="text-3xl font-bold text-green-900 mt-1">{activeListings}</p>
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
                <p className="text-3xl font-bold text-purple-900 mt-1">{soldProperties}</p>
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
                <p className="text-3xl font-bold text-amber-900 mt-1">{totalProperties}</p>
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
              <div className="flex items-center gap-2">
                <CardTitle>Properties ({properties.length})</CardTitle>
                <Sparkles className="w-4 h-4 text-[#00AEEF]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {properties.map((property: any) => (
                <div
                  key={property.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <img
                    src={property.images?.[0] || defaultImage}
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
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-semibold text-gray-900">{formatPrice(property.price)}</p>
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
                      Listed: {new Date(property.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <p className="text-slate-400 text-center py-4">No properties listed</p>
              )}
            </CardContent>
          </Card>

          {seller.notes && (
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
                  {seller.selling_reason && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Selling Reason</p>
                      <p className="text-gray-900 font-medium">{seller.selling_reason}</p>
                    </div>
                  )}
                  {seller.timeline && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Timeline</p>
                      <p className="text-gray-900 font-medium">{seller.timeline}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{seller.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{seller.phone}</p>
                </div>
              </div>
              {seller.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{seller.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="text-gray-900 font-semibold">
                    {seller.created_at ? new Date(seller.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
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