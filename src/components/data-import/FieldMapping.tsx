// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Select } from '@/components/ui/select';
// import { IDCardFieldDefinition } from '@/lib/types';

// interface FieldMappingProps {
//   sourceFields: string[];  // Fields from Excel
//   templateFields: IDCardFieldDefinition[];  // Fields from template
//   onMappingComplete: (mapping: Record<string, string>) => void;
//   onCancel: () => void;
// }

// export function FieldMapping({
//   sourceFields,
//   templateFields,
//   onMappingComplete,
//   onCancel
// }: FieldMappingProps) {
//   const [mapping, setMapping] = useState<Record<string, string>>({});

//   // Try to automatically map fields with exact matches
//   useEffect(() => {
//     const autoMapping: Record<string, string> = {};
//     templateFields.forEach(field => {
//       const matchingSource = sourceFields.find(
//         src => src.toLowerCase() === field.key.toLowerCase()
//       );
//       if (matchingSource) {
//         autoMapping[field.key] = matchingSource;
//       }
//     });
//     setMapping(autoMapping);
//   }, [sourceFields, templateFields]);

//   const handleMappingChange = (templateField: string, sourceField: string) => {
//     setMapping(prev => ({
//       ...prev,
//       [templateField]: sourceField
//     }));
//   };

//   const handleSubmit = () => {
//     // Validate that all required fields are mapped
//     const requiredFields = templateFields.filter(f => f.required);
//     const missingFields = requiredFields.filter(f => !mapping[f.key]);

//     if (missingFields.length > 0) {
//       alert(`Please map the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
//       return;
//     }

//     onMappingComplete(mapping);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-xl font-bold">Map Fields</h2>
//       <p className="text-sm text-gray-600">
//         Match your Excel columns to the ID card fields.
//         Required fields are marked with *.
//       </p>

//       <div className="space-y-4">
//         {templateFields.map(field => (
//           <div key={field.key} className="flex items-center gap-4">
//             <label className="w-1/3">
//               {field.label}
//               {field.required && <span className="text-red-500">*</span>}
//             </label>
//             <Select
//               value={mapping[field.key] || ''}
//               onValueChange={(value) => handleMappingChange(field.key, value)}
//             >
//               <option value="">Select field...</option>
//               {sourceFields.map(sourceField => (
//                 <option key={sourceField} value={sourceField}>
//                   {sourceField}
//                 </option>
//               ))}
//             </Select>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end gap-2">
//         <Button variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit}>
//           Continue
//         </Button>
//       </div>
//     </div>
//   );
// } 