import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const bulgaria = await prisma.country.create({
        data: { name: "Bulgaria" },
    });

    await prisma.city.createMany({
        data: [
            { name: "Sofia", postCode: "1000", countryId: bulgaria.id },
            { name: "Plovdiv", postCode: "4000", countryId: bulgaria.id },
            { name: "Varna", postCode: "9000", countryId: bulgaria.id },
            { name: "Burgas", postCode: "8000", countryId: bulgaria.id },
            { name: "Ruse", postCode: "7000", countryId: bulgaria.id },
            { name: "Stara Zagora", postCode: "6000", countryId: bulgaria.id },
            { name: "Pleven", postCode: "5800", countryId: bulgaria.id },
            { name: "Sliven", postCode: "8800", countryId: bulgaria.id },
            { name: "Dobrich", postCode: "9300", countryId: bulgaria.id },
            { name: "Shumen", postCode: "9700", countryId: bulgaria.id },
            { name: "Pernik", postCode: "2300", countryId: bulgaria.id },
            { name: "Haskovo", postCode: "6300", countryId: bulgaria.id },
            { name: "Yambol", postCode: "8600", countryId: bulgaria.id },
            { name: "Pazardzhik", postCode: "4400", countryId: bulgaria.id },
            { name: "Blagoevgrad", postCode: "2700", countryId: bulgaria.id },
            { name: "Veliko Tarnovo", postCode: "5000", countryId: bulgaria.id },
            { name: "Vratsa", postCode: "3000", countryId: bulgaria.id },
            { name: "Gabrovo", postCode: "5300", countryId: bulgaria.id },
            { name: "Vidin", postCode: "3700", countryId: bulgaria.id },
            { name: "Montana", postCode: "3400", countryId: bulgaria.id },
            { name: "Kardzhali", postCode: "6600", countryId: bulgaria.id },
            { name: "Lovech", postCode: "5500", countryId: bulgaria.id },
            { name: "Targovishte", postCode: "7700", countryId: bulgaria.id },
            { name: "Razgrad", postCode: "7200", countryId: bulgaria.id },
            { name: "Silistra", postCode: "7500", countryId: bulgaria.id },
            { name: "Smolyan", postCode: "4700", countryId: bulgaria.id },
            { name: "Kyustendil", postCode: "2500", countryId: bulgaria.id },
            { name: "Sandanski", postCode: "2800", countryId: bulgaria.id },
            { name: "Petrich", postCode: "2850", countryId: bulgaria.id },
            { name: "Gotse Delchev", postCode: "2900", countryId: bulgaria.id },
        ],
    });

    console.log("Seed completed!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());