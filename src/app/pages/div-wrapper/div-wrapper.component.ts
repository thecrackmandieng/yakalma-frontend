import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-div-wrapper',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './div-wrapper.component.html',
  styleUrls: ['./div-wrapper.component.css']
})
export class DivWrapperComponent {
  menuItems = [
    {
      id: 1,
      name: "Shroom Bacon Burger",
      price: "$11.76",
      image: "/assets/riz.png",
    },
    {
      id: 2,
      name: "Delicious Black Coffee",
      price: "$11.76",
      image: "/assets/poisson.jpg",
    },
    {
      id: 3,
      name: "BBQ Chicken Pizza New",
      price: "$13.17",
      image: "/assets/griade.webp",
    },
    {
      id: 4,
      name: "Crispy Fried Chicken",
      price: "$15.10",
      image: "/assets/shop3-1-202x181-png.png",
    },
    {
      id: 5,
      name: "Zinger Double Burger",
      price: "$20.10",
      image: "/assets/shop1-1-202x181-png.png",
    },
    {
      id: 6,
      name: "Margherita Pizza New",
      price: "$15.80",
      image: "/assets/product4-202x181-png-1.png",
    },
    {
      id: 7,
      name: "Crispy Fried Chicken",
      price: "$10.85",
      image: "/assets/shop3-1-202x181-png-1.png",
    },
    {
      id: 8,
      name: "Black Pepper Burger",
      price: "$10.85",
      image: "/assets/shop2-1-202x181-png.png",
    },
  ];
}
