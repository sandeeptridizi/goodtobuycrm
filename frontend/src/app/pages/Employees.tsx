import { useState } from "react";
import { Search, Mail as MailIcon, Phone, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { useEmployees, Employee } from "../../hooks/useEmployees";

export default function Employees() {
  const { data: employees, loading, error } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredEmployees = employees.filter(
    (employee: Employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm";
      case "Inactive":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm";
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#004274] to-[#00AEEF] bg-clip-text text-transparent">Employees</h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white text-xs font-semibold shadow-lg shadow-[#00AEEF]/30">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </span>
          </div>
          <p className="text-slate-600">Manage your team members</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#00AEEF] shadow-lg shadow-[#00AEEF]/30 transition-all">
          <span className="text-lg">+</span>
          Add Employee
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00AEEF] w-5 h-5" />
          <Input
            placeholder="Search employees with AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 border-[#00AEEF]/20 focus:border-[#00AEEF] focus:ring-[#00AEEF]/20 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load employees. Please refresh.</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No employees found. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee: Employee) => (
            <Card
              key={employee.id}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border-[#00AEEF]/10 hover:border-[#00AEEF]/30 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate(`/employees/${employee.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00AEEF] to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00AEEF]/30">
                    <span className="text-white font-semibold text-xl">
                      {employee.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#004274]">{employee.name}</h3>
                    <p className="text-sm text-slate-500">{employee.role || 'Team Member'}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MailIcon className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    {employee.email || 'Not provided'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 flex-shrink-0 text-[#00AEEF]" />
                    {employee.phone}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#00AEEF]/10">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="font-medium text-sm text-[#004274]">{employee.department || 'N/A'}</p>
                    </div>
                    {employee.join_date && (
                      <div>
                        <p className="text-xs text-slate-500">Joined</p>
                        <p className="font-medium text-sm text-[#004274]">
                          {new Date(employee.join_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>

                  {employee.skills && employee.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded-full bg-[#00AEEF]/10 text-[#004274]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}