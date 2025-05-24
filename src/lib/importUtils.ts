// import { 
//   ElementType, 
//   TextElement, 
//   Position, 
//   IDCardTemplate,
//   IDCardFieldDefinition, 
 
// } from './types';

// export interface StudentData {
//   [key: string]: string;  // Dynamic key-value pairs for student data
// }

// export interface ImportConfig {
//   fieldMappings: {
//     [key: string]: {
//       label: string;
//       position: Position;
//       style?: Partial<TextElement['data']>;
//     };
//   };
// }

// export interface CardData {
//   [key: string]: string | number | boolean | null;
// }

// export interface ValidationResult {
//   isValid: boolean;
//   errors: {
//     field: string;
//     message: string;
//   }[];
// }

// /**
//  * Creates text elements for a student's ID card based on field mappings
//  */
// export function createStudentElements(
//   studentData: StudentData,
//   config: ImportConfig
// ): ElementType[] {
//   return Object.entries(config.fieldMappings).map(([fieldKey, fieldConfig]) => {
//     const value = studentData[fieldKey] || '';
    
//     const element: TextElement = {
//       id: `${fieldKey}-${Math.random().toString(36).substr(2, 9)}`,
//       type: 'text',
//       position: fieldConfig.position,
//       zIndex: 1,
//       data: {
//         text: value,
//         fieldKey,
//         fieldLabel: fieldConfig.label,
//         isField: true,
//         fontSize: 16,
//         fontFamily: 'Arial',
//         color: '#000000',
//         fontWeight: 'normal',
//         fontStyle: 'normal',
//         textAlign: 'left',
//         width: 150,
//         height: 30,
//         ...fieldConfig.style
//       }
//     };
    
//     return element;
//   });
// }

// /**
//  * Validates card data against template field requirements
//  */
// export function validateCardData(
//   data: CardData,
//   template: IDCardTemplate,
//   fields: IDCardFieldDefinition[]
// ): ValidationResult {
//   const errors = [];
  
//   for (const [fieldKey, fieldConfig] of Object.entries(template.fields)) {
//     if (!fieldConfig.isRequired && !data[fieldKey]) continue;
    
//     const fieldDef = fields.find(f => f.key === fieldKey);
//     if (!fieldDef) continue;
    
//     // Check required fields
//     if (fieldConfig.isRequired && !data[fieldKey]) {
//       errors.push({
//         field: fieldKey,
//         message: `${fieldDef.label} is required`
//       });
//       continue;
//     }
    
//     // Skip validation if no value
//     if (!data[fieldKey]) continue;
    
//     const value = String(data[fieldKey]);
    
//     // Validate based on field type and validation rules
//     if (fieldDef.validation) {
//       // Pattern validation
//       if (fieldDef.validation.pattern) {
//         const regex = new RegExp(fieldDef.validation.pattern);
//         if (!regex.test(value)) {
//           errors.push({
//             field: fieldKey,
//             message: `${fieldDef.label} has invalid format`
//           });
//         }
//       }
      
//       // Length validation
//       if (fieldDef.validation.minLength && value.length < fieldDef.validation.minLength) {
//         errors.push({
//           field: fieldKey,
//           message: `${fieldDef.label} must be at least ${fieldDef.validation.minLength} characters`
//         });
//       }
      
//       if (fieldDef.validation.maxLength && value.length > fieldDef.validation.maxLength) {
//         errors.push({
//           field: fieldKey,
//           message: `${fieldDef.label} must not exceed ${fieldDef.validation.maxLength} characters`
//         });
//       }
//     }
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// }

// /**
//  * Creates elements for an ID card based on template and data
//  */
// export function createCardElements(
//   cardData: CardData,
//   template: IDCardTemplate,
//   fields: IDCardField[]
// ): ElementType[] {
//   const elements: ElementType[] = [];
  
//   // Create elements for each field in the template
//   for (const [fieldKey, fieldConfig] of Object.entries(template.fields)) {
//     if (!fieldConfig.isVisible) continue;
    
