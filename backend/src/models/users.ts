export interface UsersModel {
    orderByColumn: number;
    orderByDirection: 'asc' | 'desc';
    pageIndex: number;
    pageSize: any;
    firstName: string;
    lastName: string;
    email: string;
    roles: any;
}
