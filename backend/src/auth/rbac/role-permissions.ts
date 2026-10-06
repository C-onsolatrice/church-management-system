export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PASTOR = 'PASTOR',
  TREASURER = 'TREASURER',
  MEMBER = 'MEMBER',
}

export enum Permission {
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  MANAGE_COMPLIANCE = 'MANAGE_COMPLIANCE',
  VIEW_REPORTS = 'VIEW_REPORTS',
  VIEW_FINANCES = 'VIEW_FINANCES',
  MANAGE_FINANCES = 'MANAGE_FINANCES',
}

export const RolePermissionsMap: Record<string, string[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.ADMIN]: [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_COMPLIANCE,
    Permission.VIEW_REPORTS,
    Permission.VIEW_FINANCES,
  ],
  [UserRole.PASTOR]: [
    Permission.READ_USER,
    Permission.MANAGE_COMPLIANCE,
    Permission.VIEW_REPORTS,
    Permission.VIEW_FINANCES,
  ],
  [UserRole.TREASURER]: [
    Permission.READ_USER,
    Permission.MANAGE_FINANCES,
    Permission.VIEW_FINANCES,
    Permission.VIEW_REPORTS,
  ],
  [UserRole.MEMBER]: [
    Permission.READ_USER,
  ],
};