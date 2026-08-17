import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LocationAutosuggest } from "../components/LocationAutosuggest";
import { useBuyer, useBuyers } from "../../hooks/useBuyers";
import { useProperties } from "../../hooks/useProperties";
import { toast } from "sonner";

const propertyTypesOptions = [
  "House",
  "Apartment",
  "Villa",
  "Penthouse",
  "Commercial",
  "Land",
  "Townhouse",
  "Studio",
];

const amenitiesOptions = [
  "Air Conditioning",
  "Heating",
  "Balcony",
  "Elevator",
  "Furnished",
  "Swimming Pool",
  "Gym/Fitness Center",
  "Parking",
  "Garden",
  "Security",
  "Internet",
  "Cable TV",
  "Dishwasher",
  "Washer/Dryer",
  "Pet Friendly",
  "Wheelchair Access",
];

export default function EditBuyer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const buyerId = String(id);
  const { data: buyer, loading } = useBuyer(buyerId);
  const { update } = useBuyers();
  const { data: properties } = useProperties();

  const locationSuggestions = useMemo(
    () => Array.from(new Set(properties.map((p) => p.city).filter(Boolean))).sort(),
    [properties]
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    budget_min: "",
    budget_max: "",
    min_bedrooms: "",
    max_bedrooms: "",
    min_bathrooms: "",
    max_bathrooms: "",
    min_area: "",
    lead_source: "",
    notes: "",
    timeline: "",
    financing: "",
  });

  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [amenitiesRequired, setAmenitiesRequired] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (buyer) {
      setFormData({
        name: buyer.name || "",
        email: buyer.email || "",
        phone: buyer.phone || "",
        status: buyer.status || "Active",
        budget_min: buyer.budget_min?.toString() || "",
        budget_max: buyer.budget_max?.toString() || "",
        min_bedrooms: buyer.min_bedrooms?.toString() || "",
        max_bedrooms: buyer.max_bedrooms?.toString() || "",
        min_bathrooms: buyer.min_bathrooms?.toString() || "",
        max_bathrooms: buyer.max_bathrooms?.toString() || "",
        min_area: buyer.min_area?.toString() || "",
        lead_source: buyer.lead_source || "",
        notes: buyer.notes || "",
        timeline: buyer.timeline || "",
        financing: buyer.financing || "",
      });
      setPropertyTypes(buyer.property_types || []);
      setPreferredLocations(buyer.preferred_locations || []);
      setAmenitiesRequired(buyer.amenities_required || []);
    }
  }, [buyer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePropertyType = (type: string) => {
    setPropertyTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenitiesRequired(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addLocation = () => {
    if (newLocation.trim() && !preferredLocations.includes(newLocation.trim())) {
      setPreferredLocations(prev => [...prev, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeLocation = (location: string) => {
    setPreferredLocations(prev => prev.filter(l => l !== location));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter buyer name");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const buyerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        budget_min: parseFloat(formData.budget_min) || 0,
        budget_max: parseFloat(formData.budget_max) || 0,
        property_types: propertyTypes,
        min_bedrooms: parseInt(formData.min_bedrooms) || 0,
        max_bedrooms: parseInt(formData.max_bedrooms) || 0,
        min_bathrooms: parseInt(formData.min_bathrooms) || 0,
        max_bathrooms: parseInt(formData.max_bathrooms) || 0,
        min_area: parseInt(formData.min_area) || 0,
        preferred_locations: preferredLocations,
        lead_source: formData.lead_source,
        notes: formData.notes,
        timeline: formData.timeline,
        financing: formData.financing,
        amenities_required: amenitiesRequired,
      };

      await update(buyerId, buyerData);
      toast.success("Buyer updated successfully!");
      navigate(`/buyers/${buyerId}`);
    } catch (error) {
      console.error("Failed to update buyer:", error);
      toast.error("Failed to update buyer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading buyer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-0">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/buyers/${buyerId}`)}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Buyer
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Buyer</h1>
        <p className="text-gray-500 mt-2">Update buyer information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Buyer Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., John Smith"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lead_source">Lead Source</Label>
                  <Select value={formData.lead_source} onValueChange={(value) => handleSelectChange("lead_source", value)}>
                    <SelectTrigger id="lead_source" className="mt-1">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>
                      <SelectItem value="Advertisement">Advertisement</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="financing">Financing</Label>
                  <Select value={formData.financing} onValueChange={(value) => handleSelectChange("financing", value)}>
                    <SelectTrigger id="financing" className="mt-1">
                      <SelectValue placeholder="Select financing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Mortgage">Mortgage</SelectItem>
                      <SelectItem value="Loan Pre-approved">Loan Pre-approved</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Range */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_min">Minimum Budget</Label>
                  <Input
                    id="budget_min"
                    name="budget_min"
                    value={formData.budget_min}
                    onChange={handleChange}
                    type="number"
                    placeholder="500000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="budget_max">Maximum Budget</Label>
                  <Input
                    id="budget_max"
                    name="budget_max"
                    value={formData.budget_max}
                    onChange={handleChange}
                    type="number"
                    placeholder="1000000"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Property Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Property Types */}
                <div>
                  <Label className="mb-3 block">Property Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {propertyTypesOptions.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={propertyTypes.includes(type)}
                          onChange={() => togglePropertyType(type)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min_bedrooms">Min Bedrooms</Label>
                      <Input
                        id="min_bedrooms"
                        name="min_bedrooms"
                        value={formData.min_bedrooms}
                        onChange={handleChange}
                        type="number"
                        placeholder="2"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_bedrooms">Max Bedrooms</Label>
                      <Input
                        id="max_bedrooms"
                        name="max_bedrooms"
                        value={formData.max_bedrooms}
                        onChange={handleChange}
                        type="number"
                        placeholder="4"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min_bathrooms">Min Bathrooms</Label>
                      <Input
                        id="min_bathrooms"
                        name="min_bathrooms"
                        value={formData.min_bathrooms}
                        onChange={handleChange}
                        type="number"
                        placeholder="1"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_bathrooms">Max Bathrooms</Label>
                      <Input
                        id="max_bathrooms"
                        name="max_bathrooms"
                        value={formData.max_bathrooms}
                        onChange={handleChange}
                        type="number"
                        placeholder="3"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_area">Minimum Area (sq ft)</Label>
                    <Input
                      id="min_area"
                      name="min_area"
                      value={formData.min_area}
                      onChange={handleChange}
                      type="number"
                      placeholder="1500"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferred Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Preferred Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <LocationAutosuggest
                  value={newLocation}
                  onChange={setNewLocation}
                  onEnter={addLocation}
                  onSelect={(location) => {
                    setPreferredLocations(prev =>
                      prev.includes(location) ? prev : [...prev, location]
                    );
                    setNewLocation("");
                  }}
                  suggestions={locationSuggestions}
                  excludeValues={preferredLocations}
                  placeholder="Add a preferred location"
                />
                <Button type="button" onClick={addLocation} variant="outline">
                  Add
                </Button>
              </div>
              {preferredLocations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preferredLocations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00AEEF]/10 text-[#004274] text-sm"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(location)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Required Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Required Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenitiesOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={amenitiesRequired.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline">Purchase Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleSelectChange("timeline", value)}>
                    <SelectTrigger id="timeline" className="mt-1">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="Within 1 Month">Within 1 Month</SelectItem>
                      <SelectItem value="Within 3 Months">Within 3 Months</SelectItem>
                      <SelectItem value="Within 6 Months">Within 6 Months</SelectItem>
                      <SelectItem value="Within 1 Year">Within 1 Year</SelectItem>
                      <SelectItem value="Exploring">Exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes about this buyer..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/buyers/${buyerId}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
