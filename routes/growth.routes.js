/**
 * @swagger
 * /growth/campaigns/{campaignId}/status:
 *   put:
 *     summary: Update growth campaign status
 *     tags: [Growth Engine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DRAFT, ANALYZING, READY_FOR_OUTREACH, ACTIVE, PAUSED, COMPLETED]
 *     responses:
 *       200:
 *         description: Campaign status updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.put('/campaigns/:campaignId/status', verifyToken, growthController.updateCampaignStatus);

/**
 * @swagger
 * /growth/campaigns/{campaignId}:
 *   get:
 *     summary: Get details for a specific campaign with discovered brands
 *     tags: [Growth Engine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.get('/campaigns/:campaignId', verifyToken, growthController.getCampaignDetails);

/**
 * @swagger
 * /growth/campaigns/{campaignId}/brands:
 *   get:
 *     summary: Get discovered brands for a campaign
 *     tags: [Growth Engine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Discovered brands retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.get('/campaigns/:campaignId/brands', verifyToken, growthController.getDiscoveredBrands); 