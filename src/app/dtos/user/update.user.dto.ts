export class UpdateUserDTO {
    fullname: string;
    address: string;
    password: string;
    retype_password: string;
    // user_avatar: string;
    date_of_birth: string;

    constructor(data: any) {
        this.fullname = data.fullname;
        this.address = data.address;
        this.password = data.password;
        this.retype_password = data.retype_password;
        // this.user_avatar = data.user_avatar;
        this.date_of_birth = data.date_of_birth;
    }
}
