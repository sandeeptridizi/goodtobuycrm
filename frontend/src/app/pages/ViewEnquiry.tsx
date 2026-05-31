import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Mail, Phone, Building2, Clock, MessageSquare, Edit, Trash2, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { useEnquiry, useEnquiries } from "../../hooks/useEnquiries";
import { toast } from "sonner";

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

export default function ViewEnquiry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const enquiryId = Number(id);
  const { data: enquiry, loading, error } = useEnquiry(enquiryId);
  const { remove, update } = useEnquiries();

  const handleDelete = async () => {
    try {
      await remove(enquiryId);
      toast.success("Enquiry deleted successfully!");
      navigate("/enquiries");
    } catch (err) {
      toast.error("Failed to delete enquiry");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await update(enquiryId, { status: newStatus });
      toast.success(`Enquiry marked as ${newStatus}`);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-gradient-to-r from-[#00AEEF] to-[#0096d1] text-white";
      case "Contacted":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
      case "Qualified":
        return "bg-gradient-to-r from-purple-400 to-purple-500 text-white";
      case "Scheduled":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white";
      case "Not Interested":
        return "bg-gradient-to-r from-red-400 to-red-500 text-white";
      case "Closed Won":
        return "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white";
      case "Closed Lost":
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
          <p className="text-slate-500">Loading enquiry...</p>
        </div>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enquiry Not Found</h1>
          <Button onClick={() => navigate("/enquiries")}>Back to Enquiries</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/enquiries")} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Enquiries
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {enquiry.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{enquiry.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(enquiry.status)}>{enquiry.status}</Badge>
                <Badge variant="outline">{enquiry.source || 'Direct'}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/enquiries/${enquiryId}/edit`)}>
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
                  <AlertDialogTitle>Delete Enquiry</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this enquiry from {enquiry.name}? This action cannot be undone.
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
                    <p className="text-gray-900">{enquiry.email || 'Not provided'}</p>
                  </div>
                </div>
                {enquiry.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => window.open(`mailto:${enquiry.email}`)}
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
                    <p className="text-gray-900">{enquiry.phone}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(`tel:${enquiry.phone}`)}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enquiry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Property Interest</p>
                  <p className="text-gray-900 font-semibold">{enquiry.property || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#00AEEF]" />
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="text-gray-900 font-semibold">{timeAgo(enquiry.created_at)}</p>
                </div>
              </div>
              {enquiry.message && (
                <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                  <MessageSquare className="w-5 h-5 text-[#00AEEF] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Message</p>
                    <p className="text-gray-700">{enquiry.message}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {enquiry.status === "New" && (
                <>
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-[#00AEEF] to-[#0096d1]"
                    onClick={() => handleStatusChange("Contacted")}
                  >
                    <Phone className="w-4 h-4" />
                    Mark as Contacted
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.open(`mailto:${enquiry.email}`)}
                  >
                    <Mail className="w-4 h-4" />
                    Send Email
                  </Button>
                </>
              )}
              {enquiry.status === "Contacted" && (
                <>
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-green-400 to-green-500"
                    onClick={() => handleStatusChange("Scheduled")}
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Viewing
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleStatusChange("Qualified")}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Qualified
                  </Button>
                </>
              )}
              {enquiry.status === "Scheduled" && (
                <>
                  <Button
                    className="w-full gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500"
                    onClick={() => handleStatusChange("Closed Won")}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Won
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleStatusChange("Closed Lost")}
                  >
                    <XCircle className="w-4 h-4" />
                    Mark as Lost
                  </Button>
                </>
              )}
              {(enquiry.status === "Closed Won" || enquiry.status === "Closed Lost") && (
                <div className="text-center py-4 text-gray-500">
                  <p>This enquiry has been closed.</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => handleStatusChange("New")}
                  >
                    Reopen Enquiry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Lead Source</p>
                <p className="text-gray-900 font-semibold">{enquiry.source || 'Direct'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="text-gray-900 font-semibold">
                  {enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900 font-semibold">
                  {enquiry.updated_at ? new Date(enquiry.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}