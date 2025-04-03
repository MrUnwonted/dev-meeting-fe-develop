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

checkJsonEquality(json_1: any, json_2: any): boolean {
  let result: boolean = false;
  result = this.compareJson(json_1, json_2);
  return result;
}

compareJsonObjects(obj1: any, obj2: any): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key)) || !keys2.every(key => keys1.includes(key))) {
    return false;
  }

  for (let key of keys1) {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (!this.compareJsonObjects(obj1[key], obj2[key])) {
        return false;
      }
    } else if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

compareJsonArrays(arr1: any[], arr2: any[]): boolean {
  if (arr1 == null || arr2 == null) {
    return arr1 === arr2; // If either is null or undefined, compare directly
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!this.compareJsonObjects(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
}


compareJson(value1: any, value2: any): boolean {
  if (value1 === null || value2 === null || value1 === undefined || value2 === undefined) {
    return value1 === value2;
  }

  if (typeof value1 !== 'object' && typeof value2 !== 'object') {

    if (typeof value1 === 'string' && typeof value2 === 'string') {
      return value1.trim() === value2.trim();
    }
    return value1 === value2;
  }

  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    return value1.every((item, index) => this.compareJson(item, value2[index]));
  }

  if (typeof value1 === 'object' && typeof value2 === 'object') {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) {
      return false;
    }

    return keys1.every(key => this.compareJson(value1[key], value2[key]));
  }

  return false;
}



fin_getService(methodName: string, params: any = null) {
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
    // return this.http.get(`http://192.168.1.46:9093/` + this.apihost + methodName + parmsdet);
    return this.http.get(`http://103.177.225.135:9092/` + this.apihost + methodName + parmsdet);
  }else{
    // return this.http.get(`http://192.168.1.46:9093/` + this.apihost + methodName);
    return this.http.get(`http://103.177.225.135:9092/` + this.apihost + methodName);
  }
}


// POST METHOD
fin_postservice(methodName: string, params: any = null) {
  //console.log(params);
  var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

  // JSON.stringify(data)
  return this.http
    // .post<any>(`http://192.168.1.46:9093/` + this.apihost + methodName, params, { headers: reqHeader })
    .post<any>(`http://103.177.225.135:9092/` + this.apihost + methodName, params, { headers: reqHeader })

  // return this.http
  // .post<any>(`${environment.serviceUrl}/` + this.apihost + methodName, params);
}


}
