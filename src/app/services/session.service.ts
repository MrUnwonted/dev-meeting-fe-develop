import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _user_name: any ;
  private _emp_code: any;
  private _designation: any;
  private _unit_id: any;
  private _ott_id: Number = -1;
  private _ott: String = "";
  private _user_id: Number = -1;
  private _module_id: Number = -1;
  private _email: String = "";
  private _mobile: String = "";
  private _designation_id: Number = -1;
  private _role: String = "";
  private _active: boolean = false; 
  private _year_id : Number = 2024 ;
  private _seat_id : Number = -1 ;

  private _office_name: any;
  private _office_name_ln: any;
  private _seat_name: any;
  private _seat_name_ln: any;
  private _seat_code: any;
  private _office_code: any;






  constructor() {
    //console.log("SessionService:Constroctor Called");
   }

   public get_session_status(){
    //console.log("SessionService:getSession_status:: OK");
    return true ;
   }

  public get user_name(): any {
    return this._user_name ;
  }

  public get emp_code(): any {
    return this._emp_code ;
  }

  public get designation(): any {
    return this._designation ;
  }

  public get unit_id(): any {
    return this._unit_id;
  }

  public set unit_id(value: any) {
    this._unit_id = value;
  }

  public get ott_id(): Number {
    return this._ott_id;
  }
  
  public get ott(): String {
    return this._ott;
  }
    
  public get user_id(): Number {
    return this._user_id;
  }

  public get module_id(): Number {
    return this._module_id;
  }
 
  public get email(): String {
    return this._email;
  }
  
  public get mobile(): String {
    return this._mobile;
  }
  
  public get designation_id(): Number {
    return this._designation_id;
  }
 
  public get role(): String {
    return this._role;
  }
 
  public get active(): boolean {
    return this._active;
  }

  public get year_id(): Number {
    return this._year_id;
  }

  public get seat_id(): Number {
    return this._year_id;
  }

  
  public set_session_variable(data : any ){
   //console.log( JSON.stringify(data) );
    this._user_name = data.vch_user_name ;
    this._emp_code = data.vch_emp_code ;
    this._designation = data.vch_designation ;
    this._user_id = data.int_user_id ;
    this._designation_id = data.int_designation_id
    this._role = data.vch_role
    this._email = data.vch_email 
    this._mobile = data.vch_mobile 
    this._ott = data.vch_ott 


    this._office_code = data.office_code;
    this._office_name = data.office;
    this._office_name_ln = data.office_ln;

    this._seat_code = data.seat_code;
    this._seat_name = data.seat_name;
    this._seat_name_ln = data.seat_ln;
    this._unit_id  = data.fk_office_id;
    

    //this._year_id = 2024 ; // NOTE: this must be set from DB value
    //this._seat_id = null ; // 
  }


  public get office_code(): String {
    return this._office_code;
  }
    
  public get office_name(): String {
    return this._office_name;
  }

  public get office_name_ln(): String {
    return this._office_name_ln;
  }

  public get seat_code(): String {
    return this._seat_code;
  }
    
  public get seat_name(): String {
    return this._seat_name;
  }

  public get seat_name_ln(): String {
    return this._seat_name_ln;
  }
}
