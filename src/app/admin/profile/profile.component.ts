import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  currentStep = 1;
  flag_data:any;
  flg_first = false;
  sel_record:any =  {
    username: "",
    dob : "",
    father :"" ,
    mother : "",
    occupation : "" ,
    marital_status : "" ,
    gender : "",
    mobile:"",
    email:"",
    citizen:"",
    aadhar:"",
    pan:"",
    guardian:"",
    img:"../../../../../assets/public/image/png/avatar.png",
    perm_addr: {
        "house":"",
        "street":"",
        "local":"",
        "main": "",
        "state":"",
        "district":"",
        "country": "",
        "pin":""
    },
   curr_addr: {
      "house":"",
      "street":"",
      "local":"",
      "main": "",
      "state":"",
      "district":"",
      "country": "",
      "pin":""
  
  }
};

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.flag_data = 0;
    if(history.state.data){
      this.sel_record = history.state.data; 
      this.flag_data = 1;
      this.flg_first = true;
    }
    console.log(this.sel_record);
    
  }
  

  handleSave() {
   
      // Perform final save operation
      this.saveProfile();
   
  }

  handleEdit() {
   
      this.saveProfile();
   
  }
  

  // Example save function
  saveProfile() {
    this.router.navigate(['/inward/profile']);
    console.log('Profile saved');
  }


  isDragOver = false;
  errorMessage = '';

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.handleFile(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFile(input.files);
    }
  }

  handleFile(files: FileList) {
    this.errorMessage = '';
    const file = files[0];
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Only JPEG, PNG, and PDF formats are allowed.';
      return;
    }

    // Check file size (max 50MB)
    const maxSizeInMB = 50;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      this.errorMessage = 'File size should not exceed 50MB.';
      return;
    }

    // Handle file upload logic
    console.log('File selected:', file.name);
    // Implement upload logic here (e.g., send the file to the server)
  }

  rightColumnView = 'upload'; // Default view
  onFileClick() {
      this.rightColumnView = 'file-details'; // Switch to file details view
  }

  // back to upload
    backToUpload(){
      this.rightColumnView = 'upload';
    }
}
