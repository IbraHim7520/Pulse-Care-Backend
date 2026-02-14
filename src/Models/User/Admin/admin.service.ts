import status from "http-status"
import { prisma } from "../../../lib/prisma"
import AppError from "../../../shared/AppError"
import { auth } from "../../../lib/auth"
import { Role, UserStatus } from "../../../generated/prisma/enums"
import { IRequestUser } from "../../../Interfaces/userReq.interface"

interface ICreateAdmin {
  password: string,
  adminData: {
    name: string,
    email: string
    image?: string,
  }
}
interface IUpdateAdmin {
  name?: string,
  image?: string,
  contactNumber?: string
}
const createAdmin = async (payload: ICreateAdmin) => {
  //? TODO: Validate who is creating the admin user. Only super admin can create admin user and only super admin can create super admin user but admin user cannot create super admin user

  const isUserExists = await prisma.user.findUnique({
    where: { email: payload.adminData.email },
  });

  if (isUserExists) {
    throw new AppError(
      status.CONFLICT,
      "User already exists! Try another!"
    );
  }

  const signupAdmin = await auth.api.signUpEmail({
    body: {
      password: payload.password,
      email: payload.adminData.email,
      name: payload.adminData.name,
      image: payload.adminData.image,
      role: Role.ADMIN,
      needPasswordChange: true
    },
  });

  try {
    const adminData = await prisma.admin.create({
      data: {
        userId: signupAdmin.user.id,
        ...payload.adminData
      }
    })
    return adminData
  } catch (error: any) {
    console.log("Error on creating Admin!!", error);
    await prisma.user.delete({
      where: {
        id: signupAdmin.user.id
      }
    })
    throw error
  }

};


const getAllAdmins = async () => {
  return await prisma.admin.findMany({
    include: {
      user: true
    }
  })
}



const getOneAdmin = async (adminId: string) => {
  return await prisma.admin.findUnique({
    where: {
      id: adminId
    },
    include: {
      user: true
    }
  })
}

const updateAdmin = async (adminId: string, adminData: IUpdateAdmin) => {
  //* TODO Validate who is updating the admin user. Only super admin can update admin user and only super admin can update super admin user but admin user cannot update super admin user
  const isAdminExists = await prisma.admin.findUnique({
    where: { id: adminId }
  })
  if (!isAdminExists) throw new AppError(status.NOT_FOUND, "Admin or Super is not exists!!")
  const updatedAdminData = await prisma.admin.update({
    where: {
      id: adminId
    },
    data: {
      name: adminData.name,
      profilePhoto: adminData.image,
      contactNumber: adminData.contactNumber
    }
  })

  return updatedAdminData

}

//?soft delete admin user by setting isDeleted to true and also delete the user session and account
const deleteAdmin = async (adminId: string, userData: IRequestUser) => {
  //! TODO Validate who is updating the admin user. Only super admin can update admin user and only super admin can update super admin user but admin user cannot update super admin user
  const isAdminExists = await prisma.admin.findUnique({
    where: { id: adminId }
  })
  if (!isAdminExists) throw new AppError(status.NOT_FOUND, "Admin or Super is not exists!!")

  if (isAdminExists.id === userData.userId) {
    throw new AppError(status.BAD_REQUEST, "You can't able to delete yourself!!")
  }

  const deleteResult = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: {
        id: adminId
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    })

    await tx.user.update({
      where: {
        id: isAdminExists.id
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED
      }
    })

    await tx.session.deleteMany({
      where: {
        userId: isAdminExists.id
      }
    })

    await tx.account.deleteMany({
      where: {
        userId: isAdminExists.id
      }
    })
    const updatedAdminData = await getOneAdmin(adminId);

    return updatedAdminData

  })

  return deleteResult

}


export const adminService = {
  createAdmin,
  getAllAdmins,
  getOneAdmin,
  deleteAdmin,
  updateAdmin
}