// src/app/features/portal/posts/post-display.component.ts
import { Component, OnInit } from '@angular/core';
import { PostService, CreatePostDto } from '../../../core/services/admin/posts.service';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-display',
  standalone: true,
  imports: [CommonModule,  RouterLink],
  templateUrl: './posts.component.html', // Make sure this points to the correct template
  styleUrls: ['./posts.component.css']
})
export class PostDisplayComponent implements OnInit {
  posts: CreatePostDto[] = [];
  placeholderImage: string = 'path/to/placeholder.png'; 

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
  getImageSrc(image: string): string {
    return image || this.placeholderImage;
  }
}