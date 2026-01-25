import { Injectable } from "@angular/core";
import { Observable,BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private searchTermSubject = new BehaviorSubject<String>('');
    public searchTerm$: Observable<String> = this.searchTermSubject.asObservable();

    setSearchTerm(term: String) : void{
        this.searchTermSubject.next(term);
    }

    getSearchTerm(): String{
        return this.searchTermSubject.getValue();
    }

    clearSearchTerm(): void{
        this.searchTermSubject.next('');
    }
}