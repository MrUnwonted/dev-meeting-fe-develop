import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-rpt-pms-activities',
  templateUrl: './rpt-pms-activities.component.html',
  styleUrl: './rpt-pms-activities.component.scss'
})
export class RptPmsActivitiesComponent {

  emp_data: any[] = 
  [
    {
        "empid": 2,
        "userid": 55,
        "empcode": "E001",
        "empname": "AIBY MOHANDAS",
        "emailid": "aiby@techpool.co.in",
        "mobile": "9544288099",
        "doj": "2011-01-01",
        "tny_status": 1,
        "officialid": 1,
        "officeid": 1,
        "dept_id": 4,
        "design_id": 3,
        "designation": "SOLUTION ARCHITECT",
        "department_name": "SOFTWARE DIVISION"
    },
    {
        "empid": 3,
        "userid": 56,
        "empcode": "E002",
        "empname": "RAGI K MATHAI",
        "emailid": "ragi@techpool.co.in",
        "mobile": "9995454000",
        "doj": "2011-01-01",
        "tny_status": 1,
        "officialid": 2,
        "officeid": 1,
        "dept_id": 1,
        "design_id": 2,
        "designation": "MANAGING DIRECTOR",
        "department_name": "IT CONSULTANCY DIVISION"
    },
    {
        "empid": 4,
        "userid": 57,
        "empcode": "E003",
        "empname": "SREEJA C",
        "emailid": "sreeja@techpool.co.in",
        "mobile": "9446496807",
        "doj": "2022-01-01",
        "tny_status": 1,
        "officialid": 3,
        "officeid": 1,
        "dept_id": 4,
        "design_id": 5,
        "designation": "PROJECT MANAGER",
        "department_name": "SOFTWARE DIVISION"
    },
    {
        "empid": 5,
        "userid": 58,
        "empcode": "E004",
        "empname": "ARCHA SS",
        "emailid": "archa.ss@techpool.co.in",
        "mobile": "7736228708",
        "doj": "2022-03-01",
        "tny_status": 1,
        "officialid": 4,
        "officeid": 1,
        "dept_id": 4,
        "design_id": 9,
        "designation": "SOFTWARE PROGRAMMER",
        "department_name": "SOFTWARE DIVISION"
    },
    {
        "empid": 11,
        "userid": 93,
        "empcode": "E009",
        "empname": "ABHIJITH A",
        "emailid": "abhijith@techpool.co.in",
        "mobile": "9605067411",
        "doj": "2025-02-10",
        "tny_status": 1,
        "officialid": 10,
        "officeid": 1,
        "dept_id": 4,
        "design_id": 9,
        "designation": "SOFTWARE PROGRAMMER",
        "department_name": "SOFTWARE DIVISION"
    },
    {
        "empid": 10,
        "userid": 92,
        "empcode": "E008",
        "empname": "ARJUN",
        "emailid": "arjun@techpool.co.in",
        "mobile": "9207245270",
        "doj": "2025-02-17",
        "tny_status": 1,
        "officialid": 9,
        "officeid": 1,
        "dept_id": 4,
        "design_id": 9,
        "designation": "SOFTWARE PROGRAMMER",
        "department_name": "SOFTWARE DIVISION"
    },
    {
        "empid": 9,
        "userid": 91,
        "empcode": "E101",
        "empname": "SREEHARI S S",
        "emailid": "sreehariyes77@gmail.com",
        "mobile": "9747975825",
        "doj": "2025-02-03",
        "tny_status": 1,
        "officialid": 8,
        "officeid": 1,
        "dept_id": 4,
        "design_id": 10,
        "designation": "PROGRAMMER TRAINEE",
        "department_name": "SOFTWARE DIVISION"
    }
];

 emp_id: any;
 emp_name : any;
 dt_from: any  = null
 dt_to: any  = null
 emp_report =  new MatTableDataSource<any>();
 formattedDateFrom: string = '';
 displayedColumns: string[] = ['index', 'project_name', 'emp_code', 'task_name', 'sub_task_name', 'activity_with_hours','estimated_hours','actual_hours','total_daily_hours'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 print:boolean=false;
 show_details_table:boolean=false; 

  constructor(
     private svr: ServiceService,
   
  ) { }

  ngOnInit() {
    this.emp_report.paginator = this.paginator;
  }

  selectUser() {
    const randomIndex = Math.floor(Math.random() * this.emp_data.length);
    const selectedEmployee = this.emp_data[randomIndex];
    this.emp_id = selectedEmployee.empid;
    this.emp_name = selectedEmployee.empname + ' (' + selectedEmployee.empcode + ')';
    console.log('Selected emp_id:', this.emp_id, 'Selected emp_name:', this.emp_name);
  }

  go() {
    this.emp_report.data = [];
    this.show_details_table = false;
    if (this.validation()) {
      
      let param = {
        "resource_id": this.emp_id,
        "dt_from": this.formatDate(this.dt_from),
        "dt_to": this.formatDate(this.dt_to),
      };

      this.svr.postservice("api/v0/get_activity_report_resource_wise",param).subscribe((res: any) => {
        if (res && res.length !== 0) {
          this.show_details_table = true;
          this.emp_report = new MatTableDataSource(res);
          this.emp_report.paginator = this.paginator;
        }
        
        
      })
    }
  }


  validation() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Validate Employee Selection
    if (!this.emp_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select employee',
      });
      return false;
    }
  
    // If either date exists, validate date range and future dates
    if (this.dt_from || this.dt_to) {
      const fromDate = this.dt_from ? new Date(this.dt_from) : null;
      const toDate = this.dt_to ? new Date(this.dt_to) : null;
  
      // Ensure both dates are valid before checking conditions
      if (fromDate && toDate) {
        if (fromDate > toDate) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Date Range',
            text: 'From Date cannot be greater than To Date',
          });
          return false;
        }
      }
  
      // Check if dates are in the future
      if ((fromDate && fromDate > today) || (toDate && toDate > today)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Date',
          text: 'Future dates cannot be selected',
        });
        return false;
      }
    }
  
    return true;
  }
  
  isButtonDisabled(): boolean {
    const isEmpValid = !!this.emp_name?.trim();
    const isDateRangeValid = !!this.dt_from || !!this.dt_to;
    return !(isEmpValid && isDateRangeValid);
  }
  
  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.emp_report.filter = filterValue.trim().toLowerCase();
  }



  exportToExcel() {
    // Create a formatted Excel data structure
    const data = this.emp_report.data.map((item, index) => {
      return {
        'S.No': index + 1,
        'Project Name': item.project_name || '',
        'Employee Code': item.emp_code || '',
        'Task Name': item.task_name || '',
        'Sub Task Name': item.sub_task_name || '',
        'Activity with Hours': item.activity_with_hours || '',
        'Estimated Hours': item.estimated_hours || 0,
        'Actual Hours': item.actual_hours || 0,
        'Total Daily Hours': item.total_daily_hours || 0
      };
    });
  
    // Create worksheet and workbook
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Report');
  
    // Customize column widths for better readability
    ws['!cols'] = [
      { wch: 5 },   // S.No
      { wch: 12 },  // Project ID
      { wch: 15 },  // Employee Code
      { wch: 25 },  // Task Name
      { wch: 25 },  // Sub Task Name
      { wch: 20 },  // Activity with Hours
      { wch: 15 },  // Estimated Hours
      { wch: 15 },  // Actual Hours
      { wch: 20 }   // Total Daily Hours
    ];
  
    // Save the Excel file
    XLSX.writeFile(wb, 'Activity_Report.xlsx');
  }
  
  printing(){
    this.print=true;
  }



}
