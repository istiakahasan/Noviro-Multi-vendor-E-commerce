import { UserRole, UserStatus } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";

import prisma from '../lib/prisma';
import config from '../../config';




const seedSuperAdmin = async () => {
  try {
    // Check if a super admin already exists
    const isSuperAdminExists = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });

    // If not, create one
    if (!isSuperAdminExists) {
      const password = await bcrypt.hash(
        config.super_admin_password as string,
        Number(config.bcrypt_salt_rounds) || 12
      );
      await prisma.user.create({
        data: {
          firstName: "Mr.",
          lastName: "Admin",
          email: "kingtangos@gmail.com",
          password
        },
      });
      console.log('Super Admin created successfully.');
    } else {
      return;
      //   console.log("Super Admin already exists.");
    }
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  }
};

export default seedSuperAdmin;
