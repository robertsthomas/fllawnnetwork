'use client';

import { useQuery } from 'convex/react';
import { BarChart3, Eye, MessageSquare, Phone, Star, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { usePostHog } from 'posthog-js/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface ProviderAnalyticsDashboardProps {
  providerId: Id<'providers'>;
}

export default function ProviderAnalyticsDashboard({ providerId }: ProviderAnalyticsDashboardProps) {
  const posthog = usePostHog();
  const provider = useQuery(api.providers.getProviderById, { id: providerId });
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    contactClicks: 0,
    phoneClicks: 0,
    formSubmissions: 0,
    emailClicks: 0,
    websiteClicks: 0,
  });

  useEffect(() => {
    if (posthog && providerId) {
      // Fetch analytics data from PostHog
      // This is a simplified example - in production, you'd use PostHog's API
      // to fetch real analytics data for the specific provider
      setAnalytics({
        profileViews: Math.floor(Math.random() * 500) + 50,
        contactClicks: Math.floor(Math.random() * 50) + 10,
        phoneClicks: Math.floor(Math.random() * 30) + 5,
        formSubmissions: Math.floor(Math.random() * 20) + 3,
        emailClicks: Math.floor(Math.random() * 15) + 2,
        websiteClicks: Math.floor(Math.random() * 40) + 8,
      });
    }
  }, [posthog, providerId]);

  if (!provider) {
    return <div>Loading analytics...</div>;
  }

  const totalLeads = analytics.contactClicks + analytics.phoneClicks + analytics.formSubmissions;
  const conversionRate = analytics.profileViews > 0 ? ((totalLeads / analytics.profileViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your listing performance and leads</p>
        </div>
        <div className="flex items-center space-x-2">
          {provider.featured && (
            <Badge className="bg-accent-500 text-white">Featured Provider</Badge>
          )}
          <Badge className={`${provider.isClaimed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {provider.isClaimed ? 'Claimed' : 'Unclaimed'}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.profileViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(provider.totalScore || 0).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              From {provider.reviewsCount || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>How customers are contacting you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Contact Form</span>
              </div>
              <span className="text-sm font-medium">{analytics.formSubmissions}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-500" />
                <span className="text-sm">Phone Calls</span>
              </div>
              <span className="text-sm font-medium">{analytics.phoneClicks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span className="text-sm">General Contact</span>
              </div>
              <span className="text-sm font-medium">{analytics.contactClicks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium text-sm">Update Business Info</div>
              <div className="text-xs text-gray-600">Edit hours, contact details, services</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium text-sm">Add Project Photos</div>
              <div className="text-xs text-gray-600">Showcase your recent work</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium text-sm">Respond to Reviews</div>
              <div className="text-xs text-gray-600">Engage with customer feedback</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium text-sm">Upgrade to Featured</div>
              <div className="text-xs text-gray-600">Get more visibility and leads</div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest interactions with your listing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
              <Eye className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Profile viewed</p>
                <p className="text-xs text-gray-600">Someone viewed your business profile</p>
              </div>
              <span className="text-xs text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">New contact form submission</p>
                <p className="text-xs text-gray-600">Customer inquired about lawn mowing service</p>
              </div>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50">
              <Phone className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Phone number clicked</p>
                <p className="text-xs text-gray-600">Potential customer clicked to call</p>
              </div>
              <span className="text-xs text-gray-500">3 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 