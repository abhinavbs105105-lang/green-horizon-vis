import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdmissionForm {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  classApplying: string;
  dateOfBirth: string;
  address: string;
  previousSchool: string;
  submittedAt: string;
}

interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  uploadedAt: string;
}

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  admissionForms: AdmissionForm[];
  addAdmissionForm: (form: Omit<AdmissionForm, 'id' | 'submittedAt'>) => void;
  contactForms: ContactForm[];
  addContactForm: (form: Omit<ContactForm, 'id' | 'submittedAt'>) => void;
  deleteAdmissionForm: (id: string) => void;
  deleteContactForm: (id: string) => void;
  galleryImages: GalleryImage[];
  addGalleryImage: (image: Omit<GalleryImage, 'id' | 'uploadedAt'>) => void;
  deleteGalleryImage: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Load from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [admissionForms, setAdmissionForms] = useState<AdmissionForm[]>(() => 
    loadFromStorage('vis_admissions', [])
  );
  const [contactForms, setContactForms] = useState<ContactForm[]>(() => 
    loadFromStorage('vis_contacts', [])
  );
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => 
    loadFromStorage('vis_gallery', [])
  );

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('vis_admissions', JSON.stringify(admissionForms));
  }, [admissionForms]);

  useEffect(() => {
    localStorage.setItem('vis_contacts', JSON.stringify(contactForms));
  }, [contactForms]);

  useEffect(() => {
    localStorage.setItem('vis_gallery', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const addAdmissionForm = (form: Omit<AdmissionForm, 'id' | 'submittedAt'>) => {
    const newForm: AdmissionForm = {
      ...form,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    setAdmissionForms(prev => [...prev, newForm]);
  };

  const addContactForm = (form: Omit<ContactForm, 'id' | 'submittedAt'>) => {
    const newForm: ContactForm = {
      ...form,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    setContactForms(prev => [...prev, newForm]);
  };

  const deleteAdmissionForm = (id: string) => {
    setAdmissionForms(prev => prev.filter(form => form.id !== id));
  };

  const deleteContactForm = (id: string) => {
    setContactForms(prev => prev.filter(form => form.id !== id));
  };

  const addGalleryImage = (image: Omit<GalleryImage, 'id' | 'uploadedAt'>) => {
    const newImage: GalleryImage = {
      ...image,
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString(),
    };
    setGalleryImages(prev => [...prev, newImage]);
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      setIsAdmin,
      admissionForms,
      addAdmissionForm,
      contactForms,
      addContactForm,
      deleteAdmissionForm,
      deleteContactForm,
      galleryImages,
      addGalleryImage,
      deleteGalleryImage,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
