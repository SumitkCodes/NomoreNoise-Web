import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, User, LogOut } from "lucide-react";
import LandingHero from "@/components/LandingHero";
import NoiseReportingSection from "@/components/NoiseReportingSection";
import MyComplaints from "@/components/MyComplaints";
import Credits from "@/components/Credits";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  console.log("Index component rendering, user:", user);
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold gradient-text">NoMoreNoise</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  <Button onClick={handleSignOut} variant="ghost" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
              <Link to="/admin">
                <Button variant="outline" size="sm" className="neon-button">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Add top padding to account for fixed nav */}
      <div className="pt-16">
        <LandingHero />
        <NoiseReportingSection />
        <MyComplaints />
        <Credits />
      </div>
    </div>
  );
};

export default Index;
