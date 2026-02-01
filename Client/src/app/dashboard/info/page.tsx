
export default function KTSInfoPage() {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">About KTS</h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Kaist Technical Support (KTS) is a student-led organization dedicated to helping the KAIST community
                    resolve technical issues with their devices and network connectivity. Founded in 2010, KTS has served
                    thousands of students and faculty members.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mt-4">
                    Our mission is to provide reliable, free, and friendly technical assistance to ensure that technology
                    is an enabler, not a barrier, to learning and research at KAIST.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Our History</h2>
                    <ul className="space-y-2 text-gray-600">
                        <li><strong>2010:</strong> Established as a small club.</li>
                        <li><strong>2015:</strong> Officially recognized as a student organization.</li>
                        <li><strong>2020:</strong> Launched online support portal.</li>
                        <li><strong>2024:</strong> Expanded to support all campus dormitories.</li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Core Values</h2>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Student-First Service</li>
                        <li>Technical Excellence</li>
                        <li>Community Support</li>
                        <li>Inclusive Technology</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder members - in a real app, fetch from DB */}
                    {[
                        { name: "John Doe", role: "President" },
                        { name: "Jane Smith", role: "Head Member" },
                        { name: "Mike Johnson", role: "Network Specialist" },
                        { name: "Sarah Lee", role: "Software Lead" },
                        { name: "David Kim", role: "Hardware Specialist" },
                        { name: "Emily Chen", role: "Customer Relations" }
                    ].map((member, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
