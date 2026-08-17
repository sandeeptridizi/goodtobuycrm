import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, X, Video, Image as ImageIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useProperty, useProperties } from "../../hooks/useProperties";
import { toast } from "sonner";

const amenitiesOptions = {
  apartment: [
    "Air Conditioning",
    "Heating",
    "Balcony",
    "Elevator",
    "Furnished",
    "Intercom",
    "Cable TV",
    "Internet",
    "Dishwasher",
    "Microwave",
    "Refrigerator",
    "Washer/Dryer",
  ],
  community: [
    "Swimming Pool",
    "Gym/Fitness Center",
    "Clubhouse",
    "Children's Play Area",
    "Jogging Track",
    "Tennis Court",
    "Basketball Court",
    "24/7 Security",
    "CCTV Surveillance",
    "Visitor Parking",
    "Landscape Garden",
    "Community Hall",
  ],
  building: [
    "Power Backup",
    "Lift/Elevator",
    "Fire Safety",
    "Waste Disposal",
    "Rain Water Harvesting",
    "Solar Panels",
    "Water Softener Plant",
    "Maintenance Staff",
    "Intercom Facility",
    "Reserved Parking",
  ],
};

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const propertyId = String(id);
  const { data: property, loading: propertyLoading, error: propertyError } = useProperty(propertyId);
  const { update } = useProperties();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    price: "",
    rentalIncome: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    facing: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    landArea: "",
    yearBuilt: "",
    buildingAge: "",
    floors: "",
    carParking: "",
    parkingSize: "",
    waterSource: "",
    drainType: "",
    boundary: "",
    status: "",
    youtubeUrl: "",
    instagramUrl: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        propertyType: property.type || "",
        price: property.price?.toString() || "",
        rentalIncome: property.rental_income?.toString() || "",
        address: property.address || "",
        city: property.city || "",
        country: property.country || "",
        zipCode: property.zip_code || "",
        facing: property.facing || "",
        bedrooms: property.bedrooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        area: property.area?.toString() || "",
        landArea: property.land_area?.toString() || "",
        yearBuilt: property.year_built?.toString() || "",
        buildingAge: property.building_age?.toString() || "",
        floors: property.floors?.toString() || "",
        carParking: property.car_parking?.toString() || "",
        parkingSize: property.parking_size?.toString() || "",
        waterSource: property.water_source || "",
        drainType: property.drain_type || "",
        boundary: property.boundary_wall || "",
        status: property.status || "",
        youtubeUrl: property.youtube_url || "",
        instagramUrl: property.instagram_url || "",
      });
      setSelectedAmenities(property.amenities || []);
      setImagePreviews(property.images || []);
    }
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const year = parseInt(formData.yearBuilt, 10);
    const age = year > 0 ? Math.max(0, new Date().getFullYear() - year) : "";
    setFormData(prev => (prev.buildingAge === String(age) ? prev : { ...prev, buildingAge: String(age) }));
  }, [formData.yearBuilt]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a property title");
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.propertyType,
        price: parsePrice(formData.price),
        status: formData.status,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zip_code: formData.zipCode,
        facing: formData.facing,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseInt(formData.area) || 0,
        land_area: parseInt(formData.landArea) || 0,
        year_built: parseInt(formData.yearBuilt) || 0,
        building_age: parseInt(formData.buildingAge) || 0,
        floors: parseInt(formData.floors) || 0,
        car_parking: parseInt(formData.carParking) || 0,
        parking_size: parseInt(formData.parkingSize) || 0,
        water_source: formData.waterSource,
        drain_type: formData.drainType,
        boundary_wall: formData.boundary,
        rental_income: parsePrice(formData.rentalIncome),
        amenities: selectedAmenities,
        images: imagePreviews,
        youtube_url: formData.youtubeUrl,
        instagram_url: formData.instagramUrl,
      };

      await update(propertyId, propertyData);
      toast.success("Property updated successfully!");
      navigate(`/properties/${propertyId}`);
    } catch (error) {
      console.error("Failed to update property:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (propertyLoading) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00AEEF] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Loading property...</p>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Button onClick={() => navigate("/properties")}>Back to Properties</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-0">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/properties/${propertyId}`)}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Property
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-500 mt-2">Update property details</p>
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
                <div className="md:col-span-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Modern Villa in Downtown"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the property in detail..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange("propertyType", value)}>
                    <SelectTrigger id="propertyType" className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="text"
                    placeholder="$850,000"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rentalIncome">Rental Income (if applicable)</Label>
                  <Input
                    id="rentalIncome"
                    name="rentalIncome"
                    value={formData.rentalIncome}
                    onChange={handleChange}
                    type="text"
                    placeholder="$2,500/month"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United States"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="facing">Facing</Label>
                  <Select value={formData.facing} onValueChange={(value) => handleSelectChange("facing", value)}>
                    <SelectTrigger id="facing" className="mt-1">
                      <SelectValue placeholder="Select facing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">North</SelectItem>
                      <SelectItem value="south">South</SelectItem>
                      <SelectItem value="east">East</SelectItem>
                      <SelectItem value="west">West</SelectItem>
                      <SelectItem value="northeast">North East</SelectItem>
                      <SelectItem value="northwest">North West</SelectItem>
                      <SelectItem value="southeast">South East</SelectItem>
                      <SelectItem value="southwest">South West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    type="number"
                    placeholder="3"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    type="number"
                    placeholder="2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Built-up Area (sq ft)</Label>
                  <Input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    type="number"
                    placeholder="2500"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="landArea">UDS / Land Area (Sq yards)</Label>
                  <Input
                    id="landArea"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    type="number"
                    placeholder="3000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    type="number"
                    placeholder="2020"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="buildingAge">Age of Building (years)</Label>
                  <Input
                    id="buildingAge"
                    name="buildingAge"
                    value={formData.buildingAge}
                    readOnly
                    type="number"
                    placeholder="Calculated from Year Built"
                    className="mt-1 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="floors">Total Floors</Label>
                  <Input
                    id="floors"
                    name="floors"
                    value={formData.floors}
                    onChange={handleChange}
                    type="number"
                    placeholder="2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="carParking">Car Parking Spaces</Label>
                  <Input
                    id="carParking"
                    name="carParking"
                    value={formData.carParking}
                    onChange={handleChange}
                    type="number"
                    placeholder="2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="parkingSize">Car Parking Size (sq ft)</Label>
                  <Input
                    id="parkingSize"
                    name="parkingSize"
                    value={formData.parkingSize}
                    onChange={handleChange}
                    type="number"
                    placeholder="200"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilities & Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="waterSource">Water Source</Label>
                  <Select value={formData.waterSource} onValueChange={(value) => handleSelectChange("waterSource", value)}>
                    <SelectTrigger id="waterSource" className="mt-1">
                      <SelectValue placeholder="Select water source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">Municipal Supply</SelectItem>
                      <SelectItem value="borewell">Borewell</SelectItem>
                      <SelectItem value="both">Municipal + Borewell</SelectItem>
                      <SelectItem value="tank">Water Tank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="drainType">Drain Type</Label>
                  <Select value={formData.drainType} onValueChange={(value) => handleSelectChange("drainType", value)}>
                    <SelectTrigger id="drainType" className="mt-1">
                      <SelectValue placeholder="Select drain type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Drainage</SelectItem>
                      <SelectItem value="septic">Septic Tank</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="boundary">Boundary</Label>
                  <Select value={formData.boundary} onValueChange={(value) => handleSelectChange("boundary", value)}>
                    <SelectTrigger id="boundary" className="mt-1">
                      <SelectValue placeholder="Select boundary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walled">Walled</SelectItem>
                      <SelectItem value="fenced">Fenced</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Apartment/Unit Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenitiesOptions.apartment.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Community Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenitiesOptions.community.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Building Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenitiesOptions.building.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <p className="text-sm text-gray-500 mb-2">Add photos of the property (Max 20 images)</p>
                  <div className="mt-2">
                    <label htmlFor="images" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload images</p>
                          <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 10MB each</p>
                        </div>
                      </div>
                    </label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media & Video Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="youtubeUrl">YouTube Video URL</Label>
                  <Input
                    id="youtubeUrl"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Add a YouTube video tour or walkthrough of the property</p>
                </div>
                <div>
                  <Label htmlFor="instagramUrl">Instagram Post/Reel URL</Label>
                  <Input
                    id="instagramUrl"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleChange}
                    type="url"
                    placeholder="https://www.instagram.com/p/..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Link to Instagram post showcasing the property</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/properties/${propertyId}`)}
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