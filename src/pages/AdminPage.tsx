import { useEffect, useState, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Download
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

const categories = [
  { id: 'campus', name: 'Campus' },
  { id: 'classroom', name: 'Classrooms' },
  { id: 'sports', name: 'Sports' },
  { id: 'events', name: 'Events' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { 
    isAdmin, 
    admissionForms, 
    contactForms, 
    deleteAdmissionForm, 
    deleteContactForm,
    galleryImages,
    addGalleryImage,
    deleteGalleryImage
  } = useAdmin();

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFormDetails, setShowFormDetails] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    category: 'campus',
    url: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setDeleteConfirm(null);
    toast({ title: "Admission form deleted" });
  };

  const handleDeleteContact = (id: string) => {
    deleteContactForm(id);
    setDeleteConfirm(null);
    toast({ title: "Contact form deleted" });
  };

  const handleDeleteImage = (id: string) => {
    deleteGalleryImage(id);
    setDeleteConfirm(null);
    toast({ title: "Image deleted from gallery" });
  };

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

  const handleUploadImage = () => {
    if (!newImage.title || !newImage.url) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select an image.",
        variant: "destructive",
      });
      return;
    }

    addGalleryImage(newImage);
    setNewImage({ title: '', description: '', category: 'campus', url: '' });
    setShowUploadDialog(false);
    toast({ title: "Image uploaded successfully!" });
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
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { icon: FileText, value: admissionForms.length, label: 'Admission Applications', color: 'text-primary' },
            { icon: MessageSquare, value: contactForms.length, label: 'Contact Messages', color: 'text-emerald-600' },
            { icon: ImageIcon, value: galleryImages.length, label: 'Gallery Images', color: 'text-blue-600' },
            { icon: Calendar, value: 10, label: 'Active Pages', color: 'text-accent' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-card rounded-xl p-4 md:p-6 shadow-card hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color} mb-2`} />
              <div className="font-display text-xl md:text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="font-body text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="admissions" className="space-y-6 animate-fade-in-up delay-300">
          <TabsList className="grid w-full max-w-xl grid-cols-3 h-auto p-1">
            <TabsTrigger value="admissions" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-2.5">
              <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Admissions</span>
              <span className="sm:hidden">Adm</span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                {admissionForms.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-2.5">
              <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">Msg</span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                {contactForms.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-1 md:gap-2 text-xs md:text-sm py-2 md:py-2.5">
              <ImageIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Gallery</span>
              <span className="sm:hidden">Gal</span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                {galleryImages.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Admissions Tab */}
          <TabsContent value="admissions" className="animate-fade-in">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="font-display font-semibold text-foreground">Admission Applications</h3>
                {admissionForms.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportToCSV(admissionForms, 'admissions.csv')}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
              {admissionForms.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground">
                    No admission applications yet
                  </p>
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
                          <TableCell className="font-medium">{form.studentName}</TableCell>
                          <TableCell className="hidden md:table-cell">{form.parentName}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                              {form.classApplying}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{form.email}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{form.phone}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {new Date(form.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setShowFormDetails({ type: 'admission', data: form })}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4 text-primary" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setDeleteConfirm({ type: 'admission', id: form.id })}
                                className="h-8 w-8"
                              >
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => exportToCSV(contactForms, 'contacts.csv')}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
              {contactForms.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground">
                    No contact messages yet
                  </p>
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
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                              {form.subject || 'General'}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-sm text-muted-foreground">
                            {form.message}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {new Date(form.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setShowFormDetails({ type: 'contact', data: form })}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4 text-primary" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setDeleteConfirm({ type: 'contact', id: form.id })}
                                className="h-8 w-8"
                              >
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
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  className="gap-2 shadow-soft"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </Button>
              </div>
              
              {galleryImages.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="font-body text-muted-foreground mb-4">
                    No images in gallery yet
                  </p>
                  <Button onClick={() => setShowUploadDialog(true)} variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload First Image
                  </Button>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {galleryImages.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="group relative aspect-square rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-display font-semibold text-primary-foreground text-sm truncate">
                            {image.title}
                          </p>
                          <span className="text-xs text-primary-foreground/70 capitalize">
                            {image.category}
                          </span>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'image', id: image.id })}
                          className="absolute top-2 right-2 p-1.5 bg-destructive/90 rounded-lg text-destructive-foreground hover:bg-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info */}
        <div className="mt-8 p-4 md:p-6 bg-accent/10 rounded-xl animate-fade-in-up delay-500">
          <h3 className="font-display font-semibold text-foreground mb-2">
            Admin Panel Information
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            This admin panel allows you to view and manage admission applications, contact form submissions, and gallery images. 
            To log out of admin mode, click the school logo three times. Data is stored locally and will persist across sessions.
          </p>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Upload Image to Gallery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-body">Title *</Label>
              <Input
                value={newImage.title}
                onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter image title"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="font-body">Description</Label>
              <Input
                value={newImage.description}
                onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="font-body">Category</Label>
              <Select 
                value={newImage.category} 
                onValueChange={(value) => setNewImage(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body">Image *</Label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300"
              >
                {newImage.url ? (
                  <div className="relative">
                    <img src={newImage.url} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewImage(prev => ({ ...prev, url: '' }));
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-body text-sm text-muted-foreground">
                      Click to select an image
                    </p>
                  </>
                )}
              </div>
            </div>
            <Button onClick={handleUploadImage} className="w-full">
              Upload Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Details Dialog */}
      <Dialog open={!!showFormDetails} onOpenChange={() => setShowFormDetails(null)}>
        <DialogContent className="sm:max-w-lg animate-scale-in">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {showFormDetails?.type === 'admission' ? 'Admission Application Details' : 'Contact Message Details'}
            </DialogTitle>
          </DialogHeader>
          {showFormDetails?.type === 'admission' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Student Name</Label>
                  <p className="font-medium">{showFormDetails.data.studentName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Parent Name</Label>
                  <p className="font-medium">{showFormDetails.data.parentName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Class Applying</Label>
                  <p className="font-medium">{showFormDetails.data.classApplying}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Date of Birth</Label>
                  <p className="font-medium">{showFormDetails.data.dateOfBirth}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p className="font-medium">{showFormDetails.data.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p className="font-medium">{showFormDetails.data.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Address</Label>
                <p className="font-medium">{showFormDetails.data.address}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Previous School</Label>
                <p className="font-medium">{showFormDetails.data.previousSchool || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Submitted At</Label>
                <p className="font-medium">{new Date(showFormDetails.data.submittedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
          {showFormDetails?.type === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <p className="font-medium">{showFormDetails.data.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p className="font-medium">{showFormDetails.data.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p className="font-medium">{showFormDetails.data.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Subject</Label>
                  <p className="font-medium">{showFormDetails.data.subject || 'General'}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Message</Label>
                <p className="font-medium bg-secondary/50 p-3 rounded-lg mt-1">{showFormDetails.data.message}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Submitted At</Label>
                <p className="font-medium">{new Date(showFormDetails.data.submittedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {deleteConfirm?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteConfirm?.type === 'admission') handleDeleteAdmission(deleteConfirm.id);
                else if (deleteConfirm?.type === 'contact') handleDeleteContact(deleteConfirm.id);
                else if (deleteConfirm?.type === 'image') handleDeleteImage(deleteConfirm.id);
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
