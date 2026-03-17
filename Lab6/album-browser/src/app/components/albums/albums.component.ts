import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 добавь
import { Router } from '@angular/router';
import { AlbumService } from '../../services/album.service';
import { Album } from '../../models/album.model';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  loading = true;

  constructor(
    private albumService: AlbumService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.albumService.getAlbums().subscribe({
      next: (data) => {
        this.albums = data;
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

  goToAlbum(id: number): void {
    this.router.navigate(['/albums', id]);
  }

  deleteAlbum(id: number, event: Event): void {
    event.stopPropagation();
    this.albumService.deleteAlbum(id).subscribe({
      next: () => {
        this.albums = this.albums.filter(a => a.id !== id);
        this.cdr.detectChanges();
      }
    });
  }
}
