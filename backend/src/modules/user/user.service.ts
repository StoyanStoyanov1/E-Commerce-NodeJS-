import prisma from "../../prisma/client.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { UpdateAddressDto, CreateAddressDto, UpdateProfileDto} from "./user.dto.js";

export const updateProfile = async (userId: string, dto: UpdateProfileDto) => {
    const profile = await prisma.profile.findUnique({
        where: {userId},
    });

    if (!profile) throw new AppError("Profile not found", 404);

    return prisma.profile.update({
        where: {userId},
        data: {
            middleName: dto.middleName,
            phoneNumber: dto.phoneNumber,
        }
    });
};

export const getAddresses = async (userId: string) => {
    return prisma.address.findMany({
        where: {userId},
        include: {city: {include: {country: true}}},
    });
};

export const createAddress = async (userId: string, dto: CreateAddressDto) => {
    const city = await prisma.city.findUnique({
        where: { id: dto.cityId },
    });

    if (!city) throw new AppError("City not found", 404);

    const hasDefault = await prisma.address.findFirst({
        where: { userId, isDefault: true },
    });

    return prisma.address.create({
        data: {
            street: dto.street,
            cityId: dto.cityId,
            userId,
            isDefault: !hasDefault,
        },
    });
};

export const updateAddress = async (userId: string, addressId: string, dto: UpdateAddressDto) => {
    const address = await prisma.address.findUnique({
        where: {id: addressId}
    });

    if (!address) throw new AppError("Address not found", 404);
    if (address.userId !== userId) throw new AppError("Forbidden", 403);

    if (dto.cityId) {
        const city = await prisma.city.findUnique({where: {id: dto.cityId}});
        if (!city) throw new AppError("City not found", 404);
    }

    return prisma.address.update({
        where: {id : addressId},
        data: {
            street: dto.street,
            cityId: dto.cityId,
        }
    })
};

export const deleteAddress = async (userId: string, addressId: string) => {
    const address = await prisma.address.findUnique({
        where: {id: addressId}
    });

    if (!address) throw new AppError("Address not found", 404);
    if (address.userId !== userId) throw new AppError("Forbidden", 403);
    if (address.isDefault) throw new AppError("Cannot delete default address", 400);

    await prisma.address.delete({
        where: {id: addressId}
    });
}

export const setDefaultAddress = async (userId: string, addressId: string) => {
    const address = await prisma.address.findUnique({where: {id: addressId}});

    if (!address) throw new AppError("Address not found", 404);
    if (address.userId !== userId) throw new AppError("Forbidden", 403);

    await prisma.address.updateMany({
        where: {userId, isDefault: true},
        data: {isDefault: false},
    });

    return prisma.address.update({
        where: {id: addressId},
        data: {isDefault: true},
    })
}


export const getMe = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            email: true,
            isAktiv: true,
            createdAt: true,
            role: {select: {name: true}},
            profile: true,
            addresses: true,
        }
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
    
}