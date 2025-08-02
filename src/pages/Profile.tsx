import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, MapPin, Globe, Users, Building2, Network, Tags } from 'lucide-react';
import { EditProfileModal } from '@/components/modals/EditProfileModal';
import { AddNetworksModal } from '@/components/modals/AddNetworksModal';
import { AddCategoriesModal } from '@/components/modals/AddCategoriesModal';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationToast } from '@/components/ui/notification-toast';

export default function Profile() {
  const { profile } = useAuth();
  const { notifications, removeNotification, showSuccess } = useNotifications();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNetworksModalOpen, setIsNetworksModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

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
          {isCreator ? 'Creator Profile' : 'Company Profile'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your information and optimize your visibility
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
                    {isCreator ? 'Creator' : 'Sponsor'}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">
                  {profile.bio || 'No description added'}
                </p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {profile.email}
                  </div>
                  {isCreator && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Content Creator
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
              
              <Button onClick={() => setIsEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
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
                <CardTitle>Social Networks</CardTitle>
                <CardDescription>
                  Your platforms and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile.social_handles && Object.keys(profile.social_handles).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(profile.social_handles).map(([platform, handle]) => (
                      <div key={platform} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Network className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium capitalize">{platform}</div>
                            <div className="text-sm text-muted-foreground">@{String(handle)}</div>
                          </div>
                        </div>
                        {profile.follower_counts?.[platform] && (
                          <Badge variant="outline">
                            {Number(profile.follower_counts[platform]).toLocaleString()} followers
                          </Badge>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4" onClick={() => setIsNetworksModalOpen(true)}>
                      <Network className="mr-2 h-4 w-4" />
                      Manage Networks
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No social networks configured.
                    <br />
                    <Button variant="outline" className="mt-2" onClick={() => setIsNetworksModalOpen(true)}>
                      <Network className="mr-2 h-4 w-4" />
                      Add Networks
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
                <CardDescription>
                  Your specialties and niches
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
                    No categories selected.
                    <br />
                    <Button variant="outline" className="mt-2" onClick={() => setIsCategoriesModalOpen(true)}>
                      <Tags className="mr-2 h-4 w-4" />
                      Add Categories
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
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Details of your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <p className="text-muted-foreground">
                    {profile.company_name || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Industry</label>
                  <p className="text-muted-foreground">
                    {profile.industry || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Budget</label>
                  <p className="text-muted-foreground">
                    {profile.budget_range || 'Not specified'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Objectives</CardTitle>
                <CardDescription>
                  Your marketing priorities
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
                    No objectives defined.
                    <br />
                    <Button variant="outline" className="mt-2" onClick={() => showSuccess('Cette fonctionnalité sera bientôt disponible!')}>
                      Define Objectives
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
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>
            Improve your profile for better matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Profile Picture</span>
                <Badge variant={profile.avatar_url ? "default" : "outline"}>
                  {profile.avatar_url ? 'Completed' : 'To add'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Biography</span>
                <Badge variant={profile.bio ? "default" : "outline"}>
                  {profile.bio ? 'Completed' : 'To add'}
                </Badge>
              </div>
              {isCreator && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Social Networks</span>
                  <Badge variant="outline">To add</Badge>
                </div>
              )}
              {!isCreator && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Company Info</span>
                  <Badge variant={profile.company_name ? "default" : "outline"}>
                    {profile.company_name ? 'Completed' : 'To add'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Progress: 40%
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-2/5"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onSave={() => showSuccess('Profil mis à jour avec succès!')}
      />
      <AddNetworksModal 
        isOpen={isNetworksModalOpen} 
        onClose={() => setIsNetworksModalOpen(false)}
        onSave={() => showSuccess('Réseaux sociaux mis à jour!')}
      />
      <AddCategoriesModal 
        isOpen={isCategoriesModalOpen} 
        onClose={() => setIsCategoriesModalOpen(false)}
        onSave={() => showSuccess('Catégories mises à jour!')}
      />

      {/* Notifications */}
      <NotificationToast 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}