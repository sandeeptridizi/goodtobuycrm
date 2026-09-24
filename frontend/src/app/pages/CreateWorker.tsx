import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useWorkers } from "../../hooks/useWorkers";
import { toast } from "sonner";

export default function CreateWorker() {
  const navigate = useNavigate();
  const { create } = useWorkers();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    if (formData.phone && formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      toast.success("Field worker created successfully!");
      navigate("/workers");
    } catch (error: any) {
      console.error("Failed to create worker:", error);
      toast.error(error?.response?.data?.error || "Failed to create field worker. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Add Field Worker</h1>
        <p className="text-gray-500 mt-1">Create login credentials for a new field worker</p>
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
                      placeholder="e.g., Ramesh Kumar"
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
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="worker@goodtobuy.in"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="At least 6 characters"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      placeholder="Re-enter password"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/workers")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Worker"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
