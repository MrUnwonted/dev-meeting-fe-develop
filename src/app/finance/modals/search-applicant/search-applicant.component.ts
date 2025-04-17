import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-search-applicant',
  templateUrl: './search-applicant.component.html',
  styleUrl: './search-applicant.component.scss'
})
export class SearchApplicantComponent {
  is_loading:boolean = false;
  @Output() data_out: EventEmitter<any> = new EventEmitter<any>();

  profiles:any ;
  img:any ;
  profile_list:any=[];

  districts :any=[] ;
  proof_types:any=[] ;
  selected_records:any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['SlNo','name',    'place',    'email',    'mobile'];
  selected_rec:any;
  activeRowIndex:any;
// modal button
modalButtons = [
  { text: 'Close', className: 'btn btn-outline-primary-90 xs', action: this.closeDialog.bind(this) },
  { text: 'Add as Applicant', className: 'btn btn-primary-90 xs', action: this.closeDialog.bind(this)}
];
  @ViewChild(MatPaginator) paginator!: MatPaginator;


constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<any>,
  private router: Router,
  private service : ServiceService
) { }
async ngOnInit(): Promise<void> {
  await this.fetch_districts() ;
  await this.fetch_profiles();
  await this.fetch_proof_type();
}


async fetch_proof_type(){
  this.proof_types = this.service.get_cache_data("profile_search_prof_type") ;
  if ( this.proof_types == null ) {
    let param = {"category_id" : 2}
    
    await this.service.postservice("api/v1/get_doc_types_by_category", param  ).toPromise().then( (data:any)  =>{
      this.proof_types = data ; //data.sort((a:any, b:any) => a.int_district_id - b.int_district_id);
     this.service.save_to_cache(data,"profile_search_prof_type")
    }).catch((error) => {
      console.error('Error occurred:', error);
    });;
  }
  console.log( this.proof_types );
}


async fetch_profiles(){
  let param ={"tenant_id" :  1 }

  await this.service.getServiceWithJsonParam("api/v0/get_profiles" , param ).toPromise().then( data =>{
    console.log( data );
    this.profiles = data ;
    this.profile_list = [...this.profiles];
    this.dataSource = new MatTableDataSource(this.profile_list);
    this.dataSource.paginator = this.paginator;
  }).finally(() => {
    this.is_loading = false; // Set loading to false when the data is finished loading
  });
}

async fetch_districts(){
  const state_id = 32 ;
  
  this.districts = this.service.get_cache_data("districts") ;
  if ( this.districts == null ) {
    let param = 32
    let tag : any ="state_id"
    await this.service.getServiceWithJsonParam("api/v0/get_districts" , param,tag   ).toPromise().then( (data:any)  =>{
     this.districts = data.sort((a:any, b:any) => a.int_district_id - b.int_district_id);
     this.districts = this.service.save_to_cache(this.districts, "districts") ;
    });
  }
  console.log( this.districts );
}

  
  do_profile_filter(){
    const searchInput: any = document.getElementById('search01');
    const filterText = searchInput.value.trim().toLowerCase();
    console.log("Filter text:", filterText);

    if (filterText === "") {
        console.log("No filter applied, displaying all data.");
        this.profiles  = [...this.profile_list]; // Restore original list
        return;
    }

    const searchWords = filterText.split(/\s+/); // Split input into words

    this.profiles  = this.profiles.filter((item: any) =>
        Object.values(item).some(value => {
            if (value && typeof value === 'string') {
                const lowerCaseValue = value.toLowerCase();
                return searchWords.every((word:any) => lowerCaseValue.includes(word));
            }
            return false;
        })
    );
    console.log("Filtered data_list:", this.profiles );

  }

  filter_by_idproof(){
    const proof_type: any = document.getElementById('proof_type');
    let proof_no: any = document.getElementById('proof_no')
    proof_no = proof_no.value.trim() ;
    if ( proof_type.value ){
      if ( proof_no.length > 1){
        console.log( proof_no );
        
      }
    }
  }

  clear_filters(){
    console.log("Filter Clear Method");
    
    const search_input = document.getElementById('search01') as HTMLInputElement;
    if (search_input) {
      search_input.value = '';
    }
    
    // const primary_head  = document.getElementById('primary') as HTMLInputElement;
    // primary_head.value = '' ;
    // const sub_subjects  = document.getElementById('sub_subjects') as HTMLInputElement;
    // sub_subjects.value = '' ;

     const advsearch  = document.getElementById('advsearch') as HTMLInputElement;
     advsearch.classList.remove("show")
    this.profiles  = [...this.profile_list]
  }

  filter_district_wise(){
    const selected_district= document.getElementById('district') as HTMLInputElement;
    if (selected_district.value) {
      this.profiles  = [...this.profile_list]
      console.log( selected_district.value  );
      this.profiles = this.profiles.filter( ( item:any) => item.dist_id == selected_district.value  ) ;
      console.log(this.profiles )
    }
  }


  closeDialog(): void {
    // Send data back to the parent component
    this.dialogRef.close({ "data": this.selected_records });
  }


  
  rowActive(row: any, index: number) {
    this.selected_rec = row;

  }

  do_search(){

  }

  
  getPaginationOffset(): number {
    return (this.paginator?.pageIndex || 0) * (this.paginator?.pageSize || 0);
  }



 
}
