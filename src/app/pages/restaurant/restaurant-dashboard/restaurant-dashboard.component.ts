import { Component } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { HeaderRestaurantComponent } from "../../header-restaurant/header-restaurant.component";


@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [
    HeaderRestaurantComponent,
    FooterComponent,
    HeaderRestaurantComponent
],
  templateUrl: './restaurant-dashboard.component.html',
  styleUrl: './restaurant-dashboard.component.css'
})
export class RestaurantDashboardComponent {

}
