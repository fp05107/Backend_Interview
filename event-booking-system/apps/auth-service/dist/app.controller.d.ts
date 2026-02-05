export declare class AppController {
    register(data: any): {
        status: string;
        userId: string;
    };
    login(data: any): {
        accessToken: string;
    };
}
