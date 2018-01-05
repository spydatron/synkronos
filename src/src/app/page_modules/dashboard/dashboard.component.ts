import {AfterViewChecked, OnInit, Component, Injectable, Inject } from '@angular/core';

import * as $ from 'jquery';
import iro from 'iro.js';
import {MQTTService} from '../../services/mqtt/mqtt.service';
import {SampleService} from '../../services/others/sample.service';
import {MQTTMessageBox, RGBLamp} from './RGBLamp';
// import {SampleService} from ''

/**
 * @title Basic grid-list
 */
@Component({
  selector: './synk-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [SampleService, MQTTService]
})
export class DashboardComponent implements AfterViewChecked ,  OnInit {
  self = this;
  rgbLamp: RGBLamp;
  enable: boolean;
  count: number;
  colorPicker: any;
  colorWheelId: string;
  RGB;
  RGBDefault = {r:255, g: 0, b:0};
  HSV;
  dimmerValue: number;
  connectionStatus: string;
  smartModeEnabled: boolean;
  smartModeIsEnabled: boolean;
  doorIsLocked: boolean;
  lockDoor: boolean;
  doorStatus: string;

  switchOnLight: boolean;
  lightIsOn: boolean;
  lightStatus: string;

  switchOnHueLight: boolean;
  hueLightIsOn: boolean;

  svgColor: any;
  motionStatus: string;
  motionDetected: boolean;
  motionIcon: string;
  hueLightStatus: string;
  homeTemperature: number;
  homeHumidity: number;
  // messageBox: Array<string>;
  messageBox = {hue: '', light: '', door: '', motion: '', temperature: 0.0, humdity: 0};
  // MQTTMessage = {senderDevice: '', topic: '', message: ''};
  MQTTMessage: MQTTMessageBox;
  temperature: number;
  humidity: number;

  constructor(private sample: SampleService, private mqttService: MQTTService) {
    // this.RGB = {};
    this.enable = true;
    this.count = 0;
    this.dimmerValue = 0
    this.colorWheelId = 'color-picker-wheel';
    this.colorPickerInit();
    // start listening to the color change event, now colorChangeHandler will be called whenever the color changes
    this.colorPicker.on('color:change', this.colorChangeHandler);
    this.lockDoor = false;
    this.doorStatus = 'UNLOCK';
    this.smartModeEnabled = false;
    this.smartModeIsEnabled = false;
    this.switchOnHueLight = false;
    this.lightStatus = 'OFF';
    this.dimmerValue = 50;
    this.motionDetected = false;
    this.motionIcon = 'assets/img/smart-home/motion-green.svg';
    // this.mqttService.init('192.168.1.124', 1884, 'qwerty12345');
    this.connectionStatus = 'Not Connected';
    this.hueLightStatus = 'OFF';
    this.temperature = 20.1;
    this.humidity = 34;
    this.rgbLamp = new RGBLamp(255, 255, 255);

  }

  colorPickerInit(){
    const wheelId = '#' + this.colorWheelId
    this.colorPicker = new iro.ColorPicker(wheelId, {
      width: 270,
      height: 270,
      color: {r: 255, g: 0, b: 0},
      markerRadius: 8,
      padding: 4,
      sliderMargin: 24,
      sliderHeight: 36,
      borderWidth: 2,
      // borderColor: "#fff",
      anticlockwise: true,
    });

  }

// make a handler function that will log the color's hex value to the console
   rt = function(color) {
    console.log(color.hexString);
    // this.RGB = color.rgb;
    // this.HSV = color.hsv;
  }
  private colorChangeHandler = (color) => {
    // Something
    console.log(color.hexString);
    this.svgColor = color.hexString;
    this.RGB = color.rgb;
    this.HSV = color.hsv;
    console.log('RGB 2: ' +  this.RGB.r + ', ' + this.RGB.g + ', ' + this.RGB.b);
    // this.sendRGB();
  }

