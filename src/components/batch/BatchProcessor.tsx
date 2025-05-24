// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { CardData } from '@/lib/importUtils';
// import { IDCardTemplate } from '@/lib/types';
// import { processBatchData } from '@/lib/importUtils';

// interface BatchProcessorProps {
//   data: CardData[];
//   template: IDCardTemplate;
//   onComplete: () => void;
//   onCancel: () => void;
// }

// export function BatchProcessor({
//   data,
//   template,
//   onComplete,
//   onCancel
// }: BatchProcessorProps) {
//   const [progress, setProgress] = useState(0);
//   const [currentItem, setCurrentItem] = useState(0);
//   const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
//   const [errors, setErrors] = useState<string[]>([]);

//   const processCards = async () => {
//     setStatus('processing');
//     setErrors([]);
    
//     try {
//       // Process data in chunks to avoid browser freezing
//       const chunkSize = 10;
//       const chunks = Array.from({ length: Math.ceil(data.length / chunkSize) }, (_, i) =>
//         data.slice(i * chunkSize, (i + 1) * chunkSize)
//       );

//       for (let i = 0; i < chunks.length; i++) {
//         const chunk = chunks[i];
        
//         // Process each chunk
//         const result = await processBatchData(
//           chunk,
//           template,
//           Object.values(template.fields),
//           {
//             templateId: template.id || '',
//             dataSource: { type: 'json', config: { fieldMapping: {} } },
//             outputConfig: {
//               format: 'pdf',
//               naming: { pattern: '{id}' }
//             },
//             validation: {
//               validateFields: true,
//               skipInvalid: true
//             }
//           }
//         );

//         // Update progress
//         const newProgress = ((i + 1) * chunkSize / data.length) * 100;
//         setProgress(Math.min(newProgress, 100));
//         setCurrentItem((i + 1) * chunkSize);

//         // Collect errors
//         if (result.failed.length > 0) {
//           setErrors(prev => [
//             ...prev,
//             ...result.failed.map(f => `Row ${currentItem + 1}: ${f.errors.join(', ')}`)
//           ]);
//         }

//         // Small delay to allow UI updates
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }

//       setStatus('completed');
//       onComplete();
//     } catch (error) {
//       console.error('Batch processing error:', error);
//       setStatus('error');
//       setErrors(prev => [...prev, 'Failed to process batch: ' + (error as Error).message]);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-xl font-bold">Batch Processing</h2>
      
//       <div className="space-y-4">
//         <div className="flex justify-between text-sm text-gray-600">
//           <span>Processing {currentItem} of {data.length} cards</span>
//           <span>{Math.round(progress)}%</span>
//         </div>
        
//         <Progress value={progress} />
        
//         {errors.length > 0 && (
//           <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
//             <h3 className="font-semibold text-red-700 mb-2">Errors</h3>
//             <ul className="text-sm text-red-600 list-disc pl-4">
//               {errors.map((error, index) => (
//                 <li key={index}>{error}</li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end gap-2">
//         {status === 'idle' && (
//           <>
//             <Button variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//             <Button onClick={processCards}>
//               Start Processing
//             </Button>
//           </>
//         )}
        
//         {status === 'processing' && (
//           <Button disabled>
//             Processing...
//           </Button>
//         )}
        
//         {(status === 'completed' || status === 'error') && (
//           <Button onClick={onComplete}>
//             Close
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// } 