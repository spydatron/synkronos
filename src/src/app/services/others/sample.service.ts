import {Paho} from 'ng2-mqtt/mqttws31';
import { Injectable } from '@angular/core';

@Injectable()
export class SampleService {

  constructor(){

  }

  add(a, b) {
    return a+b;
  }


}
