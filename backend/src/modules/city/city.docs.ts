/**
 * @openapi
 * /cities:
 *   get:
 *     tags:
 *       - Cities
 *     summary: Get all cities
 *     responses:
 *       200:
 *         description: List of cities
 *   post:
 *     tags:
 *       - Cities
 *     summary: Create a city (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - countryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sofia
 *               postCode:
 *                 type: string
 *                 example: "1000"
 *               countryId:
 *                 type: string
 *                 example: d6e0a4bd-3756-4b91-80d8-49fba774d669
 *     responses:
 *       201:
 *         description: City created
 *       404:
 *         description: Country not found
 */

/**
 * @openapi
 * /cities/{id}:
 *   get:
 *     tags:
 *       - Cities
 *     summary: Get city by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: City found
 *       404:
 *         description: City not found
 *   delete:
 *     tags:
 *       - Cities
 *     summary: Delete city (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: City deleted
 *       404:
 *         description: City not found
 */

/**
 * @openapi
 * /cities/countries/all:
 *   get:
 *     tags:
 *       - Cities
 *     summary: Get all countries
 *     responses:
 *       200:
 *         description: List of countries
 */

/**
 * @openapi
 * /cities/countries:
 *   post:
 *     tags:
 *       - Cities
 *     summary: Create a country (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bulgaria
 *     responses:
 *       201:
 *         description: Country created
 */

/**
 * @openapi
 * /cities/countries/{id}:
 *   delete:
 *     tags:
 *       - Cities
 *     summary: Delete country (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Country deleted
 *       404:
 *         description: Country not found
 */