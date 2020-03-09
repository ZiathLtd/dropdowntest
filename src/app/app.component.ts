import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  systemActions: String[] = ['Login as Administrator', 'Log Out', 'Add New Licence', 'Exit'];
  configureActions: String[] = ['Scan', 'Container Reader', 'Export', 'Activators', 'Sound', 'Security'];
  title = 'dropdowntest';

  actionEvent(action){
    console.log(action);
  }
}
