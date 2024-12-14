export class User {
    id!: string;
    role!: number;
    name!: string;
    email!: string;
    password!: string;
}

export class UserAuthDto {
    constructor(
        public email: string,
        public password: string
    ) { }
}

export class UserRegistrDto {
    public email: string;
    public password: string;
    public name: string;
  
    constructor(data: { email: string; password: string; name: string }) {
      this.email = data.email;
      this.password = data.password;
      this.name = data.name;
    }
}
