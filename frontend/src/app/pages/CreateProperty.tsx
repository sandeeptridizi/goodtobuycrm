import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, X, Video, Image as ImageIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

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

export default function CreateProperty() {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos(prev => [...prev, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
    console.log("Form submitted with amenities:", selectedAmenities);
    console.log("Images:", images);
    console.log("Videos:", videos);
    navigate("/properties");
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/properties")}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-500 mt-2">Fill in the details to list a new property</p>
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
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Modern Villa in Downtown"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the property in detail..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select>
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
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="text"
                    placeholder="$850,000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="rentalIncome">Rental Income (if applicable)</Label>
                  <Input
                    id="rentalIncome"
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
                    placeholder="123 Main Street"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="facing">Facing</Label>
                  <Select>
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
                    type="number"
                    placeholder="3"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Built-up Area (sq ft)</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="2500"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="landArea">Land Area (sq ft)</Label>
                  <Input
                    id="landArea"
                    type="number"
                    placeholder="3000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    placeholder="2020"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="buildingAge">Age of Building (years)</Label>
                  <Input
                    id="buildingAge"
                    type="number"
                    placeholder="4"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="floors">Total Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    placeholder="2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="carParking">Car Parking Spaces</Label>
                  <Input
                    id="carParking"
                    type="number"
                    placeholder="2"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="parkingSize">Car Parking Size (sq ft)</Label>
                  <Input
                    id="parkingSize"
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
                  <Select>
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
                  <Select>
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
                  <Select>
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
                {/* Apartment/Unit Amenities */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Apartment/Unit Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenitiesOptions.apartment.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 cursor-pointer"
                      >
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
                      <label
                        key={amenity}
                        className="flex items-center gap-2 cursor-pointer"
                      >
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
                      <label
                        key={amenity}
                        className="flex items-center gap-2 cursor-pointer"
                      >
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

                <div>
                  <Label htmlFor="videos">Upload Videos</Label>
                  <p className="text-sm text-gray-500 mb-2">Add video tours of the property (Max 5 videos)</p>
                  <div className="mt-2">
                    <label htmlFor="videos" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                          <Video className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload videos</p>
                          <p className="text-xs text-gray-400">MP4, MOV, AVI up to 100MB each</p>
                        </div>
                      </div>
                    </label>
                    <Input
                      id="videos"
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                  {videoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                      {videoPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={preview}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
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
                    type="url"
                    placeholder="https://www.instagram.com/p/..."
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Link to Instagram post showcasing the property</p>
                </div>
              </div>
            </CardContent>
          </Card>
 
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/properties")}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Property
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}