import { Outlet, Link, useLocation } from "react-router";
import { Building2, Home, Users, UserCheck, Mail, Briefcase, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/Imgfb/ImageWithFallback";
import logo from "../../assets/GoodToBuy Logo.png";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Buyers", href: "/buyers", icon: Users },
  { name: "Sellers", href: "/sellers", icon: UserCheck },
  { name: "Enquiries", href: "/enquiries", icon: Mail },
  { name: "Employees", href: "/employees", icon: Briefcase },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
 
      <aside className="w-64 bg-gradient-to-b from-[#004274] to-[#002847] border-r border-white/10 shadow-2xl">
        <div className="flex flex-col h-full">
 
          <div className="p-6 border-b border-gray-200 bg-white">
            <ImageWithFallback 
              src={logo}
              alt="Goodtobuy Properties"
              className="h-16 w-auto object-contain"
            />
          </div>
 
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white shadow-lg shadow-[#00AEEF]/30"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
 
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0096d1] flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold">MR</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">Mohan Ravva</p>
                <p className="text-xs text-blue-200">mohan@goodtobuy.in</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
 
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}