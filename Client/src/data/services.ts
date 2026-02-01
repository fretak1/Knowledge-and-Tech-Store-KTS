import {
    Laptop,
    Smartphone,
    Wifi,
    HardDrive,
    Code,
    ShieldCheck,
    Cpu,
    Database,
    Cloud,
    Search,
    BookOpen,
    Users,
    MailQuestionMark,
    Sparkles,
    School,
    Microchip,
    Globe
} from "lucide-react";

export interface Service {
    id: string;
    title: string;
    description: string;
    details: string;
    icon: string;
    category: string;
}

export const services: Service[] = [
    {
        id: "hw-repair",
        title: "Hardware Repair",
        description: "Professional repair services for laptops, desktops, and mobile devices.",
        details: "We provide reliable repair services for common hardware problems, including fixing loose connections, replacing damaged cables, and other small issues. Our goal is to keep your device working smoothly by using good-quality parts and careful handling, so it lasts longer and performs better.",
        icon: "Laptop",
        category: "Hardware"
    },
    {
        id: "sw-install",
        title: "Software Installation",
        description: "Operating system installs, driver updates, and essential software setup.",
        details: "We assist with installing and setting up operating systems such as Windows, Ubuntu, and Linux. Our service also includes installing required drivers, basic security software, and useful programs like Microsoft Office and AutoCAD to make sure your computer is ready for work or study..",
        icon: "Code",
        category: "Software"
    },
    {
        id: "it-consulting",
        title: "IT Consulting",
        description: "Expert advice on tech purchases and system architecture for students.",
        details: "Not sure which laptop or mobile phone is best for your field of study or daily use? Our team provides personalized advice to help you choose the right device based on your budget, academic requirements, and everyday needs. We guide you in selecting a device that supports your studies, required apps or software, and long-term use.",
        icon: "Users",
        category: "Consulting"
    }
];

export const iconMap: { [key: string]: any } = {
    "Laptop": Laptop,
    "Code": Code,
    "Users": Users,
    "ShieldCheck": ShieldCheck,
    "Cloud": Cloud,
    "Cpu": Cpu,
    "Database": Database,
    "Search": Search,
    "BookOpen": BookOpen,
    "MailQuestionMark": MailQuestionMark,
    "Sparkles": Sparkles,
    "School": School,
    "Microchip": Microchip,
};
