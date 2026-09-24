import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { usePromotion, usePromotions } from "../../hooks/usePromotions";
import { toast } from "sonner";

const FLAT_TYPES = ["Villa", "House", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "Shop", "Commercial Property"];
const FURNISHING_TYPES = ["Fully Furnished", "Semi Furnished", "Un Furnished"];

export default function EditPromotion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const promotionId = String(id);

  const { data: promotion, loading: loadingPromotion, error: loadError } = usePromotion(promotionId);
  const { update, remove } = usePromotions();

  const [formData, setFormData] = useState({
    property_name: "",
    flat_no: "",
    flat_type: "",
    square_feet: "",
    furnishing_type: "",
    address: "",
    location_area: "",
    phone: "",
    alternate_phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (promotion && !seeded) {
      setFormData({
        property_name: promotion.property_name ?? "",
        flat_no: promotion.flat_no ?? "",
        flat_type: promotion.flat_type ?? "",
        square_feet: promotion.square_feet ? String(promotion.square_feet) : "",
        furnishing_type: promotion.furnishing_type ?? "",
        address: promotion.address ?? "",
        location_area: promotion.location_area ?? "",
        phone: promotion.phone ?? "",
        alternate_phone: promotion.alternate_phone ?? "",
      });
      setSeeded(true);
    }
  }, [promotion, seeded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.property_name.trim()) {
      toast.error("Please enter the property / apartment name");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }
    if (formData.alternate_phone && formData.alternate_phone.length !== 10) {
      toast.error("Alternative number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);
    try {
      await update(promotionId, {
        ...formData,
        square_feet: formData.square_feet ? Number(formData.square_feet) : undefined,
      } as any);
      toast.success("Promotion updated successfully!");
      navigate("/promotions");
    } catch (err) {
      console.error("Failed to update promotion:", err);
      toast.error("Failed to update promotion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete the lead for ${promotion?.property_name}? This cannot be undone.`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await remove(promotionId);
      toast.success("Promotion deleted");
      navigate("/promotions");
    } catch (err) {
      console.error("Failed to delete promotion:", err);
      toast.error("Failed to delete promotion. Please try again.");
      setIsDeleting(false);
    }
  };

  if (loadingPromotion && !seeded) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading promotion...</p>
        </div>
      </div>
    );
  }

  if (loadError || !promotion) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Promotion Not Found</h1>
          <Button onClick={() => navigate("/promotions")}>Back to Promotions</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 pt-6 pb-4 flex-shrink-0">
        <Button
          variant="ghost"
          onClick={() => navigate("/promotions")}
          className="gap-2 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Promotions
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Promotion</h1>
        <p className="text-gray-500 mt-1">Update details for {promotion.property_name}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="property_name">Property / Apartment Name *</Label>
                    <Input
                      id="property_name"
                      name="property_name"
                      value={formData.property_name}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="flat_no">Flat No</Label>
                    <Input
                      id="flat_no"
                      name="flat_no"
                      value={formData.flat_no}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flat_type">Flat Type</Label>
                    <Select value={formData.flat_type} onValueChange={(value) => handleSelectChange("flat_type", value)}>
                      <SelectTrigger id="flat_type" className="mt-1">
                        <SelectValue placeholder="Select flat type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FLAT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="square_feet">Square Feet</Label>
                    <Input
                      id="square_feet"
                      name="square_feet"
                      value={formData.square_feet}
                      onChange={handleChange}
                      type="number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="furnishing_type">Furnishing Type</Label>
                    <Select value={formData.furnishing_type} onValueChange={(value) => handleSelectChange("furnishing_type", value)}>
                      <SelectTrigger id="furnishing_type" className="mt-1">
                        <SelectValue placeholder="Select furnishing type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FURNISHING_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location_area">Location / Area</Label>
                    <Input
                      id="location_area"
                      name="location_area"
                      value={formData.location_area}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="alternate_phone">Alternative Number</Label>
                    <Input
                      id="alternate_phone"
                      name="alternate_phone"
                      value={formData.alternate_phone}
                      onChange={handlePhoneChange}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
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
                {isDeleting ? "Deleting..." : "Delete Promotion"}
              </Button>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/promotions")}
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
