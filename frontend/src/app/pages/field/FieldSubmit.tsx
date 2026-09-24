import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Camera, CheckCircle2, LogOut, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { workerPromotions } from "../../../lib/api";
import { toast } from "sonner";
import logo from "../../../assets/GoodToBuy Logo.png";

const FLAT_TYPES = ["Villa", "House", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "Shop", "Commercial Property"];
const FURNISHING_TYPES = ["Fully Furnished", "Semi Furnished", "Un Furnished"];

const EMPTY_FORM = {
  property_name: "",
  flat_no: "",
  flat_type: "",
  square_feet: "",
  furnishing_type: "",
  address: "",
  location_area: "",
  phone: "",
  alternate_phone: "",
};

export default function FieldSubmit() {
  const navigate = useNavigate();
  const [worker, setWorker] = useState<{ id: string; name: string; email: string } | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("worker_token");
    const storedWorker = localStorage.getItem("worker_user");
    if (!token || !storedWorker) {
      navigate("/field/login");
      return;
    }
    setWorker(JSON.parse(storedWorker));

    workerPromotions
      .getCount()
      .then((data) => setCount(data.count))
      .catch(() => {
        // Non-fatal — the counter is a nice-to-have, not required to submit.
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("worker_token");
    localStorage.removeItem("worker_user");
    navigate("/field/login");
  };

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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported on this device");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("Could not get your location. Please enable location access and try again.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setLocation(null);
    setPhotoBase64(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.property_name.trim()) {
      toast.error("Please enter the property / apartment name");
      return;
    }
    if (!formData.flat_type) {
      toast.error("Please select a flat type");
      return;
    }
    if (!formData.furnishing_type) {
      toast.error("Please select a furnishing type");
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
    if (!location) {
      toast.error("Please capture the GPS location");
      return;
    }
    if (!photoBase64) {
      toast.error("Please add a photo of the sale board");
      return;
    }

    setIsSubmitting(true);
    try {
      await workerPromotions.submit({
        property_name: formData.property_name.trim(),
        flat_no: formData.flat_no.trim(),
        flat_type: formData.flat_type,
        square_feet: formData.square_feet ? Number(formData.square_feet) : null,
        furnishing_type: formData.furnishing_type,
        address: formData.address.trim(),
        location_area: formData.location_area.trim(),
        phone: formData.phone.trim(),
        alternate_phone: formData.alternate_phone.trim(),
        gps_lat: location.lat,
        gps_lng: location.lng,
        photo_base64: photoBase64,
      });
      toast.success("Property submitted!");
      resetForm();
      const data = await workerPromotions.getCount();
      setCount(data.count);
    } catch (err: any) {
      console.error("Failed to submit property:", err);
      toast.error(err?.response?.data?.error || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!worker) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 sm:py-10">
      {/* Full-bleed on phones; a centered, card-like "app" on wider screens so the
          header doesn't stretch into a bare color bar across a desktop viewport. */}
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-slate-50 to-blue-50/30 pb-10 sm:rounded-2xl sm:shadow-2xl sm:overflow-hidden">
        <div className="bg-gradient-to-b from-[#004274] to-[#002847] text-white px-5 py-5 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <img src={logo} alt="GoodToBuy" className="h-9 w-auto object-contain bg-white rounded-lg px-2 py-1" />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/10 flex-shrink-0"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3">
            <p className="font-semibold text-sm truncate">{worker.name}</p>
            <p className="text-xs text-blue-200">Field Worker</p>
          </div>
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00AEEF] flex-shrink-0" />
            <p className="text-sm">
              Properties submitted: <span className="font-bold">{count ?? "—"}</span>
            </p>
          </div>
        </div>

        <div className="px-4 pt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New Property Lead</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="property_name">Property / Apartment Name *</Label>
                <Input
                  id="property_name"
                  name="property_name"
                  value={formData.property_name}
                  onChange={handleChange}
                  placeholder="e.g., Green Valley Apartments"
                  className="mt-1 h-12"
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
                  placeholder="e.g., A-203"
                  className="mt-1 h-12"
                />
              </div>

              <div>
                <Label htmlFor="flat_type">Flat Type *</Label>
                <Select value={formData.flat_type} onValueChange={(value) => handleSelectChange("flat_type", value)}>
                  <SelectTrigger id="flat_type" className="mt-1 h-12">
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
                  inputMode="numeric"
                  placeholder="e.g., 1200"
                  className="mt-1 h-12"
                />
              </div>

              <div>
                <Label htmlFor="furnishing_type">Furnishing Type *</Label>
                <Select value={formData.furnishing_type} onValueChange={(value) => handleSelectChange("furnishing_type", value)}>
                  <SelectTrigger id="furnishing_type" className="mt-1 h-12">
                    <SelectValue placeholder="Select furnishing type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FURNISHING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="mt-1 h-12"
                />
              </div>

              <div>
                <Label htmlFor="location_area">Location / Area</Label>
                <Input
                  id="location_area"
                  name="location_area"
                  value={formData.location_area}
                  onChange={handleChange}
                  placeholder="e.g., Whitefield"
                  className="mt-1 h-12"
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
                  placeholder="9876543210"
                  className="mt-1 h-12"
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
                  placeholder="Optional"
                  className="mt-1 h-12"
                />
              </div>

              <div>
                <Label>GPS Location *</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="w-full mt-1 h-12 gap-2 justify-start"
                >
                  <MapPin className="w-4 h-4 text-[#00AEEF]" />
                  {locating
                    ? "Getting location..."
                    : location
                    ? `Lat ${location.lat.toFixed(5)}, Lng ${location.lng.toFixed(5)}`
                    : "Get Current Location"}
                </Button>
                {locationError && <p className="text-sm text-red-500 mt-1">{locationError}</p>}
              </div>

              <div>
                <Label>Photo of the Sale Board *</Label>
                <label className="mt-1 flex items-center justify-center gap-2 h-32 border-2 border-dashed border-[#00AEEF]/40 rounded-lg cursor-pointer bg-[#00AEEF]/5 overflow-hidden">
                  {photoBase64 ? (
                    <img src={photoBase64} alt="Sale board" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-sm">Tap to take a photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-[#00AEEF] to-[#0096d1] hover:from-[#0096d1] hover:to-[#007bb8] text-white font-semibold shadow-lg shadow-[#00AEEF]/30"
              >
                {isSubmitting ? "Submitting..." : "Submit Property"}
              </Button>
            </CardContent>
          </Card>
        </form>
        </div>
      </div>
    </div>
  );
}
