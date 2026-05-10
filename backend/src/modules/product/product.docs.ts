/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: iPhone
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           example: 2000
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *           example: true
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - price
 *             - createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
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
 *               - price
 *               - stock
 *               - categoryIds
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               description:
 *                 type: string
 *                 example: Latest iPhone
 *               price:
 *                 type: number
 *                 example: 1999.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - d6e0a4bd-3756-4b91-80d8-49fba774d669
 *     responses:
 *       201:
 *         description: Product created
 *       404:
 *         description: One or more categories not found
 */

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *                 example: Latest iPhone Pro
 *               price:
 *                 type: number
 *                 example: 2499.99
 *               stock:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */

/**
 * @openapi
 * /products/{id}/categories:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - d6e0a4bd-3756-4b91-80d8-49fba774d669
 *     responses:
 *       200:
 *         description: Categories updated
 *       404:
 *         description: Product or categories not found
 */

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete product
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
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

/**
 * @openapi
 * /products/{id}/images:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add product image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - isPrimary
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               isPrimary:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Image added
 *       404:
 *         description: Product not found
 */

/**
 * @openapi
 * /products/{id}/images/{imageId}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Change primary product image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Primary image changed
 *       404:
 *         description: Product or image not found
 */

/**
 * @openapi
 * /products/{id}/images/{imageId}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete product image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Image deleted
 *       400:
 *         description: Cannot delete primary image
 *       404:
 *         description: Image not found
 */