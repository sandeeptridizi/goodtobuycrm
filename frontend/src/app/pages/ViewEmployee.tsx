import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, Award, Briefcase, Calendar, Users, Home, Target, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { useEmployee, useEmployees } from "../../hooks/useEmployees";
import { toast } from "sonner";

export default function ViewEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const employeeId = String(id);
  const { data: employee, loading, error } = useEmployee(employeeId);
  const { remove } = useEmployees();

  const handleDelete = async () => {
    try {
      await remove(employeeId);
      toast.success("Employee deleted successfully!");
      navigate("/employees");
    } catch (err) {
      toast.error("Failed to delete employee");
    }
  };

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

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/employees")} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00AEEF] to-purple-600 flex items-center justify-center shadow-lg shadow-[#00AEEF]/30">
              <span className="text-white text-2xl font-bold">
                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-lg text-slate-500">{employee.role || 'Team Member'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                {employee.department && <Badge variant="outline">{employee.department}</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/employees/${employeeId}/edit`)}>
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {employee.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{employee.email || 'Not provided'}</p>
                  </div>
                </div>
                {employee.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(`mailto:${employee.email}`)}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#00AEEF]" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{employee.phone}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(`tel:${employee.phone}`)}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Qualifications</CardTitle>
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
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#00AEEF] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Qualifications</p>
                    <p className="text-gray-900">{employee.qualifications}</p>
                  </div>
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

          <Card className="bg-gradient-to-br from-slate-100 to-gray-100 border-gray-300">
            <CardHeader>
              <CardTitle className="text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => window.open(`mailto:${employee.email}`)}>
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => window.open(`tel:${employee.phone}`)}>
                <Phone className="w-4 h-4" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate(`/employees/${employeeId}/edit`)}>
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}