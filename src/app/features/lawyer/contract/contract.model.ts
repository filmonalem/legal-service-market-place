// src/app/models/contract.model.ts
export interface Contract {
    id: string;
    lawyerId: string;
    lawyerName: string;
    lawyerPhotoURL: string;
    termStart: Date;
    termEnd: Date;
    purpose: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    date: string; // Add these properties if they exist in your API
    time: string; // Add these properties if they exist in your API
    type: string; // Add these properties if they exist in your API
  }