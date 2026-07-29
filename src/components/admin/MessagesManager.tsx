import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Loader2, Mail, Trash2, Search, MessageSquare, Reply, Inbox,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type ContactMessage = Tables<"contact_messages">;

const STATUS_OPTIONS = [
  { value: "unread", label: "Unread", color: "bg-yellow-500" },
  { value: "read", label: "Read", color: "bg-blue-500" },
  { value: "replied", label: "Replied", color: "bg-green-500" },
  { value: "archived", label: "Archived", color: "bg-gray-500" },
];

export const MessagesManager = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessages = async () => {
    setIsLoading(true);
    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching messages:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const q = searchQuery.toLowerCase();
      return (
        message.name.toLowerCase().includes(q) ||
        message.email.toLowerCase().includes(q) ||
        message.subject.toLowerCase().includes(q) ||
        message.message.toLowerCase().includes(q)
      );
    });
  }, [messages, searchQuery]);

  const unreadCount = useMemo(
    () => messages.filter((m) => m.status === "unread").length,
    [messages]
  );

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Message marked as ${newStatus}.` });
      fetchMessages();
    }
  };

  const deleteMessage = async (message: ContactMessage) => {
    if (!confirm(`Delete message from ${message.name}?`)) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", message.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Message removed." });
      setSelectedMessage(null);
      fetchMessages();
    }
  };

  // Opening a message is what marks it read, so the unread count stays meaningful.
  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      supabase
        .from("contact_messages")
        .update({ status: "read" })
        .eq("id", message.id)
        .then(() => fetchMessages());
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

  const replyTo = (message: ContactMessage) => {
    const subject = encodeURIComponent(`Re: ${message.subject}`);
    const body = encodeURIComponent(`\n\n---\nOn ${new Date(message.created_at).toLocaleString()}, ${message.name} wrote:\n${message.message}`);
    window.location.href = `mailto:${message.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display">{messages.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Unread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display text-primary">{unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Reply className="w-4 h-4" />
              Replied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display">
              {messages.filter((m) => m.status === "replied").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No messages found.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow
                  key={message.id}
                  className={`cursor-pointer ${message.status === "unread" ? "font-medium" : ""}`}
                  onClick={() => openMessage(message)}
                >
                  <TableCell>
                    <div>{message.name}</div>
                    <div className="text-xs text-muted-foreground">{message.email}</div>
                  </TableCell>
                  <TableCell className="max-w-[240px] truncate">{message.subject}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(message.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">{selectedMessage.name}</p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-muted-foreground hover:text-primary"
                >
                  {selectedMessage.email}
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>

              <div className="bg-secondary rounded-md p-4 text-sm whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" onClick={() => replyTo(selectedMessage)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply by email
                </Button>
                <Select
                  value={selectedMessage.status}
                  onValueChange={(value) => {
                    updateStatus(selectedMessage.id, value);
                    setSelectedMessage({ ...selectedMessage, status: value });
                  }}
                >
                  <SelectTrigger className="w-40">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
