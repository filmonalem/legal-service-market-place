import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCalendar,
  heroClock,
  heroUser,
  heroScale,
  heroDocument,
  heroChatBubbleLeftRight,
  heroEye,
  heroXMark,
  heroPlus
} from '@ng-icons/heroicons/outline';
import { ToasterService } from '../../../core/services/toaster.service';
import { BookingService } from './booking.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

interface BookingSlot {
  id: string;
  time: string;
  date: string;
  ethiopianTime: string;
  available: boolean;
}

interface FileWithPreview {
  file: File;
  preview: string | null;
  name: string;
  size: string;
  type: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
    NgIconComponent,
    PageHeaderComponent
  ],
  providers: [
    provideIcons({
      heroCalendar,
      heroClock,
      heroUser,
      heroScale,
      heroDocument,
      heroChatBubbleLeftRight,
      heroEye,
      heroXMark,
      heroPlus
    })
  ],
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  lawyerId: string | null = null;
  userId: string | null = null;
  selectedDate: Date = new Date();
  availableSlots: BookingSlot[] = [];
  isLoading = false;
  selectedFiles: FileWithPreview[] = [];
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
  isDragging = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  showPreviewModal = false;
  selectedPreviewFile: FileWithPreview | null = null;

  consultationTypes = [
    { id: 'initial', label: 'BOOKING.TYPES.INITIAL', duration: 30 },
    { id: 'followup', label: 'BOOKING.TYPES.FOLLOWUP', duration: 45 },
    { id: 'document', label: 'BOOKING.TYPES.DOCUMENT_REVIEW', duration: 60 },
    { id: 'court', label: 'BOOKING.TYPES.COURT_PREP', duration: 90 }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toaster: ToasterService,
    private bookingService: BookingService,
    private router: Router 
  ) {
    this.bookingForm = this.fb.group({
      lawyerId: ['', Validators.required],
      userId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      timeSlot: ['', Validators.required],
      status: ['pending', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      consultationType: ['initial', Validators.required],
      attachments: [[]]
    });

    this.loadAvailableSlots(); 
  }

  ngOnInit() {
    console.log("ngOnInit called");
    const userJson = sessionStorage.getItem("user");
    console.log("User JSON from sessionStorage:", userJson);
  
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userId = user.userId; 
        this.bookingForm.patchValue({ userId: this.userId }); 
        console.log("User ID set:", this.userId); 
      } catch (error) {
        console.error("Error parsing user JSON:", error);
      }
    } else {
      console.warn("No user data found in sessionStorage."); 
    }
  
    this.route.queryParams.subscribe(params => {
      this.lawyerId = params['lawyerId'];
      if (this.lawyerId) {
        this.bookingForm.patchValue({ lawyerId: this.lawyerId });
        this.loadLawyerDetails();
      }
    });
  }

  loadLawyerDetails() {
  }

  loadAvailableSlots() {
    this.availableSlots = [
      { id: '1', time: '9:00 AM', date: '2024-12-04', ethiopianTime: '3:00', available: true },
      { id: '2', time: '10:00 AM', date: '2024-12-04', ethiopianTime: '4:00', available: true },
      { id: '3', time: '11:00 AM', date: '2024-12-04', ethiopianTime: '5:00', available: true },
      { id: '4', time: '2:00 PM', date: '2024-12-04', ethiopianTime: '8:00', available: true },
      { id: '5', time: '3:00 PM', date: '2024-12-04', ethiopianTime: '9:00', available: true },
      { id: '6', time: '4:00 PM', date: '2024-12-04', ethiopianTime: '10:00', available: true }
    ];
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.processFiles(files);
  }

  processFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > this.maxFileSize) {
        this.toaster.error(`File ${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!this.allowedFileTypes.includes(fileExtension)) {
        this.toaster.error(`File type ${fileExtension} is not allowed`);
        continue;
      }

      let preview: string | null = null;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          preview = e.target.result;
          this.updateFileList(file, preview);
        };
        reader.readAsDataURL(file);
      } else {
        this.updateFileList(file, null);
      }
    }
  }

  updateFileList(file: File, preview: string | null) {
    const fileWithPreview: FileWithPreview = {
      file,
      preview,
      name: file.name,
      size: this.formatFileSize(file.size),
      type: file.type
    };
    this.selectedFiles.push(fileWithPreview);
    this.bookingForm.patchValue({ attachments: this.selectedFiles });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.bookingForm.patchValue({ attachments: this.selectedFiles });
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async onSubmit() {
    if (this.bookingForm.valid) {
      this.isLoading = true;
  
      const formData = this.createFormData();
  
      this.bookingService.createBooking(formData).subscribe({
        next: () => {
          this.toaster.success('Booking created successfully');
          this.router.navigate(['/client/appointments']);
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error creating booking';
          this.toaster.error(errorMessage);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      const firstInvalidControl = Object.keys(this.bookingForm.controls).find(control => {
        return this.bookingForm.controls[control].invalid;
      });
      const errorMessage = firstInvalidControl ? `Please fill in the ${firstInvalidControl} field correctly.` : 'Please fill in all required fields';
      this.toaster.error(errorMessage);
    }
  }
  createFormData(): FormData {
    const formData = new FormData();
    
    formData.append('userId', this.userId || ''); 
    formData.append('lawyerId', this.bookingForm.value.lawyerId);
    formData.append('date', this.bookingForm.value.date);
    formData.append('timeSlot', this.bookingForm.value.timeSlot);
    formData.append('status', this.bookingForm.value.status);
    formData.append('description', this.bookingForm.value.description);
    formData.append('consultationType', this.bookingForm.value.consultationType);
    
    this.selectedFiles.forEach((fileWithPreview, index) => {
      formData.append(`file${index}`, fileWithPreview.file);
    });

    return formData;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  openPreview(file: FileWithPreview) {
    this.selectedPreviewFile = file;
    this.showPreviewModal = true;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true; 
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  closePreview() {
    this.showPreviewModal = false;
    this.selectedPreviewFile = null;
  }
}