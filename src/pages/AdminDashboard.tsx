import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, MapPin, Filter, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminMap from "@/components/AdminMap";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      navigate("/admin");
      return;
    }

    // Fetch complaints from database
    const fetchComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComplaints((data || []) as AdminComplaint[]);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast({
          title: "Error",
          description: "Failed to load complaints.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();

    // Set up real-time subscription
    const channel = supabase
      .channel('complaints-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints'
        },
        (payload) => {
          console.log('Real-time change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setComplaints(prev => [payload.new as AdminComplaint, ...prev]);
            toast({
              title: "🔔 New Complaint",
              description: "A new complaint has been submitted.",
            });
          } else if (payload.eventType === 'UPDATE') {
            setComplaints(prev => 
              prev.map(complaint => 
                complaint.id === payload.new.id 
                  ? payload.new as AdminComplaint
                  : complaint
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setComplaints(prev => 
              prev.filter(complaint => complaint.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/admin");
  };

  const updateComplaintStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus as AdminComplaint['status'] })
        .eq('id', id);

      if (error) throw error;

      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === id 
            ? { ...complaint, status: newStatus as AdminComplaint['status'] }
            : complaint
        )
      );
      
      toast({
        title: "Status updated",
        description: "Complaint status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast({
        title: "Error",
        description: "Failed to update complaint status.",
        variant: "destructive"
      });
    }
  };

  const filteredComplaints = filter === "all" 
    ? complaints 
    : complaints.filter(complaint => complaint.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-500/20 text-green-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'high': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const stats = {
    total: complaints.length,
    submitted: complaints.filter(c => c.status === 'submitted').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage noise pollution complaints</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="neon-button">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Complaints</p>
                  <p className="text-2xl font-bold gradient-text">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.submitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Complaints Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminMap complaints={complaints} />
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Complaints</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40 bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg border border-border bg-background/30 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No complaints found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {filter === "all" ? "No complaints have been submitted yet." : `No complaints with status: ${filter}`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 rounded-lg border border-border bg-background/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{complaint.noise_type}</h3>
                        <p className="text-sm text-muted-foreground">{complaint.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getIntensityColor(complaint.intensity)} variant="outline">
                          {complaint.intensity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(complaint.status)} variant="outline">
                          {complaint.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {complaint.location}
                      </div>
                      <div>
                        Contact: {complaint.contact || 'N/A'}
                      </div>
                      <div>
                        Date: {new Date(complaint.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Select 
                        value={complaint.status} 
                        onValueChange={(value) => updateComplaintStatus(complaint.id, value)}
                      >
                        <SelectTrigger className="w-40 bg-background/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="neon-button">
                        <MapPin className="h-4 w-4 mr-1" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;