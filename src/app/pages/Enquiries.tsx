import { useState } from "react";
import { Search, Mail as MailIcon, Phone, Clock, Building2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const enquiries = [
  {
    id: 1,
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    phone: "+91 98765 12345",
    property: "Luxury Villa in Bandra West",
    message: "I'm interested in viewing this property. When is the next available time?",
    status: "New",
    timestamp: "2026-03-27T10:30:00",
    source: "Website",
  },
  {
    id: 2,
    name: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    phone: "+91 97654 23456",
    property: "Modern Apartment in Koramangala",
    message: "Could you provide more details about the amenities and parking?",
    status: "Contacted",
    timestamp: "2026-03-27T09:15:00",
    source: "Email",
  },
  {
    id: 3,
    name: "Amit Desai",
    email: "amit.desai@email.com",
    phone: "+91 96543 34567",
    property: "Beach House in Goa",
    message: "Is the property still available? I would like to schedule a viewing.",
    status: "New",
    timestamp: "2026-03-27T08:45:00",
    source: "Phone",
  },
  {
    id: 4,
    name: "Neha Singh",
    email: "neha.singh@email.com",
    phone: "+91 95432 45678",
    property: "Penthouse Suite in Worli",
    message: "What is the maintenance fee for this unit? Can we negotiate on the price?",
    status: "Scheduled",
    timestamp: "2026-03-26T16:20:00",
    source: "Website",
  },
  {
    id: 5,
    name: "Rohan Kapoor",
    email: "rohan.kapoor@email.com",
    phone: "+91 94321 56789",
    property: "Family Home in Whitefield",
    message: "Great location! When can I visit the property?",
    status: "Contacted",
    timestamp: "2026-03-26T14:10:00",
    source: "Referral",
  },
  {
    id: 6,
    name: "Pooja Mehta",
    email: "pooja.mehta@email.com",
    phone: "+91 93210 67890",
    property: "Villa in Jubilee Hills",
    message: "I would like to know more about the financing options available.",
    status: "New",
    timestamp: "2026-03-26T11:45:00",
    source: "Website",
  },
];

export default function Enquiries() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [enquiryStatuses, setEnquiryStatuses] = useState<{ [key: number]: string }>(
    enquiries.reduce((acc, enq) => ({ ...acc, [enq.id]: enq.status }), {})
  );

  const handleStatusChange = (enquiryId: number, newStatus: string) => {
    setEnquiryStatuses(prev => ({ ...prev, [enquiryId]: newStatus }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Contacted":
        return "bg-yellow-100 text-yellow-700";
      case "Qualified":
        return "bg-purple-100 text-purple-700";
      case "Scheduled":
        return "bg-green-100 text-green-700";
      case "Not Interested":
        return "bg-red-100 text-red-700";
      case "Closed Won":
        return "bg-emerald-100 text-emerald-700";
      case "Closed Lost":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFilteredEnquiries = () => {
    let filtered = enquiries;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (enq) => enq.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by search
    filtered = filtered.filter(
      (enq) =>
        enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.property.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  };

  const filteredEnquiries = getFilteredEnquiries();

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-500 mt-2">Manage inbound property enquiries</p>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredEnquiries.map((enquiry) => (
              <Card key={enquiry.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-semibold text-lg">
                          {enquiry.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">{enquiry.name}</h3>
                          <Select
                            value={enquiryStatuses[enquiry.id]}
                            onValueChange={(value) => handleStatusChange(enquiry.id, value)}
                          >
                            <SelectTrigger className={`w-[160px] h-7 text-xs font-medium border-0 ${getStatusColor(enquiryStatuses[enquiry.id])}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                              <SelectItem value="Qualified">Qualified</SelectItem>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="Not Interested">Not Interested</SelectItem>
                              <SelectItem value="Closed Won">Closed Won</SelectItem>
                              <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">
                            {enquiry.source}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MailIcon className="w-4 h-4" />
                            {enquiry.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {enquiry.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getTimeAgo(enquiry.timestamp)}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{enquiry.property}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{enquiry.message}</p>
                        </div>

                        <div className="flex gap-2">
                          {enquiryStatuses[enquiry.id] === "New" && (
                            <>
                              <Button size="sm" variant="default">Contact</Button>
                              <Button size="sm" variant="outline">Schedule Viewing</Button>
                            </>
                          )}
                          {enquiryStatuses[enquiry.id] === "Contacted" && (
                            <>
                              <Button size="sm" variant="default">Schedule Viewing</Button>
                              <Button size="sm" variant="outline">Send Follow-up</Button>
                            </>
                          )}
                          {enquiryStatuses[enquiry.id] === "Qualified" && (
                            <>
                              <Button size="sm" variant="default">Schedule Viewing</Button>
                              <Button size="sm" variant="outline">Send Proposal</Button>
                            </>
                          )}
                          {enquiryStatuses[enquiry.id] === "Scheduled" && (
                            <>
                              <Button size="sm" variant="default">View Appointment</Button>
                              <Button size="sm" variant="outline">Send Reminder</Button>
                            </>
                          )}
                          {enquiryStatuses[enquiry.id] === "Not Interested" && (
                            <Button size="sm" variant="outline">View Details</Button>
                          )}
                          {(enquiryStatuses[enquiry.id] === "Closed Won" || enquiryStatuses[enquiry.id] === "Closed Lost") && (
                            <Button size="sm" variant="outline">View Details</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredEnquiries.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <MailIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No enquiries found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}