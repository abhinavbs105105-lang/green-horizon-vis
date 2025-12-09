import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  admissionForms: AdmissionForm[];
  addAdmissionForm: (form: Omit<AdmissionForm, 'id' | 'submittedAt'>) => void;
  contactForms: ContactForm[];
  addContactForm: (form: Omit<ContactForm, 'id' | 'submittedAt'>) => void;
  deleteAdmissionForm: (id: string) => void;
  deleteContactForm: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [admissionForms, setAdmissionForms] = useState<AdmissionForm[]>([]);
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);

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
