import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestConnection } from './test-connection';

describe('TestConnection', () => {
  let component: TestConnection;
  let fixture: ComponentFixture<TestConnection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestConnection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestConnection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
