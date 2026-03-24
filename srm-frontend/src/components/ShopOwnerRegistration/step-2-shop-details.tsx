'use client';

import { useState } from 'react';
import { MapPin, Building2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step2Props {
  onContinue: (data: Step2Data) => void;
  onBack: () => void;
}

export interface Step2Data {
  businessRegistration: string;
  shopAddress: string;
  city: string;
  branches: string;
  repairTypes: string[];
}

const repairOptions = [
  'Mobile Phones',
  'Tablets',
  'Laptops',
  'Smartwatches',
  'Gaming Consoles',
  'Cameras',
  'Other',
];

export function Step2ShopDetails({ onContinue, onBack }: Step2Props) {
  const [formData, setFormData] = useState<Step2Data>({
    businessRegistration: 'BR-XXXXXXXX',
    shopAddress: 'Street address, city, postal code',
    city: 'Select a city',
    branches: 'Select branches count',
    repairTypes: [],
  });

  const toggleRepairType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      repairTypes: prev.repairTypes.includes(type)
        ? prev.repairTypes.filter((t) => t !== type)
        : [...prev.repairTypes, type],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Step 2 of 3</p>
        <h1 className="text-4xl font-bold mt-2">Shop details</h1>
        <p className="text-muted-foreground mt-2">Help us understand your business better</p>
      </div>

      {/* Business Registration Number */}
      <div>
        <label className="block text-sm font-semibold mb-2">Business Registration Number</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.businessRegistration}
            onChange={(e) => setFormData({ ...formData, businessRegistration: e.target.value })}
            placeholder="BR-XXXXXXXX"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Optional - for invoicing purposes</p>
      </div>

      {/* Shop Address */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Shop Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <textarea
            value={formData.shopAddress}
            onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
            placeholder="Street address, city, postal code"
            rows={3}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          City <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option>Select a city</option>
            <option>Colombo</option>
            <option>Galle</option>
            <option>Kandy</option>
            <option>Jaffna</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Branches */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Branches <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={formData.branches}
            onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
            className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option>Select branches count</option>
            <option>1</option>
            <option>2-5</option>
            <option>6-10</option>
            <option>10+</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Type of Repairs */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Type of Repairs <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {repairOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleRepairType(option)}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                formData.repairTypes.includes(option)
                  ? 'border-primary bg-primary bg-opacity-5 text-primary'
                  : 'border-border bg-white text-foreground hover:border-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 rounded-lg"
        >
          ← Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
