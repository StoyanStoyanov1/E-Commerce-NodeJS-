import { Request, Response, NextFunction } from "express";
import * as cityService from "./city.service.js";

export const getCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cities = await cityService.getCities();
        res.json(cities);
    } catch (error) {
        next(error);
    }
};

export const getCityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const city = await cityService.getCityById(req.params.id);
        res.json(city);
    } catch (error) {
        next(error);
    }
};

export const createCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const city = await cityService.createCity(req.body);
        res.status(201).json(city);
    } catch (error) {
        next(error);
    }
};

export const getCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countries = await cityService.getCountries();
        res.json(countries);
    } catch (error) {
        next(error);
    }
};

export const createCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const country = await cityService.createCountry(req.body);
        res.status(201).json(country);
    } catch (error) {
        next(error);
    }
};

export const deleteCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cityService.deleteCity(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await cityService.deleteCountry(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};