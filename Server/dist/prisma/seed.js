"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcryptjs_1.default.hash('password123', 10);
        console.log('Cleaning up database...');
        yield prisma.task.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.comment.deleteMany({});
        yield prisma.service.deleteMany({});
        yield prisma.guide.deleteMany({});
        yield prisma.event.deleteMany({});
        yield prisma.blog.deleteMany({});
        console.log('Seeding Users...');
        const users = [
            {
                email: 'admin@kts.com',
                name: 'Admin User',
                role: 'ADMIN',
                passwordHash: hashedPassword,
                department: 'IT Administration',
                github: 'https://github.com/admin',
                linkedin: 'https://linkedin.com/in/admin',
                telegram: 'https://t.me/admin_kts',
            },
            {
                email: 'member1@kts.com',
                name: 'Sarah Chen',
                role: 'MEMBER',
                passwordHash: hashedPassword,
                department: 'Software Development',
                github: 'https://github.com/sarahchen',
                linkedin: 'https://linkedin.com/in/sarahchen',
                telegram: 'https://t.me/sarah_dev',
            },
            {
                email: 'member2@kts.com',
                name: 'Alex Rivera',
                role: 'MEMBER',
                passwordHash: hashedPassword,
                department: 'Hardware Repair',
                github: 'https://github.com/arivera',
                linkedin: 'https://linkedin.com/in/arivera',
                telegram: 'https://t.me/alex_fix',
            },
            {
                email: 'member3@kts.com',
                name: 'Jordan Smith',
                role: 'MEMBER',
                passwordHash: hashedPassword,
                department: 'Cybersecurity',
                github: 'https://github.com/jsmith_sec',
                linkedin: 'https://linkedin.com/in/jsmith_sec',
                telegram: 'https://t.me/jordan_sec',
            },
            {
                email: 'member4@kts.com',
                name: 'Elena Volkov',
                role: 'MEMBER',
                passwordHash: hashedPassword,
                department: 'UI/UX Design',
                github: 'https://github.com/evolkov',
                linkedin: 'https://linkedin.com/in/evolkov',
                telegram: 'https://t.me/elena_design',
            },
            {
                email: 'student1@kts.com',
                name: 'Mike Johnson',
                role: 'STUDENT',
                passwordHash: hashedPassword,
                department: 'Computer Science',
            },
        ];
        const createdUsers = [];
        for (const u of users) {
            const user = yield prisma.user.create({ data: u });
            createdUsers.push(user);
        }
        console.log(`✓ Seeded ${createdUsers.length} users`);
        console.log('Seeding Tasks...');
        const tasks = [
            {
                title: 'Laptop Screen Replacement',
                description: 'Cracked screen on Dell XPS 15.',
                device: 'PC',
                manufacturer: 'Dell',
                serialNumber: 'DXPS15-9500',
                status: 'PENDING',
                studentId: createdUsers[5].id,
            },
            {
                title: 'Software Installation',
                description: 'Need help installing MATLAB and AutoCAD.',
                device: 'PC',
                manufacturer: 'HP',
                serialNumber: 'HP-ENVY-13',
                status: 'IN_PROGRESS',
                studentId: createdUsers[5].id,
                memberId: createdUsers[1].id,
            },
            {
                title: 'Battery Replacement',
                description: 'iPhone 12 battery health is at 75%.',
                device: 'Phone',
                manufacturer: 'Apple',
                serialNumber: 'A2172-IPHONE12',
                status: 'COMPLETED',
                studentId: createdUsers[5].id,
                memberId: createdUsers[2].id,
            },
            {
                title: 'OS Reinstallation',
                description: 'System is very slow, need a fresh Windows install.',
                device: 'PC',
                manufacturer: 'Lenovo',
                serialNumber: 'L-THINK-X1',
                status: 'PENDING',
                studentId: createdUsers[5].id,
            },
            {
                title: 'Keyboard Fix',
                description: 'Several keys are not working on MacBook Pro.',
                device: 'PC',
                manufacturer: 'Apple',
                serialNumber: 'MBP-2021-M1',
                status: 'IN_PROGRESS',
                studentId: createdUsers[5].id,
                memberId: createdUsers[2].id,
            },
        ];
        yield prisma.task.createMany({ data: tasks });
        console.log(`✓ Seeded ${tasks.length} tasks`);
        console.log('Seeding Comments...');
        const comments = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Great service! My laptop is working perfectly now.',
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                message: 'Very helpful team. They fixed my phone in no time.',
            },
            {
                name: 'Robert Brown',
                email: 'robert@example.com',
                message: 'The workshop on web development was amazing!',
            },
            {
                name: 'Emily Davis',
                email: 'emily@example.com',
                message: 'I love the community here. Everyone is so supportive.',
            },
            {
                name: 'Michael Wilson',
                email: 'michael@example.com',
                message: 'Highly recommend KTS for any tech issues.',
            },
        ];
        yield prisma.comment.createMany({ data: comments });
        console.log(`✓ Seeded ${comments.length} comments`);
        console.log('Seeding Services...');
        const services = [
            {
                title: 'Hardware Repair',
                description: 'Repair for laptops, desktops, and mobile devices.',
                category: 'hardware',
                icon: '🔧',
                details: 'Laptop not charging, Overheating, keyboard fixes, Slow performance, WiFi issues, and more.',
            },
            {
                title: 'Software Solutions',
                description: 'Installation, maintenance, and troubleshooting.',
                category: 'software',
                icon: '💻',
                details: 'OS installation, virus removal, academic software installation, system optimization, and data recovery services.',
            },
            {
                title: 'IT Consultation',
                description: 'Professional advice for your tech needs.',
                category: 'consultation',
                icon: '💡',
                details: 'Purchasing new PC or Phone, purchasing new hard disks and other accessories, personalized tech recommendations for students.',
            },
            {
                title: 'Data Recovery',
                description: 'Recover lost or corrupted data from any device.',
                category: 'data',
                icon: '💾',
                details: 'Professional data recovery from hard drives, SSDs, USB drives, and memory cards.',
            },
            {
                title: 'Network Setup',
                description: 'Configure and optimize your network connections.',
                category: 'network',
                icon: '🌐',
                details: 'WiFi setup, router configuration, network troubleshooting, and security optimization.',
            },
        ];
        yield prisma.service.createMany({ data: services });
        console.log(`✓ Seeded ${services.length} services`);
        console.log('Seeding Guides...');
        const guides = [
            {
                title: 'Fix Slow Computer Performance',
                description: 'Simple steps to speed up your sluggish computer.',
                video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            {
                title: 'Recover Deleted Files',
                description: 'Learn how to recover accidentally deleted files.',
                video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Field 'video' is required in your schema
            },
            {
                title: 'Fix WiFi Connection Issues',
                description: 'Troubleshoot and resolve common WiFi problems.',
                video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            {
                title: 'Install Windows 11',
                description: 'Step-by-step guide to install or upgrade to Windows 11.',
                video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            {
                title: 'Remove Viruses Manually',
                description: 'Manual methods to detect and remove malware.',
                video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
        ];
        yield prisma.guide.createMany({ data: guides });
        console.log(`✓ Seeded ${guides.length} guides`);
        console.log('Seeding Events...');
        const events = [
            {
                title: 'Web Dev Workshop',
                description: 'Learn the basics of HTML, CSS, and JS.',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                location: 'KTS Lab, Room 201',
                type: 'Workshop',
            },
            {
                title: 'Cybersecurity Seminar',
                description: 'Protecting your digital life best practices.',
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                location: 'Main Auditorium',
                type: 'Seminar',
            },
            {
                title: 'AI Tech Meetup',
                description: 'Latest trends in AI and Machine Learning.',
                date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                location: 'Innovation Hub',
                type: 'Meetup',
            },
            {
                title: 'Hardware Hackathon',
                description: 'Build and repair hardware projects.',
                date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
                location: 'Engineering Hall',
                type: 'Hackathon',
            },
            {
                title: 'Cloud Computing Talk',
                description: 'Introduction to AWS and Azure.',
                date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
                location: 'Virtual Event',
                type: 'Webinar',
            },
        ];
        yield prisma.event.createMany({ data: events });
        console.log(`✓ Seeded ${events.length} events`);
        console.log('Seeding Blogs...');
        const blogs = [
            {
                title: 'The Future of Quantum Computing',
                content: 'Quantum computing is set to revolutionize the way we process information...',
                category: 'Technology',
                imageUrls: ['https://images.unsplash.com/photo-1635070041078-e363dbe005cb'],
            },
            {
                title: 'Top 10 Cybersecurity Tips for 2024',
                content: 'Protecting your data has never been more important. Here are our top tips...',
                category: 'Security',
                imageUrls: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b'],
            },
            {
                title: 'Why UI/UX Design Matters',
                content: 'Good design is more than just aesthetics; it is about how things work...',
                category: 'Design',
                imageUrls: ['https://images.unsplash.com/photo-1586717791821-3f44a563eb4c'],
            },
            {
                title: 'Getting Started with Rust',
                content: 'Rust is a powerful language for systems programming. Here is how to start...',
                category: 'Programming',
                imageUrls: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4'],
            },
            {
                title: 'The Rise of Remote Tech Support',
                content: 'How remote support is changing the IT landscape for students and professionals...',
                category: 'IT Services',
                imageUrls: ['https://images.unsplash.com/photo-1573164713988-8665fc963095'],
            },
        ];
        yield prisma.blog.createMany({ data: blogs });
        console.log(`✓ Seeded ${blogs.length} blogs`);
        console.log('\n✅ Database seeding completed successfully!');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
