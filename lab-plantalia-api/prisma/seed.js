"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const catalogPath = (0, node_path_1.join)(__dirname, 'catalog-seed.json');
const catalog = JSON.parse((0, node_fs_1.readFileSync)(catalogPath, 'utf-8'));
async function main() {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    const demoEmail = 'user@example.com';
    const demoPassword = 'password123';
    const passwordHash = bcrypt.hashSync(demoPassword, 10);
    await prisma.adminUser.upsert({
        where: { email: demoEmail },
        create: { email: demoEmail, passwordHash },
        update: { passwordHash },
    });
    for (const p of catalog) {
        await prisma.product.upsert({
            where: { id: p.id },
            create: {
                id: p.id,
                slug: p.slug,
                categoryId: p.categoryId,
                name: p.name,
                shortDescription: p.shortDescription,
                description: p.description,
                price: p.price,
                imageSrc: p.imageSrc,
                imageAlt: p.imageAlt,
                stock: p.stock,
            },
            update: {
                slug: p.slug,
                categoryId: p.categoryId,
                name: p.name,
                shortDescription: p.shortDescription,
                description: p.description,
                price: p.price,
                imageSrc: p.imageSrc,
                imageAlt: p.imageAlt,
                stock: p.stock,
            },
        });
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map