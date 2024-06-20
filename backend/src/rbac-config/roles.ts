interface IPermission {
  name: string;
}

interface IRole {
  name: string;
  permissions: IPermission[];
}

const roles: { roles: any[] } = {
  "roles": [
    {
      "name": "admin",
      "permissions": [
        "create_record",
        "read_record",
        "update_record",
        "delete_record"
      ]
    },
    {
      "name": "manager",
      "permissions": [
        "create_record",
        "read_record",
        "update_record"
      ]
    },
    {
      "name": "employee",
      "permissions": [
        "create_record",
        "read_record"
      ]
    }
  ]
}

export default roles;
