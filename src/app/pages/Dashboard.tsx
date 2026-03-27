import { Building2, Users, UserCheck, Mail, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useEffect, useRef } from "react";

const stats = [
  {
    name: "Total Properties",
    value: "127",
    change: "+12%",
    icon: Building2,
    gradient: "from-[#00AEEF] to-[#0096d1]",
  },
  {
    name: "Active Buyers",
    value: "89",
    change: "+8%",
    icon: Users,
    gradient: "from-[#004274] to-[#003059]",
  },
  {
    name: "Active Sellers",
    value: "54",
    change: "+5%",
    icon: UserCheck,
    gradient: "from-[#00AEEF] to-[#0096d1]",
  },
  {
    name: "New Enquiries",
    value: "23",
    change: "+15%",
    icon: Mail,
    gradient: "from-[#004274] to-[#003059]",
  },
];

const recentEnquiries = [
  { id: 1, name: "Rahul Verma", property: "Luxury Villa in Bandra West", status: "New", time: "5 min ago" },
  { id: 2, name: "Sneha Gupta", property: "Modern Apartment in Koramangala", status: "Contacted", time: "1 hour ago" },
  { id: 3, name: "Amit Desai", property: "Beach House in Goa", status: "New", time: "2 hours ago" },
  { id: 4, name: "Neha Singh", property: "Penthouse Suite in Worli", status: "Scheduled", time: "3 hours ago" },
];

const recentBuyers = [
  { id: 1, name: "Arjun Reddy", budget: "₹1,20,00,000 - ₹1,50,00,000", preferences: "Penthouse, Sea view", status: "Qualified", time: "1 day ago" },
  { id: 2, name: "Rohit Sharma", budget: "₹50,00,000 - ₹70,00,000", preferences: "Condo, Modern", status: "Active", time: "2 days ago" },
  { id: 3, name: "Kavya Menon", budget: "₹80,00,000 - ₹1,00,00,000", preferences: "Villa, Pool", status: "Qualified", time: "3 days ago" },
  { id: 4, name: "Priya Patel", budget: "₹40,00,000 - ₹55,00,000", preferences: "Apartment, Mumbai", status: "Active", time: "5 days ago" },
];

const recentDeals = [
  { id: 1, property: "Office Space in BKC", buyer: "Tech Solutions Pvt Ltd", amount: "₹65,00,000", status: "Closed" },
  { id: 2, property: "Family Home in Whitefield", buyer: "Sharma Family", amount: "₹42,50,000", status: "Pending" },
  { id: 3, name: "Luxury Condo in Gurgaon", buyer: "Ananya Iyer", amount: "₹52,00,000", status: "Closed" },
];

export default function Dashboard() {
  const enquiriesRef = useRef<HTMLDivElement>(null);
  const buyersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = (ref: React.RefObject<HTMLDivElement>) => {
      if (!ref.current) return;
      
      const element = ref.current;
      let scrollAmount = 0;
      const scrollSpeed = 1;
      const maxScroll = element.scrollWidth - element.clientWidth;

      const scroll = () => {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= maxScroll) {
          scrollAmount = 0;
        }
        element.scrollLeft = scrollAmount;
      };

      const intervalId = setInterval(scroll, 30);
      return () => clearInterval(intervalId);
    };

    const cleanupEnquiries = scrollContainer(enquiriesRef);
    const cleanupBuyers = scrollContainer(buyersRef);

    return () => {
      cleanupEnquiries?.();
      cleanupBuyers?.();
    };
  }, []);

  return (
    <div className="p-8 min-h-screen">
      {/* Header with AI Badge */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Dashboard</h1>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30 animate-pulse">
            <Sparkles className="w-3 h-3" />
            GoodToBuy Properties Analytics
          </span>
        </div>
        <p className="text-slate-600">Welcome back! Here's your AI-powered property management overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-[#00AEEF]/10 hover:border-[#00AEEF]/30 transition-all hover:shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1 font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-[#004274]">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="text-sm text-green-600 font-semibold">{stat.change}</p>
                    <span className="text-xs text-slate-400">from last month</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-[#00AEEF]/30`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="border border-[#00AEEF]/10 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-[#004274]">Recent Enquiries</h2>
            <Sparkles className="w-4 h-4 text-[#00AEEF]" />
          </div>
          <div ref={enquiriesRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
            {recentEnquiries.map((enquiry) => (
              <Card key={enquiry.id} className="flex-shrink-0 w-80 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 transition-all hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-[#004274]">{enquiry.name}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      enquiry.status === "New" ? "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-sm" :
                      enquiry.status === "Contacted" ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm" :
                      "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm"
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{enquiry.property}</p>
                  <p className="text-xs text-slate-400">{enquiry.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Buyers */}
        <div className="border border-[#00AEEF]/10 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-[#004274]">Recent Buyers</h2>
            <Sparkles className="w-4 h-4 text-[#00AEEF]" />
          </div>
          <div ref={buyersRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
            {recentBuyers.map((buyer) => (
              <Card key={buyer.id} className="flex-shrink-0 w-80 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 transition-all hover:shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-[#004274]">{buyer.name}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      buyer.status === "Qualified" ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm" :
                      buyer.status === "Active" ? "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-sm" :
                      "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm"
                    }`}>
                      {buyer.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1 font-medium">{buyer.budget}</p>
                  <p className="text-sm text-slate-500 mb-2">{buyer.preferences}</p>
                  <p className="text-xs text-slate-400">{buyer.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}