import { IElement } from './iElement';

export interface ISchema {
  name:string,
  text:string,
  color:string,
  elements: Array<IElement>
}

