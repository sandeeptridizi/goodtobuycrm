import { useState } from "react";
import { Plus, Search, Phone, Mail as MailIcon, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const sellers = [
  {
    id: 1,
    name: "Vikram Malhotra",
    email: "vikram.malhotra@email.com",
    phone: "+91 98111 22333",
    property: "Luxury Villa in Bandra West",
    address: "15th Road, Bandra West, Mumbai",
    askingPrice: "₹6,50,00,000",
    status: "Listed",
    listingDate: "2026-02-15",
    assignedAgent: "Priya Sharma",
  },
  {
    id: 2,
    name: "Meera Nair",
    email: "meera.nair@email.com",
    phone: "+91 97234 55667",
    property: "Family Home in Whitefield",
    address: "ITPL Main Road, Whitefield, Bangalore",
    askingPrice: "₹42,50,000",
    status: "Under Contract",
    listingDate: "2026-01-20",
    assignedAgent: "Amit Singh",
  },
  {
    id: 3,
    name: "Karthik Reddy",
    email: "karthik.reddy@email.com",
    phone: "+91 96345 78990",
    property: "Beach House in Goa",
    address: "Candolim Beach Road, North Goa",
    askingPrice: "₹1,20,00,000",
    status: "Sold",
    listingDate: "2025-12-10",
    assignedAgent: "Vikram Malhotra",
  },
  {
    id: 4,
    name: "Lakshmi Iyer",
    email: "lakshmi.iyer@email.com",
    phone: "+91 95456 89012",
    property: "Modern Apartment in Koramangala",
    address: "80 Feet Road, Koramangala, Bangalore",
    askingPrice: "₹45,00,000",
    status: "Listed",
    listingDate: "2026-03-01",
    assignedAgent: "Priya Sharma",
  },
  {
    id: 5,
    name: "Suresh Patel",
    email: "suresh.patel@email.com",
    phone: "+91 94567 90123",
    property: "Office Space in BKC",
    address: "Bandra Kurla Complex, Mumbai",
    askingPrice: "₹75,00,000",
    status: "Listed",
    listingDate: "2026-02-25",
    assignedAgent: "Amit Singh",
  },
  {
    id: 6,
    name: "Divya Krishnan",
    email: "divya.krishnan@email.com",
    phone: "+91 93678 01234",
    property: "Penthouse Suite in Worli",
    address: "Worli Sea Face, Mumbai",
    askingPrice: "₹2,10,00,000",
    status: "Listed",
    listingDate: "2026-03-10",
    assignedAgent: "Priya Sharma",
  },
];

export default function Sellers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sellers</h1>
          <p className="text-gray-500 mt-2">Manage your seller clients</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Seller
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Seller</DialogTitle>
              <DialogDescription>Enter the details of the new seller.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Smith" className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="john@email.com" className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+1 (555) 123-4567" className="mt-1" />
              </div>
              <div>
                <Label>Property Name</Label>
                <Input placeholder="Modern Villa" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Property Address</Label>
                <Input placeholder="123 Main Street" className="mt-1" />
              </div>
              <div>
                <Label>Asking Price</Label>
                <Input placeholder="$850,000" className="mt-1" />
              </div>
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="listed">Listed</SelectItem>
                    <SelectItem value="under-contract">Under Contract</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Assigned Agent</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Brown</SelectItem>
                    <SelectItem value="david">David Lee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddOpen(false)}>Add Seller</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
 
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSellers.map((seller) => (
          <Card 
            key={seller.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/sellers/${seller.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-lg">
                      {seller.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{seller.name}</h3>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                        seller.status === "Listed"
                          ? "bg-blue-100 text-blue-700"
                          : seller.status === "Under Contract"
                          ? "bg-yellow-100 text-yellow-700"
                          : seller.status === "Sold"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {seller.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MailIcon className="w-4 h-4" />
                  {seller.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {seller.phone}
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="mb-3">
                    <p className="font-medium text-gray-900 mb-1">{seller.property}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {seller.address}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Asking Price:</span>
                    <span className="text-lg font-semibold text-blue-600">{seller.askingPrice}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Listed Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(seller.listingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Agent:</span>
                    <span className="text-sm font-medium text-gray-900">{seller.assignedAgent}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}