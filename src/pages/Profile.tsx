import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, MapPin, Globe, Users, Building2 } from 'lucide-react';

export default function Profile() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isCreator = profile.user_type === 'creator';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {isCreator ? 'Mon Profil Créateur' : 'Profil Entreprise'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations et optimisez votre visibilité
        </p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl">
                {profile.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{profile.full_name}</h2>
                  <Badge variant={isCreator ? "default" : "secondary"}>
                    {isCreator ? 'Créateur' : 'Sponsor'}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">
                  {profile.bio || 'Aucune description ajoutée'}
                </p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {profile.email}
                  </div>
                  {isCreator && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Créateur de contenu
                    </div>
                  )}
                  {!isCreator && profile.company_name && (
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {profile.company_name}
                    </div>
                  )}
                </div>
              </div>
              
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Modifier le profil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Creator Specific Info */}
        {isCreator && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Réseaux sociaux</CardTitle>
                <CardDescription>
                  Vos plateformes et statistiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Aucun réseau social configuré.
                  <br />
                  <Button variant="outline" className="mt-2">
                    Ajouter des réseaux
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catégories de contenu</CardTitle>
                <CardDescription>
                  Vos spécialités et niches
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.content_categories && profile.content_categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.content_categories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune catégorie sélectionnée.
                    <br />
                    <Button variant="outline" className="mt-2">
                      Ajouter des catégories
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Sponsor Specific Info */}
        {!isCreator && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Informations entreprise</CardTitle>
                <CardDescription>
                  Détails de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Entreprise</label>
                  <p className="text-muted-foreground">
                    {profile.company_name || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Secteur d'activité</label>
                  <p className="text-muted-foreground">
                    {profile.industry || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Budget</label>
                  <p className="text-muted-foreground">
                    {profile.budget_range || 'Non spécifié'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne</CardTitle>
                <CardDescription>
                  Vos priorités marketing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.campaign_objectives && profile.campaign_objectives.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.campaign_objectives.map((objective, index) => (
                      <Badge key={index} variant="secondary">
                        {objective}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun objectif défini.
                    <br />
                    <Button variant="outline" className="mt-2">
                      Définir mes objectifs
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle>Complétion du profil</CardTitle>
          <CardDescription>
            Améliorez votre profil pour de meilleurs matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Photo de profil</span>
                <Badge variant={profile.avatar_url ? "default" : "outline"}>
                  {profile.avatar_url ? 'Complété' : 'À ajouter'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Biographie</span>
                <Badge variant={profile.bio ? "default" : "outline"}>
                  {profile.bio ? 'Complété' : 'À ajouter'}
                </Badge>
              </div>
              {isCreator && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Réseaux sociaux</span>
                  <Badge variant="outline">À ajouter</Badge>
                </div>
              )}
              {!isCreator && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Infos entreprise</span>
                  <Badge variant={profile.company_name ? "default" : "outline"}>
                    {profile.company_name ? 'Complété' : 'À ajouter'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Progression: 40%
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-2/5"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}