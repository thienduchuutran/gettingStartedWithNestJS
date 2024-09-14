export interface IUser {
    _id: string;
    name: string;
    email: string;

    //we need more fields from these 2 so that we can have more info for frontend
    role: {
        _id: string;
        name: string
    };
    permissions: {
        _id: string;
        name: string;
        apiPath: string;
        module: string
    }[]
   }

   