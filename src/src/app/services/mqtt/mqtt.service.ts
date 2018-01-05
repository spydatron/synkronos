import {Paho} from 'ng2-mqtt/mqttws31';
import {Injectable} from '@angular/core';

@Injectable()
export class MQTTService {

  private client;
  public Id: number;
  public topics: Array<string>;
  public message;
  public connectionStatus;

  // constructor(serverAddress: string, port: number, path: string, id: number) {
  //     this.init(serverAddress, port, 'qwerty12345');
  //     this.Id = id;
  // }
  constructor() {
    this.client = new Paho.MQTT.Client('192.168.1.124', 1884, 'qwerty12345');
    this.onMessage();
    this.onConnectionLost();
    this.client.connect({onSuccess: this.onConnected.bind(this)});
  }

  // init(serverAddress: string, port: number, path: string) {
  //   this.client = new Paho.MQTT.Client(serverAddress, port, path);
  //   this.onMessage();
  //   this.onConnectionLost();
  //   this.client.connect({onSuccess: this.onConnected.bind(this)});
  // }

  getClient(): Paho.MQTT.Client {
    return this.client;
  }

  // onConnected() {
  //   console.log('Connected');
  //   // this.client.subscribe('mqtt/feeds/room/room1/sensors/temperature');
  //   // this.sendMessage('HelloWorld');
  //   for (let i = 0; i < this.topics.length; i++) {
  //     this.client.subscribe(this.topics[i]);
  //     this.sendMessage('HelloWorld' + i);
  //   }
  // }

  onConnected() {
    console.log('Connected');
    this.client.subscribe('mqtt/feeds/room/room1/sensors/temphumidity');
    this.client.subscribe('mqtt/feeds/room/room1/sensors/humidity');
    this.client.subscribe('mqtt/feeds/home/room1/appliance/lightStatus');
    this.client.subscribe('mqtt/feeds/room/room1/appliance/hueLightStatus');
    this.client.subscribe('mqtt/feeds/room/room1/sensors/doorStatus');
    this.client.subscribe('mqtt/feeds/room/room1/sensors/motionDetectionStatus');

    this.sendMessage(1,'ON');
    this.connectionStatus = 'Connected';
  }

  addTopic(topic) {
    this.topics.push(topic);
  }

  saveTopic() {
    // save to db
  }

  sendMessage(topicNumber: number, message: string) {
    let topic: string;
    switch(topicNumber){
      case 1: topic = 'mqtt/feeds/room/room1/light/onoff'; break;
      case 2: topic = 'mqtt/feeds/room/room1/light/brightness'; break;
      case 3: topic = 'mqtt/feeds/room/room1/hueLight/onoff'; break
      case 4: topic = 'mqtt/feeds/room/room1/hueLight/rgb'; break;
      case 5: topic = 'mqtt/feeds/room/room1/door/lock'; break;
      case 6: topic = 'mqtt/feeds/test'; break
      case 7: topic = 'mqtt/feeds/room/room1/hueLightAnimate/onoff'; break;
    }
    const packet = new Paho.MQTT.Message(message);
     packet.destinationName = topic;
    // packet.destinationName = 'mqtt/feeds/room/room1/light/onoff';
    this.client.send(packet);
  }

  onMessage() {
    this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
      this.message = message.payloadString;
      console.log('Message arrived : ' + this.message);
    };
  }
  private messageChangeHandler = (message) => {
    this.message = message;
  }
  onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log('Connection lost : ' + JSON.stringify(responseObject));
      this.connectionStatus = 'Not Connected';
    };
  }

}
