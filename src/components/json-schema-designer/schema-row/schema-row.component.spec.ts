import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaRowComponent } from './schema-row.component';

describe('SchemaRowComponent', () => {
  let component: SchemaRowComponent;
  let fixture: ComponentFixture<SchemaRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
