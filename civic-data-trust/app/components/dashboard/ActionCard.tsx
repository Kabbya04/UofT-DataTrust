import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

interface ActionCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const ActionCard = ({ href, icon: Icon, title, description }: ActionCardProps) => (
  <Link href={href} className="group">
    {/* --- CORRECTED: No more hard-coded dark classes. Uses theme variables only. --- */}
    <Card className="relative h-full bg-card border border-border rounded-xl 
                   overflow-hidden
                   transition-all duration-300 ease-in-out 
                   transform hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10">
      
      <div className="absolute top-0 left-0 h-full w-1 bg-primary 
                     opacity-0 group-hover:opacity-100 
                     transition-opacity duration-300" 
      />
      <div className="pl-4">
        <CardHeader>
          {/* This part was already correct */}
          <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 
                         flex items-center justify-center 
                         transition-colors duration-300 group-hover:bg-primary/20">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-mono-caps group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm font-mono">
            {description}
          </p>
        </CardContent>
      </div>
    </Card>
  </Link>
);