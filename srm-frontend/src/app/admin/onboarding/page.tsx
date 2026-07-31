'use client';

import { useListRegistrationsQuery, useApproveRegistrationMutation } from '@/services/api/authApiSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

const getDisplayValue = (val: any) => {
  if (val === undefined || val === null || val === '') return 'N/A';
  if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : 'N/A';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const formatLabel = (key: string) => {
  const result = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
  return result.charAt(0).toUpperCase() + result.slice(1).trim();
};

const getFields = (req: any) => {
  const fields: Record<string, any> = {
    'Name': req.shopName,
    'Owner Name': req.ownerName,
    'Email': req.ownerEmail,
    'Contact Number': req.fullData?.phone,
    'Subscription Plan': req.fullData?.plan,
    'Payment Method': req.fullData?.paymentMethod,
    'Number of Branches': req.fullData?.branches,
    'Main Branch': req.fullData?.mainBranch,
    'Shop Location': [req.fullData?.city, req.fullData?.country].filter(Boolean).join(', '),
    'Address': req.fullData?.address,
    'District': req.fullData?.district,
  };

  const knownKeys = ['phone', 'plan', 'paymentMethod', 'branches', 'mainBranch', 'city', 'country', 'address', 'district', 'brn', 'repairTypes', 'shop_name', 'owner', 'tenant_id', 'shop_id'];
  
  if (req.fullData) {
    if (req.fullData.brn) fields['Business Registration Number'] = req.fullData.brn;
    if (req.fullData.repairTypes) fields['Repair Types'] = req.fullData.repairTypes;

    Object.keys(req.fullData).forEach(key => {
      if (!knownKeys.includes(key)) {
        fields[formatLabel(key)] = req.fullData[key];
      }
    });
  }
  return fields;
};

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
                      <CardTitle className="text-xl">Registration Request</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submitted on {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge>{req.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-8 justify-between">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
                      {Object.entries(getFields(req)).map(([label, value]) => (
                        <div key={label} className="break-words">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-1">{label}:</h4>
                          <p className="text-sm font-medium">{getDisplayValue(value)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col justify-start lg:justify-center items-stretch lg:items-end gap-3 min-w-[200px] border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 border-border">
                      <Button 
                        onClick={() => handleApprove(req.approvalToken)} 
                        disabled={isApproving}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Approve Registration
                      </Button>
                      <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
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
