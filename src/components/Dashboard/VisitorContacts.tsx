/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, Users } from "lucide-react";

// Static contacts data
const staticContactsData = {
  totalContacts: 2847,
  newMessages: 128,
  unreadEmails: 45,
  activeChats: 12,
  recentContacts: [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      type: "email",
      date: "2024-01-17T10:30:00Z",
      status: "unread",
      message: "Question about subscription plan",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      type: "chat",
      date: "2024-01-17T09:15:00Z",
      status: "active",
      message: "Technical support needed",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      type: "phone",
      date: "2024-01-17T08:45:00Z",
      status: "completed",
      message: "Callback requested",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@email.com",
      type: "email",
      date: "2024-01-16T23:20:00Z",
      status: "unread",
      message: "Partnership inquiry",
    },
    {
      id: 5,
      name: "Carlos Rodriguez",
      email: "carlos.r@email.com",
      type: "chat",
      date: "2024-01-16T22:10:00Z",
      status: "active",
      message: "Account access issue",
    },
  ],
  contactByType: {
    email: 1456,
    phone: 892,
    chat: 499,
  },
};

export function VisitorContacts() {
  const data = staticContactsData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Visitor Contacts & Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {data.totalContacts.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <p className="text-sm text-muted-foreground">New Messages</p>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {data.newMessages}
            </p>
          </div>

          <div className="bg-yellow-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Unread Emails</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {data.unreadEmails}
            </p>
          </div>

          <div className="bg-purple-500/10 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-purple-500" />
              <p className="text-sm text-muted-foreground">Active Chats</p>
            </div>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {data.activeChats}
            </p>
          </div>
        </div>

        {/* Contact Type Breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-xl font-bold text-blue-600">
              {data.contactByType.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {((data.contactByType.email / data.totalContacts) * 100).toFixed(
                1,
              )}
              %
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="text-xl font-bold text-green-600">
              {data.contactByType.phone}
            </p>
            <p className="text-xs text-muted-foreground">
              {((data.contactByType.phone / data.totalContacts) * 100).toFixed(
                1,
              )}
              %
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Chat</p>
            <p className="text-xl font-bold text-purple-600">
              {data.contactByType.chat}
            </p>
            <p className="text-xs text-muted-foreground">
              {((data.contactByType.chat / data.totalContacts) * 100).toFixed(
                1,
              )}
              %
            </p>
          </div>
        </div>

        {/* Recent Contacts List */}
        <div>
          <h4 className="text-sm font-medium mb-3">Recent Contacts</h4>
          <div className="space-y-3">
            {data.recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{contact.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {contact.type}
                    </span>
                    {contact.status === "unread" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                        Unread
                      </span>
                    )}
                    {contact.status === "active" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {contact.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {contact.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(contact.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
