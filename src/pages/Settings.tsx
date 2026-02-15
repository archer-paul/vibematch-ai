import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings as SettingsIcon, Bell, Shield, User, CreditCard, Globe, Users, Network, Tags, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EditProfileModal } from '@/components/modals/EditProfileModal';
import { AddNetworksModal } from '@/components/modals/AddNetworksModal';
import { AddCategoriesModal } from '@/components/modals/AddCategoriesModal';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationToast } from '@/components/ui/notification-toast';

export default function Settings() {
  const { profile } = useAuth();
  const isCreator = profile?.user_type === 'creator';
  const { notifications, removeNotification, showSuccess } = useNotifications();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNetworksModalOpen, setIsNetworksModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Creator Profile Section */}
        {isCreator && profile && (
          <>
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
                        <Badge variant="default">Creator</Badge>
                      </div>

                      <p className="text-muted-foreground">
                        {profile.bio || 'No description added'}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {profile.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Content Creator
                        </div>
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
              {/* Social Networks */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Networks</CardTitle>
                  <CardDescription>Your platforms and statistics</CardDescription>
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

              {/* Content Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Categories</CardTitle>
                  <CardDescription>Your specialties and niches</CardDescription>
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
            </div>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Improve your profile for better matches</CardDescription>
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Social Networks</span>
                      <Badge variant="outline">To add</Badge>
                    </div>
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
          </>
        )}

        {/* Profile Settings (sponsor only — creators use the profile header above) */}
        {!isCreator && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" value={profile?.full_name || ''} placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profile?.email || ''} placeholder="Enter your email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" value={profile?.bio || ''} placeholder="Tell us about yourself" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Match Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about new matches</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Campaign Updates</Label>
                <p className="text-sm text-muted-foreground">Updates about your campaigns</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to sponsors</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        {/* Billing Settings (sponsor only) */}
        {profile?.user_type === 'sponsor' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Plan: Pro</p>
                  <p className="text-sm text-muted-foreground">$99/month</p>
                </div>
                <Button variant="outline">Upgrade</Button>
              </div>
              <Separator />
              <Button variant="outline">Manage Billing</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals (creator only) */}
      {isCreator && (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={() => showSuccess('Profile updated successfully!')}
          />
          <AddNetworksModal
            isOpen={isNetworksModalOpen}
            onClose={() => setIsNetworksModalOpen(false)}
            onSave={() => showSuccess('Social networks updated!')}
          />
          <AddCategoriesModal
            isOpen={isCategoriesModalOpen}
            onClose={() => setIsCategoriesModalOpen(false)}
            onSave={() => showSuccess('Categories updated!')}
          />
        </>
      )}

      {/* Notifications */}
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}