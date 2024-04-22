import db from '../utils/db';

/**
 * Retrieves all users based on provided parameters.
 * @param params - Parameters for filtering, sorting, and pagination.
 * @returns Promise containing total count and list of users.
 */
export const getAllUsersHandler = async (params: any): Promise<any> => {
    const {orderByColumn, orderByDirection, pageIndex, pageSize, firstName, lastName, email, roles} = params;

    const parseRoles = JSON.parse(roles);
    let rolesArr;
    if (parseRoles.length) {
        rolesArr = parseRoles;
    } else {
        rolesArr = [1, 2, 3, 4];
    }

    const skip = pageIndex * pageSize;
    const totalCount = await db.user.count();

    const users = await db.user.findMany({
        where: {
            role: {in: rolesArr},
            firstName: {
                startsWith: firstName,
            },
            lastName: {
                startsWith: lastName,
            },
            email: {
                startsWith: email
            }
        },
        take: parseInt(pageSize),
        skip: skip,
        orderBy: {
            [orderByColumn]: orderByDirection,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
    return {totalCount, users}
};

/**
 * Retrieves a list of all users with minimal information.
 * @returns Promise containing the list of users.
 */
export const getListAllUsersHandler = async (): Promise<any> => {
    const users = await db.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true
        },
    });
    return {users}
};

/**
 * Retrieves a single user by ID.
 * @param id - ID of the user to retrieve.
 * @returns Promise containing the user information.
 */
export const getUserHandler = async (id: number): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
};

/**
 * Creates a new user.
 * @param user - User information to create.
 * @returns Promise containing total count and newly created user.
 */
export const createUserHandler = async (user: Omit<any, 'id'>): Promise<any> => {
    const {firstName, lastName, email, password, role, avatar, status, birthAt, location} = user;

    const newUser = await db.user.create({
        data: {
            firstName,
            lastName,
            email,
            password,
            role,
            avatar,
            status,
            birthAt,
            location
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
    const totalCount = await db.user.count();
    return {totalCount, newUser}
};

/**
 * Updates an existing user.
 * @param user - Updated user information.
 * @param id - ID of the user to update.
 * @returns Promise containing the updated user information.
 */
export const updateUserHandler = async (
    user: Omit<any, 'id'>,
    id: number
): Promise<any> => {
    const {firstName, lastName, email, role, avatar, status, birthAt, location} = user;

    return db.user.update({
        where: {
            id,
        },
        data: {
            firstName,
            lastName,
            email,
            role,
            avatar,
            status,
            birthAt,
            location
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
};

/**
 * Updates the password of an existing user.
 * @param userPassword - New password information.
 * @param id - ID of the user whose password to update.
 * @returns Promise containing the updated user information.
 */
export const updateUserPasswordHandler = async (
    userPassword: Omit<any, 'id'>,
    id: number
): Promise<any> => {
    const {password} = userPassword;
    return db.user.update({
        where: {
            id,
        },
        data: {
            password,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true
        },
    });
};

/**
 * Deletes a user by ID.
 * @param id - ID of the user to delete.
 * @returns Promise without any data.
 */
export const deleteUserHandler = async (id: number): Promise<void> => {
    await db.user.delete({
        where: {
            id,
        },
    });
};

/**
 * Finds a user by ID.
 * @param id - ID of the user to find.
 * @returns Promise containing the user information or null if not found.
 */
export const findUserById = async (id: any): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            id,
        },
    });
};
