import roles from "./roles";

interface IRole {
    name: string;
}

class Role {
    private readonly roles: IRole[];

    constructor() {
        this.roles = roles.roles;
    }

    getRoleByName(name: string): IRole | undefined {
        return this.roles.find((role) => role.name === name);
    }

    getRoles(): IRole[] {
        return this.roles;
    }
}

export default Role;
