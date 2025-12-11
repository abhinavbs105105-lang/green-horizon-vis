import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Trash2, 
  FileText, 
  MessageSquare, 
  Shield, 
  Calendar,
  Image as ImageIcon,
  Upload,
  Plus,
  Eye,
  X,
  Download,
  Scale,
  FolderOpen,
  Edit,
  LogOut
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const galleryCategories = [
  { id: 'campus', name: 'Campus' },
  { id: 'classroom', name: 'Classrooms' },
  { id: 'sports', name: 'Sports' },
  { id: 'events', name: 'Events' },
];

const ruleCategories = [
  { id: 'general', name: 'General' },
  { id: 'attendance', name: 'Attendance' },
  { id: 'dress-code', name: 'Dress Code' },
  { id: 'conduct', name: 'Conduct' },
  { id: 'academics', name: 'Academics' },
  { id: 'facilities', name: 'Facilities' },
];

const resourceCategories = [
  { id: 'general', name: 'General' },
  { id: 'syllabus', name: 'Syllabus' },
  { id: 'timetable', name: 'Timetable' },
  { id: 'policies', name: 'Policies' },
  { id: 'forms', name: 'Forms' },
];

interface SchoolRule {
  id: string;
  title: string;
  content: string;
  category: string;
  order_index: number;
  is_active: boolean;
}

interface ParentResource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  category: string;
  is_active: boolean;
}

interface AdmissionForm {
  id: string;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  class_applying: string;
  date_of_birth: string;
  address: string;
  previous_school: string | null;
  submitted_at: string;
}

interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submitted_at: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string | null;
  category: string;
  uploaded_at: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin: contextIsAdmin } = useAdmin();
  const { user, isAdmin: authIsAdmin, signOut, loading: authLoading } = useAuth();

  // Data states
  const [admissionForms, setAdmissionForms] = useState<AdmissionForm[]>([]);
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [rules, setRules] = useState<SchoolRule[]>([]);
  const [resources, setResources] = useState<ParentResource[]>([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [showFormDetails, setShowFormDetails] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [editingRule, setEditingRule] = useState<SchoolRule | null>(null);

  // Form states
  const [newImage, setNewImage] = useState({ title: '', description: '', category: 'campus', url: '' });
  const [newRule, setNewRule] = useState({ title: '', content: '', category: 'general', order_index: 0 });
  const [newResource, setNewResource] = useState({ title: '', description: '', category: 'general', file: null as File | null });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resourceFileRef = useRef<HTMLInputElement>(null);

  // Check access
  const hasAccess = contextIsAdmin || authIsAdmin;

  useEffect(() => {
    if (!authLoading && !hasAccess) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "Please login as admin to access this page.",
        variant: "destructive",
      });
    }
  }, [hasAccess, authLoading, navigate]);

  useEffect(() => {
    if (hasAccess) {
      fetchAllData();
    }
  }, [hasAccess]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAdmissions(),
      fetchContacts(),
      fetchGallery(),
      fetchRules(),
      fetchResources(),
    ]);
    setLoading(false);
  };

  const fetchAdmissions = async () => {
    const { data } = await supabase.from('admission_forms').select('*').order('submitted_at', { ascending: false });
    if (data) setAdmissionForms(data);
  };

  const fetchContacts = async () => {
    const { data } = await supabase.from('contact_forms').select('*').order('submitted_at', { ascending: false });
    if (data) setContactForms(data);
  };

  const fetchGallery = async () => {
    const { data } = await supabase.from('gallery_images').select('*').order('uploaded_at', { ascending: false });
    if (data) setGalleryImages(data);
  };

  const fetchRules = async () => {
    const { data } = await supabase.from('school_rules').select('*').order('order_index', { ascending: true });
    if (data) setRules(data);
  };

  const fetchResources = async () => {
    const { data } = await supabase.from('parent_resources').select('*').order('uploaded_at', { ascending: false });
    if (data) setResources(data);
  };

  // Image handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(prev => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!newImage.title || !newImage.url) {
      toast({ title: "Missing information", description: "Please provide a title and select an image.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from('gallery_images').insert({
      title: newImage.title,
      description: newImage.description,
      category: newImage.category,
      url: newImage.url,
    });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Image uploaded successfully!" });
      setNewImage({ title: '', description: '', category: 'campus', url: '' });
      setShowUploadDialog(false);
      fetchGallery();
    }
  };

  const handleDeleteImage = async (id: string) => {
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (!error) {
      toast({ title: "Image deleted" });
      fetchGallery();
    }
    setDeleteConfirm(null);
  };

  // Rule handlers
  const handleSaveRule = async () => {
    if (!newRule.title || !newRule.content) {
      toast({ title: "Missing information", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (editingRule) {
      const { error } = await supabase.from('school_rules').update({
        title: newRule.title,
        content: newRule.content,
        category: newRule.category,
        order_index: newRule.order_index,
      }).eq('id', editingRule.id);

      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rule updated successfully!" });
      }
    } else {
      const { error } = await supabase.from('school_rules').insert({
        title: newRule.title,
        content: newRule.content,
        category: newRule.category,
        order_index: newRule.order_index,
        is_active: true,
      });

      if (error) {
        toast({ title: "Failed to add rule", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Rule added successfully!" });
      }
    }

    setNewRule({ title: '', content: '', category: 'general', order_index: 0 });
    setEditingRule(null);
    setShowRuleDialog(false);
    fetchRules();
  };

  const handleDeleteRule = async (id: string) => {
    const { error } = await supabase.from('school_rules').delete().eq('id', id);
    if (!error) {
      toast({ title: "Rule deleted" });
      fetchRules();
    }
    setDeleteConfirm(null);
  };

  // Resource handlers
  const handleResourceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewResource(prev => ({ ...prev, file }));
    }
  };

  const handleUploadResource = async () => {
    if (!newResource.title || !newResource.file) {
      toast({ title: "Missing information", description: "Please provide a title and select a file.", variant: "destructive" });
      return;
    }

    // For now, we'll use data URLs for simplicity (in production, use Supabase Storage)
    const reader = new FileReader();
    reader.onloadend = async () => {
      const { error } = await supabase.from('parent_resources').insert({
        title: newResource.title,
        description: newResource.description,
        category: newResource.category,
        file_url: reader.result as string,
        file_name: newResource.file!.name,
        file_type: newResource.file!.type,
        is_active: true,
      });

      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Resource uploaded successfully!" });
        setNewResource({ title: '', description: '', category: 'general', file: null });
        setShowResourceDialog(false);
        fetchResources();
      }
    };
    reader.readAsDataURL(newResource.file);
  };

  const handleDeleteResource = async (id: string) => {
    const { error } = await supabase.from('parent_resources').delete().eq('id', id);
    if (!error) {
      toast({ title: "Resource deleted" });
      fetchResources();
    }
    setDeleteConfirm(null);
  };

  // Form handlers
  const handleDeleteAdmission = async (id: string) => {
    const { error } = await supabase.from('admission_forms').delete().eq('id', id);
    if (!error) {
      toast({ title: "Admission form deleted" });
      fetchAdmissions();
    }
    setDeleteConfirm(null);
  };

  const handleDeleteContact = async (id: string) => {
    const { error } = await supabase.from('contact_forms').delete().eq('id', id);
    if (!error) {
      toast({ title: "Contact form deleted" });
      fetchContacts();
    }
    setDeleteConfirm(null);
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(item => Object.values(item).map(v => `"${v}"`).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (authLoading || !hasAccess) {
    return null;
  }

  return (
    <div className="py-6 md:py-8 min-h-screen bg-gradient-soft">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
              <Shield className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                Vinayak International School
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-accent/20 text-accent-foreground rounded-full text-sm font-body font-medium animate-pulse-soft">
              Admin Active
            </span>
            {user && (
              <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
          {[
            { icon: FileText, value: admissionForms.length, label: 'Admissions', color: 'text-primary' },
            { icon: MessageSquare, value: contactForms.length, label: 'Messages', color: 'text-emerald-600' },
            { icon: ImageIcon, value: galleryImages.length, label: 'Gallery', color: 'text-blue-600' },
            { icon: Scale, value: rules.length, label: 'Rules', color: 'text-purple-600' },
            { icon: FolderOpen, value: resources.length, label: 'Resources', color: 'text-accent' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl p-4 md:p-6 shadow-card hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color} mb-2`} />
              <div className="font-display text-xl md:text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="font-body text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="admissions" className="space-y-6 animate-fade-in-up delay-300">
          <TabsList className="grid w-full max-w-3xl grid-cols-5 h-auto p-1">
            {[
              { value: 'admissions', icon: FileText, label: 'Admissions', count: admissionForms.length },
              { value: 'contacts', icon: MessageSquare, label: 'Messages', count: contactForms.length },
              { value: 'gallery', icon: ImageIcon, label: 'Gallery', count: galleryImages.length },
              { value: 'rules', icon: Scale, label: 'Rules', count: rules.length },
              { value: 'resources', icon: FolderOpen, label: 'Resources', count: resources.length },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1 text-xs md:text-sm py-2">
                <tab.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">{tab.count}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Admissions Tab */}
          <TabsContent value="admissions" className="animate-fade-in">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-foreground">Admission Applications</h3>
                {admissionForms.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(admissionForms, 'admissions.csv')} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : admissionForms.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground">No admission applications yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Student</TableHead>
                        <TableHead className="hidden md:table-cell">Parent</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="hidden lg:table-cell">Email</TableHead>
                        <TableHead className="hidden sm:table-cell">Phone</TableHead>
                        <TableHead className="hidden lg:table-cell">Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admissionForms.map((form) => (
                        <TableRow key={form.id} className="hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-medium">{form.student_name}</TableCell>
                          <TableCell className="hidden md:table-cell">{form.parent_name}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">{form.class_applying}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{form.email}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{form.phone}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {new Date(form.submitted_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setShowFormDetails({ type: 'admission', data: form })} className="h-8 w-8">
                                <Eye className="h-4 w-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: 'admission', id: form.id })} className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="animate-fade-in">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-foreground">Contact Messages</h3>
                {contactForms.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(contactForms, 'contacts.csv')} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : contactForms.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground">No contact messages yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Subject</TableHead>
                        <TableHead className="hidden lg:table-cell max-w-[200px]">Message</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactForms.map((form) => (
                        <TableRow key={form.id} className="hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-medium">{form.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{form.email}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">{form.subject || 'General'}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-sm text-muted-foreground">{form.message}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {new Date(form.submitted_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setShowFormDetails({ type: 'contact', data: form })} className="h-8 w-8">
                                <Eye className="h-4 w-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: 'contact', id: form.id })} className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="animate-fade-in">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-foreground">Gallery Images</h3>
                <Button onClick={() => setShowUploadDialog(true)} className="gap-2 shadow-soft">
                  <Plus className="h-4 w-4" />
                  Add Image
                </Button>
              </div>
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : galleryImages.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground mb-4">No images in gallery yet</p>
                  <Button onClick={() => setShowUploadDialog(true)} variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload First Image
                  </Button>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square shadow-soft">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" onClick={() => setDeleteConfirm({ type: 'gallery', id: img.id })}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-foreground/80 to-transparent">
                        <p className="text-primary-foreground text-xs font-medium truncate">{img.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="animate-fade-in">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-foreground">School Rules</h3>
                <Button onClick={() => { setEditingRule(null); setNewRule({ title: '', content: '', category: 'general', order_index: rules.length }); setShowRuleDialog(true); }} className="gap-2 shadow-soft">
                  <Plus className="h-4 w-4" />
                  Add Rule
                </Button>
              </div>
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : rules.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground">No school rules yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden lg:table-cell max-w-[300px]">Content</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rules.map((rule) => (
                        <TableRow key={rule.id} className="hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-medium">{rule.order_index}</TableCell>
                          <TableCell className="font-medium">{rule.title}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium capitalize">{rule.category}</span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-[300px] truncate text-sm text-muted-foreground">{rule.content}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => { setEditingRule(rule); setNewRule({ title: rule.title, content: rule.content, category: rule.category, order_index: rule.order_index }); setShowRuleDialog(true); }} className="h-8 w-8">
                                <Edit className="h-4 w-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: 'rule', id: rule.id })} className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="animate-fade-in">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-foreground">Parent Resources</h3>
                <Button onClick={() => setShowResourceDialog(true)} className="gap-2 shadow-soft">
                  <Plus className="h-4 w-4" />
                  Add Resource
                </Button>
              </div>
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : resources.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground">No resources uploaded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden sm:table-cell">File</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource.id} className="hover:bg-secondary/50 transition-colors">
                          <TableCell className="font-medium">{resource.title}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium capitalize">{resource.category}</span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{resource.file_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <a href={resource.file_url} download={resource.file_name}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4 text-primary" />
                                </Button>
                              </a>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm({ type: 'resource', id: resource.id })} className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
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
      </div>

      {/* Upload Image Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Upload Gallery Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newImage.title} onChange={(e) => setNewImage({ ...newImage, title: e.target.value })} placeholder="Image title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newImage.description} onChange={(e) => setNewImage({ ...newImage, description: e.target.value })} placeholder="Brief description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newImage.category} onValueChange={(value) => setNewImage({ ...newImage, category: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {galleryCategories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} className="hidden" />
              {newImage.url ? (
                <div className="relative rounded-lg overflow-hidden aspect-video">
                  <img src={newImage.url} alt="Preview" className="w-full h-full object-cover" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => setNewImage({ ...newImage, url: '' })}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full h-32" onClick={() => fileInputRef.current?.click()}>
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to select image</span>
                  </div>
                </Button>
              )}
            </div>
            <Button onClick={handleUploadImage} className="w-full">Upload Image</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rule Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editingRule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newRule.title} onChange={(e) => setNewRule({ ...newRule, title: e.target.value })} placeholder="Rule title" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={newRule.content} onChange={(e) => setNewRule({ ...newRule, content: e.target.value })} placeholder="Rule description" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newRule.category} onValueChange={(value) => setNewRule({ ...newRule, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ruleCategories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={newRule.order_index} onChange={(e) => setNewRule({ ...newRule, order_index: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <Button onClick={handleSaveRule} className="w-full">{editingRule ? 'Update Rule' : 'Add Rule'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resource Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Upload Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} placeholder="Resource title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} placeholder="Brief description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newResource.category} onValueChange={(value) => setNewResource({ ...newResource, category: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {resourceCategories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <input type="file" ref={resourceFileRef} onChange={handleResourceFileSelect} className="hidden" />
              <Button variant="outline" className="w-full" onClick={() => resourceFileRef.current?.click()}>
                {newResource.file ? newResource.file.name : 'Click to select file'}
              </Button>
            </div>
            <Button onClick={handleUploadResource} className="w-full">Upload Resource</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Details Dialog */}
      <Dialog open={!!showFormDetails} onOpenChange={() => setShowFormDetails(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {showFormDetails?.type === 'admission' ? 'Admission Application' : 'Contact Message'}
            </DialogTitle>
          </DialogHeader>
          {showFormDetails?.type === 'admission' && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground">Student:</span> <span className="font-medium">{showFormDetails.data.student_name}</span></div>
                <div><span className="text-muted-foreground">Parent:</span> <span className="font-medium">{showFormDetails.data.parent_name}</span></div>
                <div><span className="text-muted-foreground">Class:</span> <span className="font-medium">{showFormDetails.data.class_applying}</span></div>
                <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{showFormDetails.data.date_of_birth}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{showFormDetails.data.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{showFormDetails.data.phone}</span></div>
              </div>
              <div><span className="text-muted-foreground">Address:</span> <span className="font-medium">{showFormDetails.data.address}</span></div>
              <div><span className="text-muted-foreground">Previous School:</span> <span className="font-medium">{showFormDetails.data.previous_school || 'N/A'}</span></div>
              <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium">{new Date(showFormDetails.data.submitted_at).toLocaleString()}</span></div>
            </div>
          )}
          {showFormDetails?.type === 'contact' && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{showFormDetails.data.name}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{showFormDetails.data.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{showFormDetails.data.phone}</span></div>
                <div><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{showFormDetails.data.subject}</span></div>
              </div>
              <div><span className="text-muted-foreground">Message:</span></div>
              <p className="font-medium p-3 bg-secondary rounded-lg">{showFormDetails.data.message}</p>
              <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium">{new Date(showFormDetails.data.submitted_at).toLocaleString()}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm?.type === 'admission') handleDeleteAdmission(deleteConfirm.id);
                else if (deleteConfirm?.type === 'contact') handleDeleteContact(deleteConfirm.id);
                else if (deleteConfirm?.type === 'gallery') handleDeleteImage(deleteConfirm.id);
                else if (deleteConfirm?.type === 'rule') handleDeleteRule(deleteConfirm.id);
                else if (deleteConfirm?.type === 'resource') handleDeleteResource(deleteConfirm.id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
