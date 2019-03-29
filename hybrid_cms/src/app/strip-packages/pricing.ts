import { environment } from '../../environments/environment';

export class Pricing {
    /**
     * class designed for pricing data model
     * @version 1.0
     * @author
     */
    name = '';
    subscription = '';
    email = '';
    password = '';
    cardnumber = '';
    cardcvv = '';
    cardexpyear = '';
    cardexpmonth = '';
}
//export const API_GET_PACKAGES = 'http://cmsbackend.theappcompany.com/api/packages';
//export const API_GET_PACKAGES = 'http://localhost/cms-nick/cms_backend/public/api/packages';
// export const API_GET_PACKAGES = 'http://34.214.147.112/cms_backend/public/api/packages';
export const API_GET_PACKAGES = `${environment.baseUrl}/api/packages`;



export interface PricingRes {
    /**
     * interface designed for pricing data model
     * @version 1.0
     * @author
     */
    data: PricingsubRes[];

}
export interface PricingsubRes {
    id?: number;
    pa_name: string;
    pa_desc: string;
    pa_price: number;
    status: '1' | '2' | '3';
    created_at: string,
    updated_at: string
}
