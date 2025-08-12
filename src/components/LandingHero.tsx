import { Button } from "@/components/ui/button";
import { MapPin, Volume2, VolumeX } from "lucide-react";
const LandingHero = () => {
  const scrollToReporting = () => {
    document.getElementById('noise-reporting')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 aurora-bg opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 text-4xl animate-float opacity-30">
        <VolumeX className="text-primary" />
      </div>
      <div className="absolute top-40 right-32 text-6xl animate-float opacity-20" style={{
      animationDelay: '1s'
    }}>
        <Volume2 className="text-secondary" />
      </div>
      <div className="absolute bottom-32 left-32 text-5xl animate-float opacity-25" style={{
      animationDelay: '2s'
    }}>
        <MapPin className="text-accent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo/Title */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-black gradient-text mb-4 tracking-tight">
            NoMoreNoise
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Map the noise. Make a difference.
          </p>
        </div>

        {/* Description */}
        <div className="mb-12 animate-fade-in-up" style={{
        animationDelay: '0.2s'
      }}>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Report noise pollution in your area and help create quieter, more peaceful communities. 
            Together, we can make our cities more livable.
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-up" style={{
        animationDelay: '0.4s'
      }}>
          <Button onClick={scrollToReporting} className="neon-button text-lg px-12 py-6 animate-glow-pulse" size="lg">
            <MapPin className="mr-3 h-6 w-6" />
            Get Report Now
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{
        animationDelay: '0.6s'
      }}>
          
          
          
        </div>
      </div>
    </section>;
};
export default LandingHero;