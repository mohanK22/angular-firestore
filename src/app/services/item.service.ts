import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Item } from '../modules/item/item.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private itemDoc: AngularFirestoreDocument<Item>;
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = this.afs.collection<Item>('items', ref => ref.orderBy('title', 'asc'));
    // this.items = this.itemsCollection.valueChanges();
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map( a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      }))
    );
   }

   getItems(): Observable<any[]> {
     return this.items;
   }

   addItem(item: Item) {
    const id = this.afs.createId();
    this.itemsCollection.doc(id).set(item);
   }

   deleteItem(item: Item) {
    this.itemDoc = this.afs.doc<Item>(`items/${ item.id }`);
    this.itemDoc.delete();
   }

   updateItem(item: Item) {
    this.itemDoc = this.afs.doc<Item>(`items/${ item.id }`);
    this.itemDoc.update(item);
   }

}
