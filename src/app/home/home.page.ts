import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  
  todos: any = [];
  conObj: any;

  constructor(
    private sqlite: SQLite,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter(){    
    
  }

  iniciar(){
    this.sqlite.create({
      name: "todoApp.db",
      location: 'default'
    }).then(async (res: SQLiteObject) => {

      this.conObj = res;

      await this.conObj.executeSql("CREATE TABLE IF NOT EXISTS todo1 (id integer primary key, ci VARCHAR(255), nombre VARCHAR(255), isDone BOOLEAN)", []).then(() => {
        console.log("Table Created");
      }).then((res) => {
        this.readAllData();
      }).catch((err) => {
        console.log(err);
        console.log("Table Creation Error" + err);
      })
    })
    
    .catch(err => {
      console.log(err);
    });
  }

  
  showPop() {
    this.alertCtrl.create({
      header: "Nuevo Registro",
      inputs: [
        { placeholder: 'CI', type: 'number', name: 'ci_new' },
        { placeholder: 'Nombre y Apellidos', type: 'text', name: 'nombre_new' }
      ],
      buttons: [
        {
          text: "Agregar", handler: (data) => {
            console.log(data);
            this.insert(data.ci_new, data.nombre_new);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    }).then(a => a.present());
  }


  async insert(ci_new, nombre_new) {
    await this.conObj.executeSql("INSERT INTO todo1 (ci, nombre, isDone) VALUES (?,?,?)", [ci_new, nombre_new, 0]).then(() => {
      console.log("Inserted")
      this.readAllData();
    }).catch((err) => {
      console.log(err);
      console.log("Insert Error" + err);
    })
  }

  async update(id) {
    console.log(id);
    await this.conObj.executeSql("UPDATE todo1 SET isDone=? WHERE id=?", [1, id]).then(() => {
      console.log("Updated")
      this.readAllData();
    }).catch((err) => {
      console.log(err);
      console.log("Update Error" + err);
    })
  }

  async delete(id) {
    console.log(id);
    await this.conObj.executeSql("DELETE FROM todo1 WHERE id=?", [id]).then(() => {
      console.log("Deleted")
      this.readAllData();
    }).catch((err) => {
      console.log(err);
      console.log("Delete Error" + err);
    })
  }

  async readAllData() {
    await this.conObj.executeSql("SELECT * FROM todo1 ORDER BY nombre COLLATE NOCASE", []).then(res => {
      console.log(res);

      let tmp = [];
      for (let i = 0; i < res.rows.length; i++) {
        tmp.push({ id: res.rows.item(i).id, ci: res.rows.item(i).ci, nombre: res.rows.item(i).nombre, isDone: res.rows.item(i).isDone })
      }
      this.todos = tmp;
      console.log(this.todos);

    }).catch(() => {
      console.log("READ ERROR");
    })
  }

  buscarPop(){
    this.alertCtrl.create({
      header: "Buscar Registro",
      inputs: [
        { placeholder: 'CI', type: 'number', name: 'ci_new' }
      ],
      buttons: [
        {
          text: "Buscar", handler: (data) => {
            console.log(data);
            this.buscar(data.ci_new);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    }).then(a => a.present());
  }
  buscar(ci_new){
    let ex = false;
    this.todos.forEach(item => {
      if (item.ci == ci_new) {
        this.actualizarPop(item)
        ex = true
        return;
      }
    });
    if (!ex) {
      this.noExistePop();
    }    
  }

  actualizarPop(item){
    this.alertCtrl.create({
      header: "Actualizar Registro",
      inputs: [
        { placeholder: 'CI', type: 'number', name: 'ci_new', value: item.ci },
        { placeholder: 'Nombre y Apellidos', type: 'text', name: 'nombre_new', value: item.nombre }
      ],
      buttons: [
        {
          text: "Actualizar", handler: (data) => {
            console.log(data);
            this.actualizar(item, data.ci_new, data.nombre_new);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    }).then(a => a.present());
  }
  async actualizar(item, ci_new, nombre_new){
    console.log(item.id);
    await this.conObj.executeSql("UPDATE todo1 SET ci=?, nombre=? WHERE id=?", [ci_new, nombre_new, item.id]).then(() => {
      console.log("Updated")
      this.readAllData();
    }).catch((err) => {
      console.log(err);
      console.log("Update Error" + err);
    })
  }

  noExistePop(){
    this.alertCtrl.create({
      header: "No Existe el Registro!", 
      buttons: [
        {
          text: "Cancelar"
        }
      ]
    }).then(a => a.present());
  }

  modificarPop(item){
    this.alertCtrl.create({
      header: "Actualizar Registro",
      inputs: [
        { placeholder: 'CI', type: 'number', name: 'ci_new', value: item.ci },
        { placeholder: 'Nombre y Apellidos', type: 'text', name: 'nombre_new', value: item.nombre }
      ],
      buttons: [
        {
          text: "Actualizar", handler: (data) => {
            console.log(data);
            this.modificar(item, data.ci_new, data.nombre_new);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    }).then(a => a.present());
  }
  async modificar(item, ci_new, nombre_new){
    console.log(item.id);
    await this.conObj.executeSql("UPDATE todo1 SET ci=?, nombre=? WHERE id=?", [ci_new, nombre_new, item.id]).then(() => {
      console.log("Updated")
      this.readAllData();
    }).catch((err) => {
      console.log(err);
      console.log("Update Error" + err);
    })
  }
}
