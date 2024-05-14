export const PERMISSIONS = {
  SUPER_ADMIN: {

    PAGE_USERS: {
      create: true,
      edit: true,
      DIALOG: {
        status: true
      },
    },
  },
  PROJECT_ADMIN: {

    PAGE_USERS: {
      create: true,
      edit: true,
      DIALOG: {
        status: true
      },
    },
  },
  MANAGER: {

    PAGE_USERS: {
      create: true,
      edit: true,
      DIALOG: {
        elements: false,
      },
    },
  },
  CLIENT: {

    PAGE_USERS: {
      create: true,
      edit: true,
      DIALOG: {
        status: true
      },
    },
  },
}
