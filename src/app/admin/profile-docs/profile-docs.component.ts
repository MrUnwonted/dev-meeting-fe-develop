import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-profile-docs', 
  templateUrl: './profile-docs.component.html',
  styleUrl: './profile-docs.component.scss'
})
export class ProfileDocsComponent {

  images = [
    { title: 'Aadhar Card', src: '../.../../../../../../assets/public/image/png/aadhar.png', alt: 'Image 1' },
    { title: 'Aadhar Card', src: '../.../../../../../../assets/public/image/png/aadhar.png', alt: 'Image 1' },

  ];

  swiperConfig: any;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  swiperInstance!: Swiper;
  @Input() data_flg: any ;


  constructor(private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.initializeSwiper();
    if(this.data_flg>0){

      this.images = [
        { title: 'Aadhar Card', src: '../.../../../../../../assets/public/image/png/aadhar.png', alt: 'Image 1' },
        { title: 'Birth Certificate', src: '../.../../../../../../assets/public/image/png/docs1.png', alt: 'Image 2' },
        { title: 'Passport', src: '../.../../../../../../assets/public/image/png/passport.jpg', alt: 'Image 3' },
        { title: 'Voters ID', src: '../.../../../../../../assets/public/image/png/election_id.jpg', alt: 'Image 4' },
      ];
    }
  }

  ngAfterViewInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      // Reinitialize Swiper after modal is opened
      setTimeout(() => {
        if (this.swiperInstance) {
          this.swiperInstance.update();
          this.swiperInstance.pagination.render(); // Force re-render of pagination
          this.swiperInstance.pagination.update(); // Ensure pagination is interactive
        }
      }, 0); // Ensures this runs after Swiper has rendered
    });
  }

  initializeSwiper(): void {
    this.swiperConfig = {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      autoplay: false,
      pagination: {
        clickable: true,
        
        renderBullet: (index: number, className: string) => {
          // Ensure index is valid and within bounds of images array
          if (index < this.images.length) {
            return `
              <div class="${className} pagination-each">
                <span class="image-thumb" style="background-image: url('${this.images[index].src}');"></span>
                <span class="title">${this.images[index].title}</span>
              </div>
            `;
          }
          return `<span class="${className}"></span>`;
        }
      }
    };

    // Initialize Swiper instance
    if (this.swiperContainer) {
      this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, this.swiperConfig);
    }
  }

}
