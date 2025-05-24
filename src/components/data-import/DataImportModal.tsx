// import { useState } from 'react';
// import { useToast } from '@/components/ui/use-toast';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import * as XLSX from 'xlsx';
// import { CardData } from '@/lib/importUtils';

// interface DataImportModalProps {
//   onDataImport: (data: CardData[]) => void;
//   onClose: () => void;
// }

// export function DataImportModal({ onDataImport, onClose }: DataImportModalProps) {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     try {
//       setIsLoading(true);
//       const file = e.target.files?.[0];
//       if (!file) return;

//       // Read the Excel file
//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data);
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet) as CardData[];

//       if (jsonData.length === 0) {
//         toast({
//           title: "Error",
//           description: "No data found in the file",
//           variant: "destructive",
//         });
//         return;
//       }

//       // Validate the data structure
//       const firstRow = jsonData[0];
//       const requiredFields = ['name', 'id']; // Add your required fields
//       const missingFields = requiredFields.filter(field => !(field in firstRow));

//       if (missingFields.length > 0) {
//         toast({
//           title: "Missing Required Fields",
//           description: `The following fields are missing: ${missingFields.join(', ')}`,
//           variant: "destructive",
//         });
//         return;
//       }

//       onDataImport(jsonData);
//       toast({
//         title: "Success",
//         description: `Imported ${jsonData.length} records successfully`,
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error importing data:', error);
//       toast({
//         title: "Error",
//         description: "Failed to import data. Please check the file format.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full">
//         <h2 className="text-xl font-bold mb-4">Import Data</h2>
//         <p className="text-sm text-gray-600 mb-4">
//           Upload an Excel file (.xlsx) containing the ID card data.
//           Each row should represent one ID card.
//         </p>
        
//         <div className="space-y-4">
//           <Input
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleFileUpload}
//             disabled={isLoading}
//           />
          
//           <div className="flex justify-end space-x-2">
//             <Button
//               variant="outline"
//               onClick={onClose}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={isLoading}
//             >
//               {isLoading ? 'Importing...' : 'Import'}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 