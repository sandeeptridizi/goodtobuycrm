import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, Award, Briefcase, Calendar, TrendingUp, Users, Home, Building, DollarSign, Target, BarChart3 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Mock employees data with detailed information
const employees = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@realestate.com",
    phone: "+91 98111 11111",
    role: "Senior Agent",
    department: "Sales",
    status: "Active",
    joinDate: "2023-01-15",
    activeDealings: 12,
    closedDeals: 48,
    revenue: "₹3.2Cr",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    address: "Bandra West, Mumbai",
    emergencyContact: "+91 98111 22222",
    skills: ["Luxury Properties", "Client Relations", "Negotiation", "Market Analysis"],
    qualifications: "MBA in Real Estate, Bachelor's in Business",
    languages: ["English", "Hindi", "Marathi"],
    recentDeals: [
      { property: "Luxury Villa in Bandra West", buyer: "Rajesh Kumar", amount: "₹6.5Cr", date: "2026-03-15" },
      { property: "Penthouse in Worli", buyer: "Arjun Reddy", amount: "₹2.1Cr", date: "2026-02-28" },
      { property: "Villa in Juhu", buyer: "Kavya Menon", amount: "₹8.5Cr", date: "2026-02-10" },
    ],
    currentClients: 12,
    clientSatisfaction: 4.8,
    avgDealTime: "45 days",
  },
  {
    id: 2,
    name: "Amit Singh",
    email: "amit.singh@realestate.com",
    phone: "+91 97222 22222",
    role: "Agent",
    department: "Sales",
    status: "Active",
    joinDate: "2023-06-20",
    activeDealings: 8,
    closedDeals: 32,
    revenue: "₹2.1Cr",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
    address: "Andheri East, Mumbai",
    emergencyContact: "+91 97222 33333",
    skills: ["Residential Properties", "First-time Buyers", "Digital Marketing"],
    qualifications: "Bachelor's in Commerce, Real Estate Certification",
    languages: ["English", "Hindi", "Punjabi"],
    recentDeals: [
      { property: "Modern Apartment in Powai", buyer: "Priya Patel", amount: "₹48L", date: "2026-03-20" },
      { property: "Office Space in BKC", buyer: "Tech Solutions", amount: "₹65L", date: "2026-03-05" },
    ],
    currentClients: 8,
    clientSatisfaction: 4.6,
    avgDealTime: "52 days",
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    email: "vikram.m@realestate.com",
    phone: "+91 96333 33333",
    role: "Senior Agent",
    department: "Sales",
    status: "Active",
    joinDate: "2022-03-10",
    activeDealings: 15,
    closedDeals: 67,
    revenue: "₹4.5Cr",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    address: "Powai, Mumbai",
    emergencyContact: "+91 96333 44444",
    skills: ["Commercial Properties", "Investment Properties", "High-value Deals"],
    qualifications: "MBA, Real Estate Developer License",
    languages: ["English", "Hindi"],
    recentDeals: [
      { property: "Beach House in Goa", buyer: "Karthik Reddy", amount: "₹1.2Cr", date: "2026-03-18" },
      { property: "Commercial Space in Lower Parel", buyer: "StartUp Hub", amount: "₹95L", date: "2026-02-22" },
      { property: "Luxury Villa in Lonavala", buyer: "Meera Nair", amount: "₹1.8Cr", date: "2026-01-30" },
    ],
    currentClients: 15,
    clientSatisfaction: 4.9,
    avgDealTime: "38 days",
  },
  {
    id: 4,
    name: "Anjali Reddy",
    email: "anjali.reddy@realestate.com",
    phone: "+91 95444 44444",
    role: "Property Manager",
    department: "Operations",
    status: "Active",
    joinDate: "2023-09-05",
    activeDealings: 25,
    closedDeals: 18,
    revenue: "₹1.8Cr",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    address: "Koramangala, Bangalore",
    emergencyContact: "+91 95444 55555",
    skills: ["Property Management", "Tenant Relations", "Maintenance Coordination"],
    qualifications: "Bachelor's in Property Management, PMP Certified",
    languages: ["English", "Hindi", "Telugu", "Kannada"],
    recentDeals: [
      { property: "Apartment Complex - Whitefield", buyer: "Multiple Tenants", amount: "₹45L", date: "2026-03-12" },
      { property: "Villa Maintenance - Indiranagar", buyer: "Service Contract", amount: "₹12L", date: "2026-02-15" },
    ],
    currentClients: 25,
    clientSatisfaction: 4.7,
    avgDealTime: "N/A",
  },
  {
    id: 5,
    name: "Karan Kapoor",
    email: "karan.kapoor@realestate.com",
    phone: "+91 94555 55555",
    role: "Marketing Manager",
    department: "Marketing",
    status: "Active",
    joinDate: "2022-11-12",
    activeDealings: 0,
    closedDeals: 0,
    revenue: "N/A",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    address: "Bandra West, Mumbai",
    emergencyContact: "+91 94555 66666",
    skills: ["Digital Marketing", "Content Strategy", "Social Media", "Brand Management"],
    qualifications: "MBA in Marketing, Digital Marketing Certification",
    languages: ["English", "Hindi"],
    recentDeals: [],
    currentClients: 0,
    clientSatisfaction: 0,
    avgDealTime: "N/A",
  },
  {
    id: 6,
    name: "Sneha Patel",
    email: "sneha.patel@realestate.com",
    phone: "+91 93666 66666",
    role: "Agent",
    department: "Sales",
    status: "Active",
    joinDate: "2024-02-01",
    activeDealings: 5,
    closedDeals: 12,
    revenue: "₹85L",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    address: "Thane, Mumbai",
    emergencyContact: "+91 93666 77777",
    skills: ["Residential Sales", "Customer Service", "Property Valuation"],
    qualifications: "Bachelor's in Business, Real Estate License",
    languages: ["English", "Hindi", "Gujarati"],
    recentDeals: [
      { property: "Apartment in Thane", buyer: "Sharma Family", amount: "₹42L", date: "2026-03-22" },
      { property: "House in Navi Mumbai", buyer: "Rohan Kapoor", amount: "₹38L", date: "2026-03-08" },
    ],
    currentClients: 5,
    clientSatisfaction: 4.5,
    avgDealTime: "60 days",
  },
];

