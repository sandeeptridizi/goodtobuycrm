import { useState } from "react";
import { Plus, Search, Mail as MailIcon, Phone, Award } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

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
  },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const navigate = useNavigate();

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 mt-2">Manage your team members</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter the employee's details below.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Smith" className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="john@realestate.com" className="mt-1" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+1 (555) 123-4567" className="mt-1" />
              </div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior-agent">Junior Agent</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="senior-agent">Senior Agent</SelectItem>
                    <SelectItem value="property-manager">Property Manager</SelectItem>
                    <SelectItem value="marketing">Marketing Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Join Date</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddOpen(false)}>Add Employee</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card 
            key={employee.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => navigate(`/employees/${employee.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xl">
                    {employee.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.role}</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 mt-2">
                    {employee.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MailIcon className="w-4 h-4" />
                  {employee.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {employee.phone}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium text-sm text-gray-900">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="font-medium text-sm text-gray-900">
                      {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {employee.department === "Sales" && (
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Active Dealings</span>
                      <span className="font-semibold text-blue-600">{employee.activeDealings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Closed Deals</span>
                      <span className="font-semibold text-green-600">{employee.closedDeals}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                      <span className="text-xs text-gray-600">Total Revenue</span>
                      <span className="font-bold text-gray-900">{employee.revenue}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}