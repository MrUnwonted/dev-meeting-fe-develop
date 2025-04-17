import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { WfChecklistComponent } from '../wf-checklist/wf-checklist.component';

@Component({
  selector: 'app-subject-wf-steps',

  templateUrl: './subject-wf-steps.component.html',
  styleUrl: './subject-wf-steps.component.scss'
})
export class SubjectWfStepsComponent {

  currentStep: number = 5;
  selectedSubject: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['slNo', 'stage', 'step', 'edit'];

  dataSource: any = MatTableDataSource<any>;
  selectedRow: any;
  isEditable: any;
  activeRowIndex: number | null = null;
  subject_id: any;
  stage_list: any = [];
  flg_load: boolean = false;

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  // }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private commonsvr: ServiceService,
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log("testing");
    
  }

  
  ngOnInit(): void {
    this.subject_id = 2;
    this.dataSource = new MatTableDataSource<any>;
    this.fetch_stage_list();
  }

  onRowClick(e: any) {

    console.log(JSON.stringify(e, null, 2)+ "TESTING THIS");
    

    const dialogRef = this.dialog.open(WfChecklistComponent, {
      width: '80%',
      data: {
        step_id: e.step_id,    
        flag: null,
        step_name: e.step_name,
        stage: e.stage
      }
    });
  }

  fetch_stage_list() {
    this.flg_load = true;
    let param = {
      "subject_id": 2
    }
    this.commonsvr.getService('api/v0/get_subject_wfsteps', param).subscribe((res: any) => {
      console.log(res + "   res is working or not ");

      this.stage_list = res;
      this.dataSource = new MatTableDataSource(this.stage_list);
      this.dataSource.paginator = this.paginator;
      this.flg_load = false;

    });
  }
}
