import prisma from "../../prisma/client.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { CreateCityDto, CreateCountryDto } from "./city.schema.js";

export const getCities = async () => {
    return prisma.city.findMany({
        include: { country: true },
        orderBy: { name: "asc" },
    });
};

export const getCityById = async (id: string) => {
    const city = await prisma.city.findUnique({
        where: { id },
        include: { country: true },
    });
    if (!city) throw new AppError("City not found", 404);
    return city;
};

export const createCity = async (dto: CreateCityDto) => {
    const country = await prisma.country.findUnique({ where: { id: dto.countryId } });
    if (!country) throw new AppError("Country not found", 404);

    const existing = await prisma.city.findFirst({
        where: { name: dto.name, countryId: dto.countryId }
    });
    if (existing) throw new AppError("City already exists in this country", 409);

    return prisma.city.create({
        data: {
            name: dto.name,
            postCode: dto.postCode,
            countryId: dto.countryId,
        },
        include: { country: true },
    });
};
export const getCountries = async () => {
    return prisma.country.findMany({
        include: { cities: true },
        orderBy: { name: "asc" },
    });
};

export const createCountry = async (dto: CreateCountryDto) => {
    return prisma.country.create({
        data: { name: dto.name },
    });
};

export const deleteCity = async (id: string) => {
    const city = await prisma.city.findUnique({ where: { id } });
    if (!city) throw new AppError("City not found", 404);
    await prisma.city.delete({ where: { id } });
};

export const deleteCountry = async (id: string) => {
    const country = await prisma.country.findUnique({ where: { id } });
    if (!country) throw new AppError("Country not found", 404);
    await prisma.country.delete({ where: { id } });
};