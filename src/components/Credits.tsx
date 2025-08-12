import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail } from "lucide-react";

const Credits = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Project Credits</h2>
          <h3 className="text-xl font-semibold text-foreground mb-2">NoMoreNoise</h3>
          <p className="text-muted-foreground">Map the noise. Make a difference.</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Contributors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nandini Das */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-foreground">Nandini Das</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>nandini22das@gmail.com</span>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Designed the user interface and user experience (UI/UX)</li>
                  <li>• Implemented core frontend components using React.js</li>
                  <li>• Created report submission form and integrated map feature</li>
                  <li>• Worked on styling and responsive design for mobile and desktop</li>
                </ul>
              </div>

              {/* Sumit Das */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Sumit Das</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Developed backend functionality and data handling</li>
                  <li>• Implemented admin panel with login system and dashboard</li>
                  <li>• Integrated localStorage-based authentication for admin access</li>
                  <li>• Set up project structure, routing, and state management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Credits;