import { MapPin } from 'lucide-react';

interface AdminComplaint {
  id: string;
  created_at: string;
  noise_type: string;
  description: string;
  intensity: 'low' | 'medium' | 'high';
  location: string;
  contact: string | null;
  status: 'submitted' | 'in-progress' | 'resolved';
  latitude: number | null;
  longitude: number | null;
}

interface AdminMapProps {
  complaints: AdminComplaint[];
}

const AdminMap = ({ complaints }: AdminMapProps) => {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="aspect-video bg-gradient-dark rounded-lg border border-border flex flex-col items-center justify-center p-8">
      <div className="text-center mb-6">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold gradient-text mb-2">Interactive Map View</h3>
        <p className="text-muted-foreground">Complaints visualization will be available soon</p>
      </div>
      
      {complaints.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
          <div className="glass-card p-4 text-center">
            <div className="text-red-400 text-xl font-bold">
              {complaints.filter(c => c.intensity === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">High Intensity</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-yellow-400 text-xl font-bold">
              {complaints.filter(c => c.intensity === 'medium').length}
            </div>
            <div className="text-xs text-muted-foreground">Medium Intensity</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-green-400 text-xl font-bold">
              {complaints.filter(c => c.intensity === 'low').length}
            </div>
            <div className="text-xs text-muted-foreground">Low Intensity</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMap;