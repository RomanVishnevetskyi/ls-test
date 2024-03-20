import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ISchema } from '../models/iSchema';

@Injectable({
  providedIn: 'root'
})
export class SchemaServiceService {
  private readonly url: string = 'https://core.lsbonus.com/core/testSchema';

  constructor(private http:HttpClient) {}

  private schemaSubject$: BehaviorSubject<any> = new BehaviorSubject(null);

  public getSchemaSubject () {
    return this.schemaSubject$.asObservable()
  }

  public setSchemaSubject (value:ISchema) {
    this.schemaSubject$.next(value)
  }

  getData(): Observable<any> {
    const observable: Observable<any> = this.http.post(this.url, {});
    return observable.pipe(tap((data) => {
        this.setSchemaSubject(data.schema)
      }
    ));
  }
}
