export class RGBLamp {
  deviceType:    string;
  r: number;
  g: number;
  b: number;
  constructor(r, g, b){
    this.deviceType = 'RGB Lamp';
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

export class MQTTMessageBox {
  senderDevice:    string;
  topic: string;
  message: string;
  constructor(senderDeive, topic, message){
    this.senderDevice = senderDeive;
    this.topic = topic;
    this.message = message;
  }
}