//     const fieldDef = fields.find(f => f.key === fieldKey);
//     if (!fieldDef) continue;
    
//     const value = cardData[fieldKey] || fieldDef.defaultValue || '';
    
//     // Create different types of elements based on field type
//     switch (fieldDef.type) {
//       case 'text':
//         elements.push(createTextElement(
//           fieldKey,
//           String(value),
//           fieldDef.label,
//           fieldConfig.position,
//           fieldConfig.style
//         ));
//         break;
        
//       case 'image':
//         // Add image element creation logic
//         break;
        
//       case 'qrcode':
//         // Add QR code element creation logic
//         break;
        
//       case 'barcode':
//         // Add barcode element creation logic
//         break;
        
//       case 'date':
//         // Format date value
//         const dateStr = formatDate(value);
//         elements.push(createTextElement(
//           fieldKey,
//           dateStr,
//           fieldDef.label,
//           fieldConfig.position,
//           fieldConfig.style
//         ));
//         break;
//     }
//   }
  
//   return elements;
// }

// /**
//  * Creates a text element with the given properties
//  */
// function createTextElement(
//   fieldKey: string,
//   value: string,
//   label: string,
//   position: Position,
//   style?: Partial<TextElement['data']>
// ): TextElement {
//   return {
//     id: `${fieldKey}-${Math.random().toString(36).substr(2, 9)}`,
//     type: 'text',
//     position,
//     zIndex: 1,
//     data: {
//       text: value,
//       fieldKey,
//       fieldLabel: label,
//       isField: true,
//       fontSize: 16,
//       fontFamily: 'Arial',
//       color: '#000000',
//       fontWeight: 'normal',
//       fontStyle: 'normal',
//       textAlign: 'left',
//       width: 150,
//       height: 30,
//       ...style
//     }
//   };
// }

// /**
//  * Format date values based on locale
//  */
// function formatDate(value: string | number | boolean | null): string {
//   if (!value) return '';
  
//   try {
//     // Convert boolean to string before creating Date
//     const dateValue = typeof value === 'boolean' ? String(value) : value;
//     const date = new Date(dateValue);
//     return date.toLocaleDateString();
//   } catch {
//     return String(value);
//   }
// }

// /**
//  * Process batch data for ID card generation
//  */
// export async function processBatchData(
//   data: CardData[],
//   template: IDCardTemplate,
//   fields: IDCardField[],
//   config: BatchProcessConfig
// ): Promise<{
//   success: CardData[];
//   failed: { data: CardData; errors: string[] }[];
// }> {
//   const results = {
//     success: [] as CardData[],
//     failed: [] as { data: CardData; errors: string[] }[]
//   };
  
//   for (const item of data) {
//     const validation = validateCardData(item, template, fields);
    
//     if (!validation.isValid && config.validation?.stopOnError) {
//       results.failed.push({
//         data: item,
//         errors: validation.errors.map(e => e.message)
//       });
//       break;
//     }
    
//     if (validation.isValid || config.validation?.skipInvalid) {
//       results.success.push(item);
//     } else {
//       results.failed.push({
//         data: item,
//         errors: validation.errors.map(e => e.message)
//       });
//     }
//   }
  
//   return results;
// }

// /**
//  * Example usage:
//  * 
//  * const config: ImportConfig = {
//  *   fieldMappings: {
//  *     name: {
//  *       label: 'Student Name',
//  *       position: { x: 100, y: 100 },
//  *       style: { fontSize: 20, fontWeight: 'bold' }
//  *     },
//  *     class: {
//  *       label: 'Class',
//  *       position: { x: 100, y: 150 }
//  *     },
//  *     rollNo: {
//  *       label: 'Roll Number',
//  *       position: { x: 100, y: 200 }
//  *     }
//  *   }
//  * };
//  * 
//  * const studentData = {
//  *   name: 'John Doe',
//  *   class: '10-A',
//  *   rollNo: '2023001'
//  * };
//  * 
//  * const elements = createStudentElements(studentData, config);
//  */ 