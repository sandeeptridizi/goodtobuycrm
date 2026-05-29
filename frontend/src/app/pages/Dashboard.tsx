import { Building2, Users, UserCheck, Mail, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useRef } from "react";
import { useDashboard, formatCurrency } from "../../hooks/useDashboard";

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

export default function Dashboard() {
  const { stats, loading, error } = useDashboard();
  const enquiriesRef = useRef<HTMLDivElement>(null);
  const buyersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupScroll = (element: HTMLDivElement | null) => {
      if (!element) return () => {};

      const scrollWidth = element.scrollWidth;
      const clientWidth = element.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll <= 0) return () => {};

      let scrollAmount = 0;
      const scrollSpeed = 2;

      const scroll = () => {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= maxScroll) {
          scrollAmount = 0;
        }
        element.scrollLeft = scrollAmount;
      };

      const intervalId = setInterval(scroll, 50);
      return () => clearInterval(intervalId);
    };

    const cleanupEnquiries = setupScroll(enquiriesRef.current);
    const cleanupBuyers = setupScroll(buyersRef.current);

    return () => {
      cleanupEnquiries();
      cleanupBuyers();
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load dashboard. Please refresh.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Properties",
      value: stats.totalProperties,
      icon: Building2,
      gradient: "from-[#00AEEF] to-[#0096d1]",
    },
    {
      name: "Active Buyers",
      value: stats.activeBuyers,
      icon: Users,
      gradient: "from-[#004274] to-[#003059]",
    },
    {
      name: "Active Sellers",
      value: stats.activeSellers,
      icon: UserCheck,
      gradient: "from-[#00AEEF] to-[#0096d1]",
    },
    {
      name: "New Enquiries",
      value: stats.newEnquiries,
      icon: Mail,
      gradient: "from-[#004274] to-[#003059]",
    },
  ];

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Dashboard</h1>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30">
            <Sparkles className="w-3 h-3" />
            GoodToBuy Properties Analytics
          </span>
        </div>
        <p className="text-slate-600">Welcome back! Here&apos;s your AI-powered property management overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.name} className="border-[#00AEEF]/10 hover:border-[#00AEEF]/30 transition-all hover:shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1 font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-[#004274]">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <p className="text-sm text-green-600 font-semibold">Live</p>
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
        <div className="border border-[#00AEEF]/10 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-[#004274]">Recent Enquiries</h2>
            <Sparkles className="w-4 h-4 text-[#00AEEF]" />
          </div>
          <div ref={enquiriesRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
            {stats.recentEnquiries && stats.recentEnquiries.length > 0 ? (
              stats.recentEnquiries.map((enquiry) => (
                <Card key={enquiry.id} className="flex-shrink-0 w-80 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 transition-all hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-[#004274]">{enquiry.name}</p>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        enquiry.status === "New" ? "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-sm" :
                        enquiry.status === "Contacted" ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm" :
                        enquiry.status === "Qualified" ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm" :
                        "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm"
                      }`}>
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{enquiry.property || 'General Enquiry'}</p>
                    <p className="text-xs text-slate-400">{timeAgo(enquiry.created_at)}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No recent enquiries</p>
            )}
          </div>
        </div>

        <div className="border border-[#00AEEF]/10 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-[#004274]">Recent Buyers</h2>
            <Sparkles className="w-4 h-4 text-[#00AEEF]" />
          </div>
          <div ref={buyersRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
            {stats.recentBuyers && stats.recentBuyers.length > 0 ? (
              stats.recentBuyers.map((buyer) => (
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
                    <p className="text-sm text-slate-600 mb-1 font-medium">
                      {formatCurrency(buyer.budget_min)} - {formatCurrency(buyer.budget_max)}
                    </p>
                    <p className="text-xs text-slate-400">{timeAgo(buyer.created_at)}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No recent buyers</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
