import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import {
  AngularEditorConfig,
  AngularEditorModule,
} from "@kolkov/angular-editor";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  heroBars3,
  heroBold,
  heroItalic,
  heroUnderline,
  heroStrikethrough,
  heroCodeBracket,
  heroDocument,
  heroListBullet,
  heroArrowUturnLeft,
  heroArrowUturnRight,
  heroChevronLeft,
  heroChevronRight,
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
  heroDocumentText,
  heroDocumentDuplicate,
  heroMinusSmall,
  heroMinus,
  heroBars3CenterLeft,
  heroBars3BottomRight,
  heroBars3BottomLeft,
  heroLink,
} from '@ng-icons/heroicons/outline';
import { CommonModule } from "@angular/common";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { ToasterService } from '../../../core/services/toaster.service';
import { Router } from '@angular/router';
import { PostService } from "../../../core/services/admin/posts.service";
interface Posts{
  post:string;
}
@Component({
  selector: "app-post",
  standalone: true,
  imports: [
    HttpClientModule,
    AngularEditorModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
  ],
  providers: [
    provideIcons({
      heroBars3,
      heroBold,
      heroItalic,
      heroUnderline,
      heroStrikethrough,
      heroCodeBracket,
      heroDocument,
      heroListBullet,
      heroArrowUturnLeft,
      heroArrowUturnRight,
      heroChevronLeft,
      heroChevronRight,
      heroChevronDoubleLeft,
      heroChevronDoubleRight,
      heroDocumentText,
      heroDocumentDuplicate,
      heroMinusSmall,
      heroMinus,
      heroLink,
      heroBars3BottomLeft,
      heroBars3BottomRight,
    }),
  ],
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostComponent implements OnInit {
  @ViewChild('editor') editor!: ElementRef;
  content: string = '';
  currentAlignment: 'left' | 'center' | 'right' = 'left';
  currentFont: string = 'Arial';
  currentFontSize: string = '16px';

  private undoStack: string[] = [];
  private redoStack: string[] = [];

  constructor(
    private toaster: ToasterService,
    private postService: PostService,
    private router: Router 
  ) {}

  isLoading = false;
  isShowForm = false;
  isViewOpen = true;
  postTitle: string = '';
  postDescription: string = '';
  imagePreview: string | null = null;
  submitted: boolean = false;

  stats = [
    { label: 'POSTS.STATS.ACTIVE_CASES', value: 0, bgClass: 'p-2 bg-blue-100 dark:bg-blue-900/20', icon: 'heroFolder', iconColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'POSTS.STATS.PENDING_TASKS', value: 0, bgClass: 'p-2 bg-amber-100 dark:bg-amber-900/20', icon: 'heroClipboardDocument', iconColor: 'text-amber-600 dark:text-amber-400' },
    { label: 'POSTS.STATS.UPCOMING_APPOINTMENTS', value: 0, bgClass: 'p-2 bg-green-100 dark:bg-green-900/20', icon: 'heroCalendar', iconColor: 'text-green-600 dark:text-green-400' },
    { label: 'POSTS.STATS.UNREAD_MESSAGES', value: 100, bgClass: 'p-2 bg-purple-100 dark:bg-purple-900/20', icon: 'heroChatBubbleLeftRight', iconColor: 'text-purple-600 dark:text-purple-400' },
  ];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "300px",
    minHeight: "200px",
    placeholder: "Enter text here...",
    translate: "no",
    fonts: [
      { class: "arial", name: "Arial" },
      { class: "times-new-roman", name: "Times New Roman" },
      { class: "calibri", name: "Calibri" },
      { class: "comic-sans-ms", name: "Comic Sans MS" },
    ],
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["subscript", "superscript"]],
  };

  ngOnInit() {
    setTimeout(() => {
      if (this.editor && this.editor.nativeElement) {
        if (!this.editor.nativeElement.innerHTML) {
          this.editor.nativeElement.innerHTML = '<p><br></p>';
        }
        this.editor.nativeElement.style.direction = 'ltr';
        this.editor.nativeElement.style.unicodeBidi = 'embed';
        this.focusEditor();
      }
    });
  }
  isFormatActive(command: string): boolean {
    return document.queryCommandState(command);
  }
  focusEditor() {
    const range = document.createRange();
    const sel = window.getSelection();
    const firstChild = this.editor.nativeElement.firstChild;

    if (firstChild) {
      range.setStart(firstChild, 0);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
      this.editor.nativeElement.focus(); // Ensure the editor is focused
    }
  }

  formatText(command: string, value?: string) {
    this.saveState();
    if (command.startsWith('justify')) {
      this.currentAlignment = command.toLowerCase().replace('justify', '') as 'left' | 'center' | 'right';
    }
    document.execCommand(command, false, value);
    this.editor.nativeElement.focus();
  }

  onContentChange(event: Event) {
    const target = event.target as HTMLDivElement;
    this.content = target.innerHTML;
    this.saveState();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.formatText('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          this.undo();
          break;
        case 'y':
          event.preventDefault();
          this.redo();
          break;
      }
    }
  }

  private saveState() {
    this.undoStack.push(this.content);
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) {
      const current = this.undoStack.pop();
      if (current) {
        this.redoStack.push(current);
        this.content = this.undoStack[this.undoStack.length - 1];
        this.editor.nativeElement.innerHTML = this.content;
      }
    }
  }

  redo() {
    const state = this.redoStack.pop();
    if (state) {
      this.undoStack.push(state);
      this.content = state;
      this.editor.nativeElement.innerHTML = this.content;
    }
  }

  insertImage() {
    const imageUrl = prompt("Enter Image URL");
    if (imageUrl) {
      document.execCommand("insertImage", false, imageUrl);
    }
  }

  insertLink() {
    const url = prompt("Enter URL");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  }

  toggleForm() {
    this.isShowForm = true;
    this.isViewOpen = false;
  }

  showView() {
    this.isShowForm = false;
    this.isViewOpen = true;
    const open=this.isViewOpen=true;
    if(open){
      this.postService.getPosts ().subscribe({
        
      });
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.imagePreview = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  onSubmit() {
    this.submitted = true;

    // Validations
    if (!this.postTitle || !this.postDescription || !this.content) {
        this.toaster.error('Please fill out all required fields.');
        return;
    }

    const postData: {
        title: string;
        description: string;
        content: string;
        uploadBy: string;
        fileImages: string[]; 
    } = {
        title: this.postTitle,
        description: this.postDescription,
        content: this.content,
        uploadBy: "user@example.com", 
        fileImages: [] 
    };

    if (this.imagePreview) {
        postData.fileImages.push(this.imagePreview);
    }

    this.postService.createPost(postData).subscribe(
        (response) => {
            console.log('Post created successfully', response);
            this.toaster.success('MESSAGE.SUCCESS.CREATED');
            this.router.navigate(['/admin/post']);
        },
        (error) => {
            console.error('Error creating post', error);
            this.toaster.error('MESSAGE.ERROR.CREATED');
        }
    );
}
  changeFont(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.currentFont = selectElement.value;
    this.updateEditorStyle();
  }

  // Method to change the font size
  changeFontSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.currentFontSize = selectElement.value;
    this.updateEditorStyle();
  }

  // Update editor style based on current font and size
  updateEditorStyle(): void {
    const editor = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (editor) {
      editor.style.fontFamily = this.currentFont;
      editor.style.fontSize = this.currentFontSize;
    }
  }

  saveDraft() {
  }
publishPost() {
  this.onSubmit();
  } 
}