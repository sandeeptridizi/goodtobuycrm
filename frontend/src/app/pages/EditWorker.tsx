import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useWorker, useWorkers } from "../../hooks/useWorkers";
import { toast } from "sonner";

export default function EditWorker() {
  const navigate = useNavigate();
  const { id } = useParams();
  const workerId = String(id);

  const { data: worker, loading: loadingWorker, error: loadError } = useWorker(workerId);
  const { update, remove } = useWorkers();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    status: "Active",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (worker && !seeded) {
      setFormData({
        name: worker.name ?? "",
        phone: worker.phone ?? "",
        status: worker.status ?? "Active",
        password: "",
      });
      setSeeded(true);
    }
  }, [worker, seeded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter the worker's name");
      return;
    }
    if (formData.phone && formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        phone: formData.phone,
        status: formData.status,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      await update(workerId, payload);
      toast.success("Field worker updated successfully!");
      navigate("/workers");
    } catch (err) {
      console.error("Failed to update worker:", err);
      toast.error("Failed to update field worker. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Remove ${worker?.name} as a field worker? This cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await remove(workerId);
      toast.success("Field worker removed");
      navigate("/workers");
    } catch (err) {
      console.error("Failed to delete worker:", err);
      toast.error("Failed to remove field worker. Please try again.");
      setIsDeleting(false);
    }
  };

  if (loadingWorker && !seeded) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading field worker...</p>
        </div>
      </div>
    );
  }

  if (loadError || !worker) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Field Worker Not Found</h1>
          <Button onClick={() => navigate("/workers")}>Back to Field Workers</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 pt-6 pb-4 flex-shrink-0">
        <Button
          variant="ghost"
          onClick={() => navigate("/workers")}
          className="gap-2 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Field Workers
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Field Worker</h1>
        <p className="text-gray-500 mt-1">Update details for {worker.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Worker Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876590000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input value={worker.email} disabled className="mt-1 bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                      <SelectTrigger id="status" className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="password">Reset Password</Label>
                    <Input
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Leave blank to keep current password"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Removing..." : "Remove Worker"}
              </Button>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/workers")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
