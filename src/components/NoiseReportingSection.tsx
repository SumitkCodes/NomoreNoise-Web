import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Send, AlertTriangle, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const NoiseReportingSection = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [formData, setFormData] = useState({
    noiseType: "",
    description: "",
    intensity: "",
    contact: "",
    location: ""
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          // Auto-fill the location input with coordinates
          setFormData(prev => ({
            ...prev,
            location: `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
          }));
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location.trim()) {
      toast({
        title: "⚠️ Location required",
        description: "Please enter a location for your noise complaint.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.noiseType || !formData.description || !formData.intensity) {
      toast({
        title: "⚠️ Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a complaint.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('complaints')
        .insert({
          noise_type: formData.noiseType,
          description: formData.description,
          intensity: formData.intensity as 'low' | 'medium' | 'high',
          location: formData.location,
          contact: formData.contact || null,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "✅ Complaint submitted successfully!",
        description: "Your noise complaint has been recorded. We'll investigate this issue.",
      });

      // Reset form
      setFormData({
        noiseType: "",
        description: "",
        intensity: "",
        contact: "",
        location: ""
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "❌ Submission failed",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          toast({
            title: "📍 Location detected",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          toast({
            title: "📍 Location permission needed",
            description: "Please allow location access or enter your address manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  if (authLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Report Noise Pollution
            </h2>
            <p className="text-lg text-muted-foreground">
              Please sign in to submit a noise complaint.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="noise-reporting" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Report Noise Pollution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us map noise pollution in your area. Your report makes a difference.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Location Input */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location-input">Location/Address</Label>
                  <Input
                    id="location-input"
                    placeholder="Enter the location of the noise issue"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      location: e.target.value
                    }))}
                    className="bg-background/50 border-border"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleLocationRequest}
                  className="w-full"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Use Current Location
                </Button>
                {userLocation && (
                  <div className="text-xs text-muted-foreground p-2 bg-primary/10 rounded">
                    <strong>Current location:</strong><br />
                    Lat: {userLocation.lat.toFixed(6)}<br />
                    Lng: {userLocation.lng.toFixed(6)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Report Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Noise Complaint Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="noise-type">Noise Type</Label>
                  <Select value={formData.noiseType} onValueChange={(value) => setFormData(prev => ({ ...prev, noiseType: value }))}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select noise type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traffic">Traffic Noise</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="loudspeaker">Loudspeaker/Music</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="neighbors">Neighbors</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intensity">Noise Intensity</Label>
                  <Select value={formData.intensity} onValueChange={(value) => setFormData(prev => ({ ...prev, intensity: value }))}>
                    <SelectTrigger className="bg-background/50 border-border">
                      <SelectValue placeholder="Select intensity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Slightly annoying</SelectItem>
                      <SelectItem value="medium">Medium - Disturbing</SelectItem>
                      <SelectItem value="high">High - Unbearable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the noise issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-background/50 border-border min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Info (Optional)</Label>
                  <Input
                    id="contact"
                    placeholder="Email or phone for updates..."
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    className="bg-background/50 border-border"
                  />
                </div>

                <Button type="submit" className="neon-button w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Complaint
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NoiseReportingSection;