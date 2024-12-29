// src/app/models/booking.model.ts
export interface Document {
    documentId: string;
    lawyerId: string;
    title: string;
    description: string;
    filePath: string;
    fileName: string;
    fileSize: number;
    type: string;
    versionNumber: number;
    accessibleBy: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Booking {
    bookingId: string;
    lawyerPhotoURL?: string;
    userId: string;
    lawyerId: string;
    date: string;
    fullName: string;
    timeSlot: string;
    status: string;
    description: string;
    consultationType: string;
    document: Document;
  }