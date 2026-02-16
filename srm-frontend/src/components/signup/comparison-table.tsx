'use client'

import { Check, X } from 'lucide-react'

const features = [
  'Manage Repairs',
  'Staff Management',
  'Advanced Analytics',
  'Inventory Management',
  'Multi-Location Support',
  'Custom Branding',
]

export function ComparisonTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Compare Features
      </h2>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-900">
                Feature
              </th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">
                Admin
              </th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">
                Staff
              </th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">
                Shop
              </th>
            </tr>
          </thead>
          
          {/* Body */}
          <tbody>
            {features.map((feature, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="py-4 px-4 text-gray-900 font-medium">
                  {feature}
                </td>
                
                {/* Admin */}
                <td className="py-4 px-4 text-center">
                  {getFeatureStatus(feature, 'admin') === 'yes' ? (
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : getFeatureStatus(feature, 'admin') === 'no' ? (
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                
                {/* Staff */}
                <td className="py-4 px-4 text-center">
                  {getFeatureStatus(feature, 'staff') === 'yes' ? (
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : getFeatureStatus(feature, 'staff') === 'no' ? (
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                
                {/* Shop */}
                <td className="py-4 px-4 text-center">
                  {getFeatureStatus(feature, 'shop') === 'yes' ? (
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : getFeatureStatus(feature, 'shop') === 'no' ? (
                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function getFeatureStatus(
  feature: string,
  role: 'admin' | 'staff' | 'shop'
): 'yes' | 'no' | 'partial' {
  const matrix: Record<string, Record<string, 'yes' | 'no' | 'partial'>> = {
    'Manage Repairs': { admin: 'yes', staff: 'yes', shop: 'yes' },
    'Staff Management': { admin: 'yes', staff: 'no', shop: 'yes' },
    'Advanced Analytics': { admin: 'yes', staff: 'no', shop: 'yes' },
    'Inventory Management': { admin: 'yes', staff: 'partial', shop: 'yes' },
    'Multi-Location Support': { admin: 'no', staff: 'no', shop: 'yes' },
    'Custom Branding': { admin: 'no', staff: 'no', shop: 'yes' },
  }
  
  return matrix[feature]?.[role] || 'no'
}
