// src/components/ProductionTabs/addproduction/hooks.ts
import { useState } from 'react';

export interface AddProductionFormData {
  date: string;
  section: string;
  machine: string;
  shift: string;
  count: string;
  hank: string;
  production_kg: number;
  required_qty: number;
  remarks?: string;
  status: 'draft' | 'final';
}

export const useAddProductionForm = () => {
  const [formData, setFormData] = useState<AddProductionFormData>({
    date: new Date().toISOString().split('T')[0], // default to today
    section: '',
    machine: '',
    shift: '',
    count: '',
    hank: '',
    production_kg: 0,
    required_qty: 0,
    remarks: '',
    status: 'draft',
  });

  const updateField = <K extends keyof AddProductionFormData>(
    key: K,
    value: AddProductionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      section: '',
      machine: '',
      shift: '',
      count: '',
      hank: '',
      production_kg: 0,
      required_qty: 0,
      remarks: '',
      status: 'draft',
    });
  };

  return {
    formData,
    updateField,
    resetForm,
  };
};

export const usePreview = () => {
  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => setShowPreview((prev) => !prev);
  const show = () => setShowPreview(true);
  const hide = () => setShowPreview(false);

  return { showPreview, togglePreview, show, hide };
};