export interface LawyerProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  location: string;
  specialization: string;
  barNumber: string;
  experience: number;
  languages: string[];
  bio: string;
  hourlyRate: number;
  documents?: {
    degree?: File | null;
    license?: File | null;
    certificates?: File | null;
  };
}

export interface LawyerProfile extends LawyerProfileData {
  // Add any additional properties specific to LawyerProfile here
} 