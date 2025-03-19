import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }
  apihost = '';

  // GET METHOD
  getService(methodName: string, params: any = null) {
    if (params) {
      let i = 0;
      let parmsdet = '';
      let paramvariable = '';
     
      for (const key in params) {
        paramvariable = '';
        if (i > 0) {
          paramvariable = '&' + key + '=' + params[key];
        } else {
          paramvariable = '?' + key + '=' + params[key];
        }
        parmsdet = parmsdet + paramvariable;
        i++;
      }
      return this.http.get(`${environment.serviceUrl}/` + this.apihost + methodName + parmsdet);
    }else{
      return this.http.get(`${environment.serviceUrl}/` + this.apihost + methodName);
    }
  }


  // POST METHOD
  postservice(methodName: string, params: any = null) {
    //console.log(params);
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

    // JSON.stringify(data) 
    return this.http
      .post<any>(`${environment.serviceUrl}/` + this.apihost + methodName, params, { headers: reqHeader });

    // return this.http
    // .post<any>(`${environment.serviceUrl}/` + this.apihost + methodName, params);
  }


  getServiceWithJsonParam(methodName : String , params : any, parmtag = null) {
    
    //  JSON input Param sending with url-encoding
    //  Params :
    //       methodName :  Name of API 
    //       params     :  Params in Json format. 
    //       parmtag    :  @RequestParam tag in Api . Default value is 'req'.    
    // 


    //console.log("getServiceWithJsonParam()" );
    let encoded_param = encodeURIComponent (JSON.stringify(params));   
    let paramvariable = '';    
    
    // If parameter tag specified then append with that tag else append with 'req'
    if(parmtag){
      paramvariable = '?' +  parmtag + '=' + encoded_param;
    }  else{
      paramvariable = '?req'+ '=' + encoded_param;  
    }
    //console.log(paramvariable);
    return this.http.get(`${environment.serviceUrl}/` + methodName + paramvariable);
  }

  // getServiceImg(methodName: string, params: any = null) {
  //   //console.log( `${environment.serviceUrl}/` + this.apihost + methodName +"/"+ params );
    
  //     return this.http.get(`${environment.serviceUrl}/` + this.apihost + methodName +"/"+ params);
  // }


  getServiceImg(url: string, param: string): Observable<Blob> {
    return this.http.get(`${environment.serviceUrl}/${param}`, { responseType: 'blob' });
  }
  

upload_service(methodName:string, params:any = null ,authenticate:boolean = false) {    
  this.apihost = '' 
  // JSON.stringify(data) 
  return this.http
    .post<any>(`${environment.serviceUrl}/` +  this.apihost + methodName, params);

}

//NOTE:



// CACHE SERIVCE
public save_to_cache(data: any, key:string, time = 5): void {
  const expirationTime = new Date().getTime() + time * 60 * 1000; // Cache for 5 minutes
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(key+"_exp", expirationTime.toString());
}


public get_cache_data(key:string): any {
  let expiration = localStorage.getItem(key+"_exp");
  const now = new Date().getTime();
  if ( expiration == null ) expiration = (new Date().getTime() - 1000).toString();
  console.log(expiration, now,  parseInt(expiration));

  if (expiration && now < parseInt(expiration)) {
    const cached_data = localStorage.getItem(key);
    return cached_data ? JSON.parse(cached_data) : null;
  } else {
    console.log("Else part of get_cache_data");
    this.clear_cache(key);
    return null;
  }
}

public clear_cache(key:string): void {
  localStorage.removeItem(key);
  localStorage.removeItem(key+"_exp");
}




}
