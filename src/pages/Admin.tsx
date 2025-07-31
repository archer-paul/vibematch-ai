import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function Admin() {
  const { profile } = useAuth();

  // TODO: Check admin status from database
  if (false) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Accès Refusé</h2>
            <p className="text-muted-foreground">
              Cette page est réservée aux administrateurs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Panel Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyses Cerebras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,247</div>
            <p className="text-sm text-muted-foreground">Profils analysés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Précision IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.3%</div>
            <p className="text-sm text-muted-foreground">Taux de matching</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,543</div>
            <p className="text-sm text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}