import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
  loading = true;
  editTitle = '';
  saved = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.albumService.getAlbum(id).subscribe({
      next: (data) => {
        this.album = data;
        this.editTitle = data.title;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveAlbum(): void {
    if (!this.album) return;
    const updated: Album = { ...this.album, title: this.editTitle };
    this.albumService.updateAlbum(updated).subscribe({
      next: () => {
        this.album!.title = this.editTitle;
        this.saved = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.saved = false;
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  viewPhotos(): void {
    this.router.navigate(['/albums', this.album!.id, 'photos']);
  }

  goBack(): void {
    this.router.navigate(['/albums']);
  }
}