  getMessages(message: string){
    // const message = 'Temp-23';
    if(message !== ''){
      const msg = message.split('-', 2);

      if(msg[0] === 'Temp'){
        this.messageBox.temperature = parseFloat(msg[1]);
      }
      if(msg[0] === 'Hum'){
        this.messageBox.humdity = parseFloat(msg[1]);
      }
      if(msg[0] === 'Hue'){
        this.messageBox.hue = msg[1];
      }
      if(msg[0] === 'Light'){
        this.messageBox.light = msg[1];
      }
      if(msg[0] === 'Door'){
        this.messageBox.door = msg[1];
      }
      if(msg[0] === 'Motion'){
        if(msg[1] !== ''){
          this.messageBox.motion = msg[1];
        }
      }
    }
  }
  getMessageFromJson(message: string) {
    // const message = 'Temp-23';
    this.MQTTMessage = JSON.parse(message);
    if (this.MQTTMessage !== null) {

      if (this.MQTTMessage.topic === 'Temperature') {
        this.messageBox.temperature = parseFloat(this.MQTTMessage.message);
        this.temperature = this.messageBox.temperature;
      }
      if (this.MQTTMessage.topic === 'Humidity') {
        this.messageBox.humdity = parseFloat(this.MQTTMessage.message);
        this.humidity = this.messageBox.humdity;
      }
      if (this.MQTTMessage.topic === 'Hue') {
        this.messageBox.hue = this.MQTTMessage.message;
      }
      if (this.MQTTMessage.topic === 'Light') {
        this.messageBox.light = this.MQTTMessage.message;
      }
      if (this.MQTTMessage.topic === 'Door') {
        this.messageBox.door = this.MQTTMessage.message;
      }
      if (this.MQTTMessage.topic === 'Motion') {
        if (this.MQTTMessage.message !== '') {
          this.messageBox.motion = this.MQTTMessage.message;
          this.motionDetected = true;
        }
      }
    }
  }

  ngOnInit() {

  }

  onSubmit() {
  }

  onChange() {
    this.count++;
  }

  handleDimmerSlider = (event, value) => {
    this.dimmerValue = value;
     this.sendBrightness();
  }

  sendRGB(){
    // const obj = JSON.parse(this.rgbLamp.toString()); // payload is a buffer
    // this.mqttService.sendMessage(4, obj);
    this.rgbLamp.r = this.RGB.r;
    this.rgbLamp.g = this.RGB.g;
    this.rgbLamp.b = this.RGB.b;
    if(this.switchOnHueLight) {
      const msg = JSON.stringify(this.rgbLamp);
      this.mqttService.sendMessage(4, msg);
      console.log(this.rgbLamp);
    }
  }



  sendBrightness(){
    if(this.switchOnLight) {
      this.mqttService.sendMessage(2, this.dimmerValue.toString());
    }
  }

  setDoorLock(){
    this.lockDoor = !this.lockDoor;
   // this.doorStatus = (this.lockDoor) ? 'LOCK' : 'UNLOCK';
    const msg = (this.lockDoor) ? 'LOCK' : 'UNLOCK';
    this.mqttService.sendMessage(1, msg);
    // this.getMessages(this.mqttService.message);
    this.lightStatus = this.messageBox.light;
  }

  setLight(){
    this.switchOnLight = !this.switchOnLight;
    // this.lightStatus = (this.switchOnLight) ? 'ON' : 'OFF';
    const msg = (this.switchOnLight) ? 'ON' : 'OFF';
    this.mqttService.sendMessage(1, msg);
     this.getMessages(this.mqttService.message);
   // this.getMessageFromJson(this.mqttService.message);
    // this.getMessages();
     this.lightStatus = this.messageBox.light;
  }
  setHueLight(){
    this.switchOnHueLight = !this.switchOnHueLight;
    // this.hueLightStatus = (this.switchOnHueLight) ? 'ON' : 'OFF';
    const msg = (this.switchOnHueLight) ? 'ON' : 'OFF';
    this.mqttService.sendMessage(3, msg);
   // this.getMessages(this.mqttService.message);
    this.lightStatus = this.messageBox.light;
  }
  sendHueAnimate(){
    this.smartModeEnabled = !this.smartModeEnabled;
    const msg = (this.smartModeEnabled) ? 'ANIMATE' : 'OFF';
    //if(this.switchOnHueLight) {
      this.mqttService.sendMessage(3, msg);
   // }
  }
  ngAfterViewChecked() {
        $('input[type="checkbox"]').on('click', function(e) {
            $(this).parent().toggleClass('checked', $(this).prop('checked'));
          });

        if(this.motionDetected){
          this.motionStatus = 'Intruder Detected!';
          this.motionIcon = 'assets/img/smart-home/motion-red.png';
        }else {
          this.motionStatus = '';
          this.motionIcon = 'assets/img/smart-home/motion-green.png';
        }

          this.connectionStatus = this.mqttService.connectionStatus
    this.getMessages(this.mqttService.message);
        //this.motionStatus = this.messageBox.motion;

    }

    /****************** chart **************************/
    public barChartOptions:any = {
      scaleShowVerticalLines: false,
      responsive: true
    };
  public barChartLabels:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 100, 45, 34, 78, 52, 23], label: 'Electricity'},
    {data: [28, 48, 40, 19, 86, 27, 90, 23, 100, 34, 67, 54], label: 'Water'}
  ];

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }
}

