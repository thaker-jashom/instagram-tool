import 'dotenv/config';
import prisma from '../config/prisma';
import * as bcrypt from 'bcryptjs';

async function createUser() {
    const email = 'test@foodai.com';
    const password = 'Test@123';

    console.log('╔════════════════════════════════════════╗');
    console.log('║  Create/Reset User                     ║');
    console.log('╚════════════════════════════════════════╝\n');

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        const hashedPassword = bcrypt.hashSync(password, 10);

        if (existingUser) {
            console.log(`🔄 User exists. Updating password...`);
            
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });

            console.log('✅ Password updated successfully!');
        } else {
            console.log(`➕ Creating new user...`);
            
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword
                }
            });

            console.log('✅ User created successfully!');
        }

        console.log('\n📧 Email:', email);
        console.log('🔑 Password:', password);
        console.log('\n🎉 You can now login with these credentials!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createUser();
