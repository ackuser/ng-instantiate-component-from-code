//our root app component
import {Component, NgModule, ViewChild, ElementRef, Input, Output, EventEmitter, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ReflectiveInjector} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'

@Component({
  selector: 'any-comp',
  template: '<div (click)="clicked.emit($event)">here i am.. {{name}}</div>'
})
export class AnyComponent {
  
  @Input() name;
  @Output() clicked = new EventEmitter();
  
  constructor() {
    console.log('some1 created me.. ! :)');
  }
}

@Component({
  selector: 'my-app',
  template: `
    <div>
      <h2>Hello {{name}}</h2>
      <template #placeHolder>
      </template>
    </div>
  `,
})
export class App {
  
  @ViewChild('placeHolder', {read: ViewContainerRef}) private _placeHolder: ElementRef;
  
  name:string;
  constructor(private _cmpFctryRslvr: ComponentFactoryResolver) {
    this.name = 'Angular2'
  }
  
  ngOnInit() {
    let cmp = this.createComponent(this._placeHolder, AnyComponent);
    
    // set inputs..
    cmp.instance.name = 'peter';
    
    // set outputs..
    cmp.instance.clicked.subscribe(event => console.log(`clicked: ${event}`));
    
    // all inputs/outputs set? add it to the DOM ..
    this._placeHolder.insert(cmp.hostView);
  }
  
  public createComponent (vCref: ViewContainerRef, type: any): ComponentRef {
    
    let factory = this._cmpFctryRslvr.resolveComponentFactory(type);
    
    // vCref is needed cause of that injector..
    let injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);
    
    // create component without adding it directly to the DOM
    let comp = factory.create(injector);
    
    return comp;
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ App, AnyComponent ], // ! IMPORTANT
  entryComponents: [ AnyComponent ], // ! IMPORTANT --> would be lost due to Treeshaking..
  bootstrap: [ App ]
})
export class AppModule {}