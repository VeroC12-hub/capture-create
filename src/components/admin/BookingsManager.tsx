import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2, Mail, Phone, Calendar, MessageSquare, Trash2,
  FileDown, Search, BarChart3, TrendingUp, CheckCircle, Clock
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type Booking = Tables<"bookings">;

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
  { value: "completed", label: "Completed", color: "bg-blue-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

// Define price mapping for services
const SERVICE_PRICES: Record<string, number> = {
  // Wedding Photography
  "weddings-photography-Classic Package": 5000,
  "weddings-photography-Premium Package": 8000,
  "weddings-photography-Luxury Package": 12000,
  "weddings-photography-Ultimate Package": 18000,

  // Wedding Videography
  "weddings-videography-Cinematic Highlights": 6000,
  "weddings-videography-Full Day Coverage": 10000,
  "weddings-videography-Premium Film": 15000,
  "weddings-videography-Ultimate Production": 22000,

  // Events
  "events-Birthdays & Anniversaries": 2500,
  "events-Naming Ceremonies": 2000,
  "events-Festive Events": 3500,

  // Professional
  "professional-Corporate Events": 2200,
  "professional-Headshots & Portraits": 500,
  "professional-Product Photography": 200,
};

export const BookingsManager = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchBookings = async () => {
    setIsLoading(true);
    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching bookings:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setBookings(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  // Filtered bookings based on search and date range
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.client_phone.includes(searchQuery);

      const bookingDate = new Date(booking.created_at);
      const matchesDateFrom = !dateFrom || bookingDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || bookingDate <= new Date(dateTo);

      return matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }, [bookings, searchQuery, dateFrom, dateTo]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const total = filteredBookings.length;
    const byStatus = STATUS_OPTIONS.map((status) => ({
      ...status,
      count: filteredBookings.filter((b) => b.status === status.value).length,
    }));

    const byService: Record<string, number> = {};
    filteredBookings.forEach((booking) => {
      const serviceCategory = booking.service_type.split("-")[0];
      byService[serviceCategory] = (byService[serviceCategory] || 0) + 1;
    });

    const totalRevenue = filteredBookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, booking) => {
        const price = SERVICE_PRICES[booking.service_type] || 0;
        return sum + price;
      }, 0);

    const pendingRevenue = filteredBookings
      .filter((b) => b.status === "pending")
      .reduce((sum, booking) => {
        const price = SERVICE_PRICES[booking.service_type] || 0;
        return sum + price;
      }, 0);

    return { total, byStatus, byService, totalRevenue, pendingRevenue };
  }, [filteredBookings]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Booking status changed to ${newStatus}.` });
      fetchBookings();
    }
  };

  const deleteBooking = async (booking: Booking) => {
    if (!confirm(`Delete booking from ${booking.client_name}?`)) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", booking.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Booking removed." });
      fetchBookings();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <Badge variant="outline" className={`${statusConfig?.color} text-white border-0`}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("SamBlessing Photography - Bookings Report", 14, 20);

    // Date range
    doc.setFontSize(10);
    const dateRange = dateFrom || dateTo
      ? `Date Range: ${dateFrom || 'Start'} to ${dateTo || 'Present'}`
      : `Generated: ${new Date().toLocaleDateString()}`;
    doc.text(dateRange, 14, 28);

    // Analytics summary
    doc.setFontSize(12);
    doc.text("Summary:", 14, 38);
    doc.setFontSize(10);
    doc.text(`Total Bookings: ${analytics.total}`, 20, 45);
    doc.text(`Confirmed Revenue: GH₵ ${analytics.totalRevenue.toLocaleString()}`, 20, 52);
    doc.text(`Pending Revenue: GH₵ ${analytics.pendingRevenue.toLocaleString()}`, 20, 59);

    // Status breakdown
    let yPos = 66;
    analytics.byStatus.forEach((status) => {
      if (status.count > 0) {
        doc.text(`${status.label}: ${status.count}`, 20, yPos);
        yPos += 7;
      }
    });

    // Bookings table
    autoTable(doc, {
      startY: yPos + 5,
      head: [["Date", "Client", "Email", "Phone", "Service", "Status"]],
      body: filteredBookings.map((booking) => [
        new Date(booking.created_at).toLocaleDateString(),
        booking.client_name,
        booking.client_email,
        booking.client_phone,
        booking.service_type.replace(/-/g, " "),
        booking.status,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [157, 78, 221] },
    });

    doc.save(`bookings-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: "Success", description: "PDF report downloaded" });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheetData = [
      // Header row
      ["SamBlessing Photography - Bookings Report"],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ["Summary"],
      [`Total Bookings: ${analytics.total}`],
      [`Confirmed Revenue: GH₵ ${analytics.totalRevenue.toLocaleString()}`],
      [`Pending Revenue: GH₵ ${analytics.pendingRevenue.toLocaleString()}`],
      [],
      ["Status Breakdown"],
      ...analytics.byStatus.map((s) => [`${s.label}: ${s.count}`]),
      [],
      ["Service Breakdown"],
      ...Object.entries(analytics.byService).map(([service, count]) => [
        `${service.charAt(0).toUpperCase() + service.slice(1)}: ${count}`,
      ]),
      [],
      [],
      // Bookings table header
      ["Created Date", "Client Name", "Email", "Phone", "Service Type", "Preferred Date", "Status", "Message"],
      // Bookings data
      ...filteredBookings.map((booking) => [
        new Date(booking.created_at).toLocaleString(),
        booking.client_name,
        booking.client_email,
        booking.client_phone,
        booking.service_type.replace(/-/g, " "),
        booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString() : "Not specified",
        booking.status,
        booking.message || "",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    ws["!cols"] = [
      { wch: 20 }, // Created Date
      { wch: 20 }, // Client Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 35 }, // Service Type
      { wch: 15 }, // Preferred Date
      { wch: 12 }, // Status
      { wch: 40 }, // Message
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `bookings-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({ title: "Success", description: "Excel report downloaded" });
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = [
      // Header
      ["Created Date", "Client Name", "Email", "Phone", "Service Type", "Preferred Date", "Status", "Message"],
      // Data rows
      ...filteredBookings.map((booking) => [
        new Date(booking.created_at).toLocaleString(),
        booking.client_name,
        booking.client_email,
        booking.client_phone,
        booking.service_type.replace(/-/g, " "),
        booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString() : "Not specified",
        booking.status,
        booking.message || "",
      ]),
    ];

    const csvContent = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bookings-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast({ title: "Success", description: "CSV report downloaded" });
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
            <p className="text-xs text-muted-foreground">
              {dateFrom || dateTo ? "Filtered range" : "All time"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.byStatus.find((s) => s.value === "pending")?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              GH₵ {analytics.pendingRevenue.toLocaleString()} potential
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.byStatus.find((s) => s.value === "confirmed")?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GH₵ {analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Confirmed + Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Service Categories</CardTitle>
          <CardDescription>Bookings by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(analytics.byService).map(([service, count]) => (
              <div key={service} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="capitalize font-medium">{service}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Export */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Input
            type="date"
            placeholder="From date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            placeholder="To date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToPDF}>
            <FileDown className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <FileDown className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <FileDown className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Requests ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No bookings found matching your filters.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.client_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.client_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize max-w-xs truncate">
                        {booking.service_type.replace(/-/g, " ")}
                      </TableCell>
                      <TableCell>
                        {booking.preferred_date
                          ? new Date(booking.preferred_date).toLocaleDateString()
                          : "Not specified"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBooking(booking)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <h4 className="font-display text-xl">{selectedBooking.client_name}</h4>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedBooking.client_email}`} className="hover:text-primary">
                    {selectedBooking.client_email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedBooking.client_phone}`} className="hover:text-primary">
                    {selectedBooking.client_phone}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium capitalize text-sm">
                    {selectedBooking.service_type.replace(/-/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-medium">
                    {selectedBooking.preferred_date
                      ? new Date(selectedBooking.preferred_date).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estimated Price</p>
                <p className="font-bold text-lg text-primary">
                  GH₵ {(SERVICE_PRICES[selectedBooking.service_type] || 0).toLocaleString()}
                </p>
              </div>

              {selectedBooking.message && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Message
                  </p>
                  <p className="mt-1 text-sm bg-muted p-3 rounded">{selectedBooking.message}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                <Select
                  value={selectedBooking.status}
                  onValueChange={(value) => {
                    updateStatus(selectedBooking.id, value);
                    setSelectedBooking({ ...selectedBooking, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                Submitted: {new Date(selectedBooking.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
