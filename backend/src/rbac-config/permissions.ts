import roles from './roles';

interface IRole {
    name: string;
    permissions: string[];
}

class Permissions {
    private permissions: string[];

    constructor() {
        this.permissions = [];
    }

    getPermissionsByRoleName(roleName: string): string[] {
        const role: IRole | undefined = roles.roles.find((r) => r.name === roleName);
        return role ? role.permissions : [];
    }
}

export default Permissions;
