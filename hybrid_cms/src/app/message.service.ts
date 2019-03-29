import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MessageService {
    private subject = new Subject<any>();
    private currentUserProfile = new Subject<Object>();
    private SpinnerSub = new Subject<boolean>();
    private childDirtySub = new Subject<boolean>();
    private childDisableSaveSub = new Subject<boolean>();
    private menuBehaviorData = new BehaviorSubject<any>({ data: null });
    //gjc 0420
    private photoInfoData = new BehaviorSubject<any>({ data: null });
    private listMenuChildData = new BehaviorSubject<any>({ data: null });
    private menuListingData = new BehaviorSubject<any>({ data: null });
    public menuDeactiveFlag = new Subject<any>();
    public menuUrlNull = new Subject<any>();
    public itemChange  = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    // for cssJsonData

    setCssJsonData(cssJsonData: any) {
        this.menuBehaviorData.next({ data: cssJsonData });
    }

    getCssJsonData(): Observable<any> {
        return this.menuBehaviorData.asObservable();
    }

    clearCssJsonData(): void {
        this.menuBehaviorData.next({ data: null });
    }
    //gjc 0420
    setPhotoInfo(photoInfo: any){
        this.photoInfoData.next({ data: photoInfo });
    }

    getPhotoInfo(){
        return this.photoInfoData.asObservable();
    }

    setMenuDeactive(flag: any){
        this.menuDeactiveFlag.next(flag);
    }

    getMenuDeactive(){
        return this.menuDeactiveFlag.asObservable();
    }

    setUrlNull(flag: any){
        this.menuUrlNull.next(flag);
    }

    getUrlNull(){
        return this.menuUrlNull.asObservable();
    }
    //gjc

    setItemChangeDeactive(flag: any){
        this.itemChange.next(flag);
    }

    getItemChangeDeactive(){
        return this.itemChange.asObservable();
    }
    // for menu listing

    setMenuListData(menuData: any) {
        this.menuListingData.next({ data: menuData });
    }

    getMenuListData(): Observable<any> {
        return this.menuListingData.asObservable();
    }

    // For menu type list menu showChildForm

    setListMenuShowChildData(childData: any) {
        this.listMenuChildData.next({ data: childData });
    }
    getlistMenuShowChildData(): Observable<any> {
        return this.listMenuChildData.asObservable();
    }

    // for Active Spinner

    setSpinnerActive(active: any) {
        this.SpinnerSub.next(active);
    }

    getSpinnerActive(): Observable<any> {
        return this.SpinnerSub.asObservable();
    }
    // for seting active listner when user make forms dirty
    setdirtyChildActive(active: boolean) {
        this.childDirtySub.next(active);
    }

    getdirtyChildActive(): Observable<boolean> {
        return this.childDirtySub.asObservable();
    }
    /**
     * to disbale save button if any forms may have error
     * @param active(boolean)
     */
    setSaveDisable(active: boolean) {
        this.childDisableSaveSub.next(active);
    }

    getSaveDisable(): Observable<boolean> {
        return this.childDisableSaveSub.asObservable();
    }
    /**
     * Method to set current prfile data
     */
    setCurrentProfile(message: Object) {
        this.currentUserProfile.next( message);
    }
    /**
     * Method to clear current prfile data
     */
    clearCurrentProfile() {
        this.currentUserProfile.next();
    }
    /**
     * Method to get current prfile data
     */
    getCurrentProfile(): Observable<any> {
        return this.currentUserProfile.asObservable();
    }

}