export default function ViewEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const employee = employees.find(e => e.id === Number(id));

  if (!employee) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <Button onClick={() => navigate("/employees")}>Back to Employees</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/employees")}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-xl text-gray-600 mt-1">{employee.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={
                    employee.status === "Active"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }
                >
                  {employee.status}
                </Badge>
                <Badge variant="secondary">{employee.department}</Badge>
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

      {/* Performance Stats - Full Width Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{employee.revenue}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Closed Deals</p>
                <p className="text-3xl font-bold text-green-900 mt-1">{employee.closedDeals}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <Target className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Active Dealings</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">{employee.activeDealings}</p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <Briefcase className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Client Satisfaction</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">
                  {employee.clientSatisfaction > 0 ? `${employee.clientSatisfaction}/5` : "N/A"}
                </p>
              </div>
              <div className="bg-amber-200 p-3 rounded-full">
                <Award className="w-6 h-6 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{employee.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{employee.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Emergency Contact</p>
                    <p className="text-gray-900">{employee.emergencyContact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Qualifications</p>
                <p className="text-gray-900">{employee.qualifications}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {employee.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Deals */}
          {employee.recentDeals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.recentDeals.map((deal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{deal.property}</p>
                          <p className="text-sm text-gray-500">Client: {deal.buyer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{deal.amount}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(deal.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(employee.joinDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="text-gray-900 font-semibold">{employee.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-900 font-semibold">{employee.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Current Clients</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{employee.currentClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Avg Deal Time</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{employee.avgDealTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Success Rate</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {employee.closedDeals > 0 
                    ? `${Math.round((employee.closedDeals / (employee.closedDeals + employee.activeDealings)) * 100)}%`
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
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
                <Award className="w-4 h-4" />
                View Performance Report
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="w-4 h-4" />
                Assign Client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
