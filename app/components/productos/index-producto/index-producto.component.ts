import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; color: string; class: string; position: string; message: string; }) => void; };
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {
  
  public load_data = true;
  public filtro = '';
  public token;
  public productos : Array<any> = [];
  public url;
  public load_btn = false;
  public filter_producto = '';
 

  constructor(
    private _productoService : ProductoService,
    private _clienteService : ClienteService
    
  ){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  } 
  
  init_data(){
    this._productoService.listar_productos_admin(this.filtro,this.token).subscribe(
      response => {
        this.productos = response.data;
        this.load_data = false;
      },
      error => {
        console.log(error);
        
      }
    );
  }

  filtrar(){
    if(this.filtro){
      this.init_data();
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFFFFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay filtro para buscar'
      });
    }
  }

  reiniciar(){
    this.filtro = '';
    this.init_data();
  }

  eliminar(id:any){

    this.load_btn = true;

    this._productoService.eliminar_producto_admin(id, this.token).subscribe(
      response => {
       

        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFFFFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el producto.'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.load_btn = false;

        this.init_data();
      },
      error => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFFFFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Ocurrio un error en el servidor'
        });
        this.load_btn = false;
        console.log(error);
      }
    );
  }
}
