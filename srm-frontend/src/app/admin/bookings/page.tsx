"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Loader2, CheckCircle, XCircle, Phone, Mail, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  notes: string | null;
  status: string;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiUrl}/v1/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(data.bookings);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load bookings" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${apiUrl}/v1/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      toast({ title: "Status updated successfully" });
      fetchBookings();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update booking status" });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Demo Bookings</h1>
          <p className="text-gray-500 mt-1">Manage scheduled discovery calls and product demos.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-gray-700">{bookings.length} Total Requests</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : bookings.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">No bookings yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm">When users schedule a demo from the marketing site, they will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="border-b bg-gray-50/50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm border">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{format(new Date(booking.date), "EEEE, MMM do, yyyy")}</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.time}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    booking.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                    booking.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                    booking.status === 'SCHEDULED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }
                >
                  {booking.status}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Prospect Details</h4>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">{booking.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${booking.email}`} className="hover:text-indigo-600 hover:underline">{booking.email}</a>
                      </div>
                      {booking.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${booking.phone}`} className="hover:text-indigo-600 hover:underline">{booking.phone}</a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {booking.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Focus Area / Notes</h4>
                      <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50 text-sm text-gray-700 leading-relaxed">
                        "{booking.notes}"
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  {booking.status === 'PENDING' && (
                    <Button onClick={() => updateStatus(booking.id, 'SCHEDULED')} className="bg-indigo-600 hover:bg-indigo-700">
                      Accept & Schedule
                    </Button>
                  )}
                  {booking.status === 'SCHEDULED' && (
                    <Button onClick={() => updateStatus(booking.id, 'COMPLETED')} variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
                    </Button>
                  )}
                  {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                    <Button onClick={() => updateStatus(booking.id, 'CANCELLED')} variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700 ml-auto">
                      <XCircle className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
