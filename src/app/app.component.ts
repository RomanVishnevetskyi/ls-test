import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SchemaServiceService } from './services/schema-service.service';
import { HttpClientModule } from '@angular/common/http';
import { filter, skip, Subject, takeUntil } from 'rxjs';
import {
  AbstractControl,
  FormArray,
  FormBuilder, FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IElement } from './models/iElement';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ISchema } from './models/iSchema';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,ReactiveFormsModule,CommonModule,FormsModule,MatFormFieldModule, MatInputModule,MatButtonModule,MatProgressSpinnerModule],
  providers:[SchemaServiceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  public schema!:ISchema;
  public formArray: FormArray = this.fb.array([])
  unsubscribe$ = new Subject<void>();
  constructor(
    private schemaService: SchemaServiceService,
    private fb: FormBuilder,
  ) {};

  ngOnInit() {
    this.schemaService.getData().subscribe();
    this.schemaService.getSchemaSubject().pipe(takeUntil(this.unsubscribe$)).subscribe((schema:ISchema) => {
      if (schema) {
        this.schema = schema;
        this.addInputsFromSchema()
      }
    })
  }

  addInputsFromSchema(): void {
     this.schema.elements.forEach(({text,type}:IElement) => {
      this.formArray.push(this.fb.group({
        text,
        type,
        name: null,
      }))
    });
  }

  getInputControl(form:AbstractControl):FormControl {
   return form.get('name') as FormControl
  }

  onSubmit() {
    const inpValue =  this.formArray.value.map((item:IElement)=> {
      return {name: item.name}
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
