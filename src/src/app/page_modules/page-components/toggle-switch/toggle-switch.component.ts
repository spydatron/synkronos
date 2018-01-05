// import {AfterViewChecked, Component} from '@angular/core';

import { Component, Input, Output, EventEmitter, HostListener, forwardRef , AfterViewChecked} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


const TOG_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleSwitchComponent),
  multi: true
};

@Component({
  selector: 'toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
  providers: [TOG_SWITCH_CONTROL_VALUE_ACCESSOR]
})

// export class ButtonToggleComponent implements AfterViewChecked{
//
//   ngAfterViewChecked() {
//     $('input[type="checkbox"]').on('click', function(e) {
//       $(this).parent().toggleClass('checked', $(this).prop('checked'));
//     });
//   }

export class ToggleSwitchComponent{

  // @Input() size: string = 'medium';
  // @Output() change = new EventEmitter<boolean>();
  // @Input() color: string = 'rgb(100, 189, 99)';
  // @Input() switchOffColor: string = '';
  // @Input() switchColor: string = '#fff';
  // defaultBgColor: string = '#fff';
  // defaultBoColor: string = '#dfdfdf';
  // @Input() switchId: string = '';
  // @Input() switchInputClass: string='';
  // @Input() switchDataChecked: string="On";
  // @Input() switchDataUnchecked: string="Off";

  @Input() size: string;
  @Output() change: any;
  @Input() color: string;
  @Input() switchOffColor: string;
  @Input() switchColor: string;
  defaultBgColor: string;
  defaultBoColor: string;
  @Input() switchId: string;
  @Input() switchInputClass: string;
  @Input() switchDataChecked: string;
  @Input() switchDataUnchecked: string;

  constructor(){
    this.inOutput();
  }

  private onTouchedCallback = (v: any) => {
  };
  private onChangeCallback = (v: any) => {
  };

  private _checked: boolean;
  private _disabled: boolean;
  private _reverse: boolean;

  @Input() set checked(v: boolean) {
    this._checked = v !== false;
  }

  get checked() {
    return this._checked;
  }

  @Input() set disabled(v: boolean) {
    this._disabled = v !== false;
  };

  get disabled() {
    return this._disabled;
  }

  @Input() set reverse(v: boolean) {
    this._reverse = v !== false;
  };

  get reverse() {
    return this._reverse;
  }

  inOutput(){
  this.size = 'medium';
  this.change = new EventEmitter<boolean>();
  this.color = 'rgb(100, 189, 99)';
  this.switchOffColor  = '';
  this.switchColor = '#fff';
  this.defaultBgColor = '#fff';
  this.defaultBoColor = '#dfdfdf';
  this.switchId = '';
  this.switchInputClass = 'can-toggle__switch';
  this.switchDataChecked = 'On';
  this.switchDataUnchecked = 'Off';
  }
  getColor(flag) {
    if (flag === 'borderColor') return this.defaultBoColor;
    if (flag === 'switchColor') {
      if (this.reverse) return !this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
      return this.checked ? this.switchColor : this.switchOffColor || this.switchColor;
    }
    if (this.reverse)  return !this.checked ? this.color : this.defaultBgColor;
    return this.checked ? this.color : this.defaultBgColor;
  }

  @HostListener('click')
  onToggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.change.emit(this.checked);
    this.onChangeCallback(this.checked);
    this.onTouchedCallback(this.checked);
  }
  setId(cust_id){
    this.switchId = cust_id;
  }
  writeValue(obj: any): void {
    if (obj !== this.checked) {
      this.checked = !!obj;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
