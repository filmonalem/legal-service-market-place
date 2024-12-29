import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layout/layout.component";

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadComponent: () =>
          import("./dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: "users",
        loadComponent: () =>
          import("./users/users.component").then((m) => m.UsersComponent),
      },
      {
        path: "clients",
        loadComponent: () =>
          import("./clients/clients.component").then((m) => m.ClientsComponent),
      },
      {
        path: "lawyers",
        loadComponent: () =>
          import("./lawyers/lawyers.component").then((m) => m.LawyersComponent),
      },
      {
        path: "contract",
        loadComponent: () =>
          import("./contract/contract.component").then((m) => m.ContractComponent),
      },
      {
        path: "access",
        loadComponent: () =>
          import("./access/access.component").then((m) => m.AccessComponent),
      },
      {
        path: "post",
        loadComponent: () =>
          import("./post/post.component").then((m) => m.PostComponent),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
