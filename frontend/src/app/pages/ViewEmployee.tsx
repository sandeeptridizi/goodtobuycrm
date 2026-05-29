import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, Award, Briefcase, Calendar, TrendingUp, Users, Home, DollarSign, Target, BarChart3, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useEmployee, Employee } from "../../hooks/useEmployees";

export default function ViewEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const employeeId = Number(id);
  const { data: employee, loading, error } = useEmployee(employeeId);

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading employee...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <Button onClick={() => navigate("/employees")}>Back to Employees</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white";
      case "Inactive":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/employees")} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00AEEF] to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-xl text-gray-600 mt-1">{employee.role || 'Team Member'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
                {employee.department && <Badge variant="secondary">{employee.department}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1]">
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Department</p>
                <p className="text-xl font-bold text-blue-900 mt-1">{employee.department || 'N/A'}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <Briefcase className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Role</p>
                <p className="text-xl font-bold text-green-900 mt-1">{employee.role || 'N/A'}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <Award className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Languages</p>
                <p className="text-xl font-bold text-purple-900 mt-1">
                  {employee.languages?.length || 0}
                </p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Skills</p>
                <p className="text-xl font-bold text-amber-900 mt-1">
                  {employee.skills?.length || 0}
                </p>
              </div>
              <div className="bg-amber-200 p-3 rounded-full">
                <Target className="w-6 h-6 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{employee.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{employee.phone}</p>
                  </div>
                </div>
                {employee.address && (
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-[#00AEEF]" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">{employee.address}</p>
                    </div>
                  </div>
                )}
                {employee.emergency_contact && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#00AEEF]" />
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="text-gray-900">{employee.emergency_contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Skills & Qualifications</CardTitle>
                <Sparkles className="w-4 h-4 text-[#00AEEF]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.skills && employee.skills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 bg-[#00AEEF]/10 text-[#004274]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {employee.qualifications && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Qualifications</p>
                  <p className="text-gray-900">{employee.qualifications}</p>
                </div>
              )}
              {employee.languages && employee.languages.length > 0 && (
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
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {employee.join_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(employee.join_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
              {employee.department && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-900 font-semibold">{employee.department}</p>
                  </div>
                </div>
              )}
              {employee.role && (
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-900 font-semibold">{employee.role}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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