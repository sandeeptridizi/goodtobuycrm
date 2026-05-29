import { useState } from "react";
import { Search, Mail as MailIcon, Phone, Clock, Building2, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useEnquiries, Enquiry } from "../../hooks/useEnquiries";

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function Enquiries() {
  const { data: enquiries, loading, error } = useEnquiries();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-sm";
      case "Contacted":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm";
      case "Qualified":
        return "bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-sm";
      case "Scheduled":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm";
      case "Not Interested":
        return "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-sm";
      case "Closed Won":
        return "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-sm";
      case "Closed Lost":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
    }
  };

  const getFilteredEnquiries = () => {
    let filtered = enquiries;

    if (activeTab !== "all") {
      filtered = filtered.filter(
        (enq: Enquiry) => enq.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    filtered = filtered.filter(
      (enq: Enquiry) =>
        enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.property?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  };

  const filteredEnquiries = getFilteredEnquiries();

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Enquiries</h1>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30">
            <Sparkles className="w-3 h-3" />
            AI Powered
          </span>
        </div>
        <p className="text-slate-600">Manage inbound property enquiries</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search enquiries with AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load enquiries. Please refresh.</p>
        </div>
      ) : (
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
              {filteredEnquiries.map((enquiry: Enquiry) => (
                <Card key={enquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-lg">
                            {enquiry.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg text-[#004274]">{enquiry.name}</h3>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(enquiry.status)}`}>
                              {enquiry.status}
                            </span>
                            <span className="text-xs text-slate-500 px-2 py-1 bg-[#00AEEF]/10 rounded-full">
                              {enquiry.source || 'Direct'}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-1">
                              <MailIcon className="w-4 h-4" />
                              {enquiry.email || 'Not provided'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {enquiry.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {timeAgo(enquiry.created_at)}
                            </div>
                          </div>

                          {enquiry.property && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                                <Building2 className="w-4 h-4" />
                                <span className="font-semibold">{enquiry.property}</span>
                              </div>
                              {enquiry.message && (
                                <p className="text-slate-600 text-sm">{enquiry.message}</p>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {enquiry.status === "New" && (
                              <>
                                <Button size="sm" className="bg-gradient-to-r from-[#00AEEF] to-[#0096d1]">Contact</Button>
                                <Button size="sm" variant="outline">Schedule Viewing</Button>
                              </>
                            )}
                            {enquiry.status === "Contacted" && (
                              <>
                                <Button size="sm" className="bg-gradient-to-r from-[#00AEEF] to-[#0096d1]">Schedule Viewing</Button>
                                <Button size="sm" variant="outline">Send Follow-up</Button>
                              </>
                            )}
                            {enquiry.status === "Scheduled" && (
                              <Button size="sm" className="bg-gradient-to-r from-green-400 to-green-500">View Appointment</Button>
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
                    <MailIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No enquiries found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}