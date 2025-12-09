import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2, FileText, MessageSquare, Shield, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminPage() {
  const navigate = useNavigate();
  const { 
    isAdmin, 
    admissionForms, 
    contactForms, 
    deleteAdmissionForm, 
    deleteContactForm 
  } = useAdmin();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "Please login as admin to access this page.",
        variant: "destructive",
      });
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const handleDeleteAdmission = (id: string) => {
    deleteAdmissionForm(id);
    toast({ title: "Admission form deleted" });
  };

  const handleDeleteContact = (id: string) => {
    deleteContactForm(id);
    toast({ title: "Contact form deleted" });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="font-body text-muted-foreground">
              Manage submissions and website content
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <FileText className="h-8 w-8 text-primary mb-2" />
            <div className="font-display text-2xl font-bold text-foreground">
              {admissionForms.length}
            </div>
            <div className="font-body text-sm text-muted-foreground">
              Admission Applications
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <div className="font-display text-2xl font-bold text-foreground">
              {contactForms.length}
            </div>
            <div className="font-body text-sm text-muted-foreground">
              Contact Messages
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <div className="font-display text-2xl font-bold text-foreground">
              10
            </div>
            <div className="font-body text-sm text-muted-foreground">
              Active Pages
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <Shield className="h-8 w-8 text-accent mb-2" />
            <div className="font-display text-lg font-bold text-foreground">
              Active
            </div>
            <div className="font-body text-sm text-muted-foreground">
              Admin Status
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="admissions" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="admissions" className="gap-2">
              <FileText className="h-4 w-4" />
              Admissions ({admissionForms.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Contacts ({contactForms.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admissions">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              {admissionForms.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-body text-muted-foreground">
                    No admission applications yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admissionForms.map((form) => (
                        <TableRow key={form.id}>
                          <TableCell className="font-medium">{form.studentName}</TableCell>
                          <TableCell>{form.parentName}</TableCell>
                          <TableCell>{form.classApplying}</TableCell>
                          <TableCell>{form.email}</TableCell>
                          <TableCell>{form.phone}</TableCell>
                          <TableCell>
                            {new Date(form.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteAdmission(form.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              {contactForms.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-body text-muted-foreground">
                    No contact messages yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactForms.map((form) => (
                        <TableRow key={form.id}>
                          <TableCell className="font-medium">{form.name}</TableCell>
                          <TableCell>{form.email}</TableCell>
                          <TableCell>{form.subject || '-'}</TableCell>
                          <TableCell className="max-w-xs truncate">{form.message}</TableCell>
                          <TableCell>
                            {new Date(form.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteContact(form.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info */}
        <div className="mt-8 p-6 bg-accent/10 rounded-xl">
          <h3 className="font-display font-semibold text-foreground mb-2">
            Admin Panel Information
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            This admin panel allows you to view and manage admission applications and contact form submissions. 
            To log out of admin mode, click the school logo three times. 
            Future updates will include content editing capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
