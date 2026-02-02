import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-foreground">404 Page Not Found</h1>
        <p className="text-muted-foreground text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link href="/" className="btn-primary inline-flex">
          Return Home
        </Link>
      </div>
    </div>
  );
}
