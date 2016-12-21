/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, OnInit, DebugElement } from '@angular/core';

import { <%= classifiedModuleName %>Component } from './<%= dasherizedModuleName %>.component';

// Mock service
class <%= classifiedModuleName %>ServiceMock {
  // Mock all service calls used in this component
}
// Mock hosting component
// This is a parent component which holds the component we are testing. This
// allows us to pass in variables from a parent and catch events being thrown.
@Component({
  // simple template with just the tested component
  template: '<<%= selector %>></<%= selector %>>'
})
class <%= classifiedModuleName %>HostComponentMock implements OnInit {
  ngOnInit(): void { }
}

describe('<%= classifiedModuleName %>Component', () => {
  let hostComponent: <%= classifiedModuleName %>HostComponentMock;
  let hostFixture: ComponentFixture<<%= classifiedModuleName %>HostComponentMock>;
  let component: <%= classifiedModuleName %>Component;
  let fixture: ComponentFixture<<%= classifiedModuleName %>Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
	  imports: [],
      declarations: [ <%= classifiedModuleName %>Component,  <%= classifiedModuleName %>HostComponentMock],
	  providers: [
		{provide: '<Some Injected Service Name>', useClass: <%= classifiedModuleName %>ServiceMock}
	  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(<%= classifiedModuleName %>HostComponentMock);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
	
    fixture = TestBed.createComponent(<%= classifiedModuleName %>Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created on init', () => {
    expect(hostComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
