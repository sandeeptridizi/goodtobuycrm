import { useState } from "react";
import { Plus, Search, Phone, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const buyers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    budget: "₹6,00,00,000 - ₹8,00,00,000",
    preferences: "Villa, 4+ bedrooms",
    status: "Active",
    leadSource: "Website",
    assignedAgent: "Priya Sharma",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 98234 56789",
    budget: "₹40,00,000 - ₹55,00,000",
    preferences: "Apartment, Mumbai",
    status: "Active",
    leadSource: "Referral",
    assignedAgent: "Amit Singh",
  },
  {
    id: 3,
    name: "Arjun Reddy",
    email: "arjun.reddy@email.com",
    phone: "+91 97654 32109",
    budget: "₹1,20,00,000 - ₹1,50,00,000",
    preferences: "Penthouse, Sea view",
    status: "Qualified",
    leadSource: "Walk-in",
    assignedAgent: "Priya Sharma",
  },
  {
    id: 4,
    name: "Ananya Iyer",
    email: "ananya.iyer@email.com",
    phone: "+91 96543 21098",
    budget: "₹35,00,000 - ₹50,00,000",
    preferences: "House, Bangalore",
    status: "Closed",
    leadSource: "Social Media",
    assignedAgent: "Vikram Malhotra",
  },
  {
    id: 5,
    name: "Rohit Sharma",
    email: "rohit.sharma@email.com",
    phone: "+91 95432 10987",
    budget: "₹50,00,000 - ₹70,00,000",
    preferences: "Condo, Modern",
    status: "Active",
    leadSource: "Website",
    assignedAgent: "Amit Singh",
  },
  {
    id: 6,
    name: "Kavya Menon",
    email: "kavya.menon@email.com",
    phone: "+91 94321 09876",
    budget: "₹80,00,000 - ₹1,00,00,000",
    preferences: "Villa, Pool",
    status: "Qualified",
    leadSource: "Email Campaign",
    assignedAgent: "Priya Sharma",
  },
];

export default function Buyers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  const filteredBuyers = buyers.filter(
    (buyer) =>
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen">
 
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Buyers</h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </span>
          </div>
          <p className="text-slate-600">Manage your buyer database with intelligent insights</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#00AEEF] shadow-lg shadow-[#00AEEF]/30 transition-all">
              <Plus className="w-4 h-4" />
              Add Buyer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Buyer</DialogTitle>
              <DialogDescription>Enter the buyer's details below.</DialogDescription>
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
                <Label>Budget Range</Label>
                <Input placeholder="$500,000 - $700,000" className="mt-1" />
              </div>
              <div>
                <Label>Lead Source</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Property Preferences</Label>
                <Input placeholder="e.g., Villa, 4+ bedrooms, Downtown" className="mt-1" />
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
                <Button onClick={() => setIsAddOpen(false)}>Add Buyer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
 
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search buyers with AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>
 
      <div className="space-y-3">
        {filteredBuyers.map((buyer) => (
          <Card 
            key={buyer.id}
            className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate(`/buyers/${buyer.id}`)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-8">
 
                <div className="flex items-center gap-3 w-64">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0096d1] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00AEEF]/30">
                    <span className="text-white font-semibold text-sm">
                      {buyer.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#004274] truncate">{buyer.name}</h3>
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mt-1 ${
                        buyer.status === "Active"
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm"
                          : buyer.status === "Qualified"
                          ? "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-sm"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm"
                      }`}
                    >
                      {buyer.status}
                    </span>
                  </div>
                </div>
 
                <div className="flex items-center gap-2 text-sm text-slate-600 w-48">
                  <Phone className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                  <span>{buyer.phone}</span>
                </div>
 
                <div className="w-52">
                  <span className="text-xs text-slate-500 font-medium">Budget</span>
                  <p className="text-sm font-semibold text-[#004274] truncate">{buyer.budget}</p>
                </div>
 
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-slate-500 font-medium">Preferences</span>
                  <p className="text-sm font-semibold text-[#004274] truncate">{buyer.preferences}</p>
                </div>
 
                <div className="w-40">
                  <span className="text-xs text-slate-500 font-medium">Lead Source</span>
                  <p className="text-sm font-semibold text-[#004274]">{buyer.leadSource}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}