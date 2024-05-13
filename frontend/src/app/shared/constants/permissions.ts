export const PERMISSIONS = {
  SUPER_ADMIN: {

    PAGE_USERS: {
      create: true,
      edit: true,
      delete: true,
      DIALOG: {
        status: true
      },
    },
  },
  PROJECT_ADMIN: {

    PAGE_USERS: {
      create: true,
      edit: true,
      delete: true,
      DIALOG: {
        status: true
      },
    },
  },
  MANAGER: {

    PAGE_USERS: {
      create: true,
      edit: true,
      delete: true,
      DIALOG: {
        elements: false,
      },
    },
  },
  CLIENT: {

    PAGE_USERS: {
      create: true,
      edit: true,
      delete: true,
      DIALOG: {
        status: true
      },
    },
  },
}
