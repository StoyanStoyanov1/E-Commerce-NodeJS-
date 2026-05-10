/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 example: Ivan@1234
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid email or password
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 example: Ivan@1234
 *               firstName:
 *                 type: string
 *                 example: Ivan
 *               middleName:
 *                 type: string
 *                 example: Georgiev
 *               lastName:
 *                 type: string
 *                 example: Petrov
 *               phoneNumber:
 *                 type: string
 *                 example: +359888123456
 *               birthDate:
 *                 type: string
 *                 example: 15-05-1995
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: abc123...
 *     responses:
 *       200:
 *         description: New access and refresh tokens
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: abc123...
 *     responses:
 *       204:
 *         description: Logged out successfully
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout from all devices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logged out from all devices
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /auth/verify-email:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verify email address
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         example: abc123...
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *     responses:
 *       200:
 *         description: Reset email sent if account exists
 *       429:
 *         description: Too many requests
 */

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc123...
 *               newPassword:
 *                 type: string
 *                 example: NewPass@1234
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Change password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: Ivan@1234
 *               newPassword:
 *                 type: string
 *                 example: NewPass@1234
 *     responses:
 *       204:
 *         description: Password changed successfully
 *       401:
 *         description: Incorrect current password
 */