import { IDCardTemplate, IDCardData, IDCardBatch, IDCardFieldDefinition } from '@/lib/types';

// Example corporate template fields
export const corporateFields: Record<string, IDCardFieldDefinition> = {
  employeeId: {
    key: 'employeeId',
    label: 'Employee ID',
    type: 'text',
    required: true,
    validation: {
      pattern: '^EMP\\d{5}$'  // Format: EMP12345
    }
  },
  name: {
    key: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    style: {
      fontSize: 24,
      fontWeight: 'bold'
    }
  },
  designation: {
    key: 'designation',
    label: 'Designation',
    type: 'text',
    required: true
  },
  department: {
    key: 'department',
    label: 'Department',
    type: 'text',
    required: true
  },
  photo: {
    key: 'photo',
    label: 'Photo',
    type: 'image',
    required: true
  },
  validUntil: {
    key: 'validUntil',
    label: 'Valid Until',
    type: 'date',
    required: true,
    validation: {
      format: 'DD-MMM-YYYY'
    }
  }
};

// Example student template fields
export const studentFields: Record<string, IDCardFieldDefinition> = {
  rollNumber: {
    key: 'rollNumber',
    label: 'Roll Number',
    type: 'text',
    required: true
  },
  name: {
    key: 'name',
    label: 'Student Name',
    type: 'text',
    required: true,
    style: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  },
  class: {
    key: 'class',
    label: 'Class',
    type: 'text',
    required: true
  },
  section: {
    key: 'section',
    label: 'Section',
    type: 'text',
    required: true
  },
  photo: {
    key: 'photo',
    label: 'Photo',
    type: 'image',
    required: true
  }
};

export function createCardData(
  templateId: string,
  values: Record<string, string>,
  batchId?: string
): IDCardData {
  return {
    templateId,
    values,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      batchId
    }
  };
}

export function validateCardData(
  data: Record<string, string>,
  template: IDCardTemplate
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check each field in the template
  Object.entries(template.fields).forEach(([key, field]) => {
    const value = data[key];
    const def = field.definition;

    // Check required fields
    if (def.required && !value) {
      errors.push(`${def.label} is required`);
      return;
    }

    if (!value) return; // Skip validation for optional empty fields

    // Validate based on field type
    switch (def.type) {
      case 'text':
        if (def.validation?.pattern) {
          const regex = new RegExp(def.validation.pattern);
          if (!regex.test(value)) {
            errors.push(`${def.label} has invalid format`);
          }
        }
        break;

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${def.label} must be a number`);
        } else {
          if (def.validation?.min !== undefined && num < def.validation.min) {
            errors.push(`${def.label} must be at least ${def.validation.min}`);
          }
          if (def.validation?.max !== undefined && num > def.validation.max) {
            errors.push(`${def.label} must not exceed ${def.validation.max}`);
          }
        }
        break;

      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          errors.push(`${def.label} must be a valid date`);
        }
        break;
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function processCardBatch(
  cards: Record<string, string>[],
  template: IDCardTemplate
): IDCardBatch {
  const batchId = `batch_${Date.now()}`;
  const batch: IDCardBatch = {
    id: batchId,
    templateId: template.id || '',
    name: `Batch ${new Date().toLocaleDateString()}`,
    cards: [],
    status: 'pending',
    createdAt: new Date().toISOString(),
    totalCards: cards.length,
    processedCards: 0,
    failedCards: 0
  };

  // Process each card
  cards.forEach(cardData => {
    const validation = validateCardData(cardData, template);
    if (validation.isValid) {
      batch.cards.push(createCardData(template.id || '', cardData, batchId));
      batch.processedCards++;
    } else {
      batch.failedCards++;
    }
  });

  batch.status = batch.failedCards === 0 ? 'completed' : 'completed';
  batch.completedAt = new Date().toISOString();

  return batch;
}

// Example usage:
/*
const corporateTemplate: IDCardTemplate = {
  id: 'corporate_template_1',
  templateType: 'corporate',
  fields: {
    employeeId: {
      definition: corporateFields.employeeId,
      position: { x: 100, y: 100 },
      isVisible: true
    },
    name: {
      definition: corporateFields.name,
      position: { x: 100, y: 150 },
      isVisible: true
    }
    // ... other fields
  },
  layout: {
    orientation: 'portrait',
    dimensions: { width: 85.6, height: 53.98, unit: 'mm' }
  }
};

const employeeData = {
  employeeId: 'EMP12345',
  name: 'John Doe',
  designation: 'Software Engineer',
  department: 'Engineering',
  validUntil: '31-Dec-2024'
};

const validation = validateCardData(employeeData, corporateTemplate);
if (validation.isValid) {
  const cardData = createCardData(corporateTemplate.id, employeeData);
  // Process the card...
}
*/ 