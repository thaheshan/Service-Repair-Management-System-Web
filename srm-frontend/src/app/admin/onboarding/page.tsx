'use client';

import { useListRegistrationsQuery, useApproveRegistrationMutation } from '@/services/api/authApiSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

export default function AdminOnboardingPage() {
  const { data: registrations, isLoading, refetch } = useListRegistrationsQuery('PENDING');
  const [approveRegistration, { isLoading: isApproving }] = useApproveRegistrationMutation();

  const handleApprove = async (token: string) => {
    try {
      await approveRegistration(token).unwrap();
      toast.success('Registration approved successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to approve registration');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pending Registrations</h1>
          <Badge variant="outline" className="px-3 py-1">
            {registrations?.length || 0} Requests
          </Badge>
        </div>

        <div className="grid gap-6">
          {registrations && registrations.length > 0 ? (
            registrations.map((req: any) => (
              <Card key={req.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{req.shopName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submitted on {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge>{req.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Owner Details</h4>
                        <p className="font-medium">{req.ownerName}</p>
                        <p className="text-sm">{req.ownerEmail}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Business Info</h4>
                        <p className="text-sm">Plan: <span className="font-medium capitalize">{req.fullData?.plan || 'Starter'}</span></p>
                        <p className="text-sm">Location: {req.fullData?.city}, {req.fullData?.country}</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-end gap-3">
                      <Button 
                        onClick={() => handleApprove(req.approvalToken)} 
                        disabled={isApproving}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Approve Registration
                      </Button>
                      <Button variant="outline" className="w-full md:w-auto text-destructive border-destructive hover:bg-destructive/10">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">No pending registration requests found.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
