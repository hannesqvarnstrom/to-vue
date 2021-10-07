import express from 'express'
import { getRoles } from '../../controllers/admin/role.controller';

const router = express.Router();

router.get('/', getRoles)

export default router;