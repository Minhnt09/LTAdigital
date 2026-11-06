import { Home } from './home';
import { Routes } from '@angular/router';
export const routes:Routes=[
 {path:'',component:Home,title:'LTA Digital | Home'},
 {path:'services',loadComponent:()=>import('./services').then(m=>m.Services),title:'LTA Digital | Services'},
 {path:'services/vas',redirectTo:'services',pathMatch:'full'},
 {path:'services/api-gate-pro',redirectTo:'services',pathMatch:'full'},
 {path:'services/:slug',loadComponent:()=>import('./service-detail').then(m=>m.ServiceDetailPage),title:'LTA Digital | Service'},
 {path:'why-lta',loadComponent:()=>import('./why').then(m=>m.Why),title:'LTA Digital | Why LTA'},
 {path:'customers-partners',loadComponent:()=>import('./customers').then(m=>m.Customers),title:'LTA Digital | Customers & Partners'},
 {path:'contact',loadComponent:()=>import('./contact').then(m=>m.Contact),title:'LTA Digital | Contact'},
 {path:'**',redirectTo:''}
];
