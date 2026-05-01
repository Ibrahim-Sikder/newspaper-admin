/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
// Fix the import to use the named export
import { UAParser } from "ua-parser-js"

interface Visitor {
    _id: string
    ip: string
    userAgent: string
    visitedAt: string

}

const VisitorPage = () => {
    const [visitors, setVisitors] = useState<Visitor[]>([])
   
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const response = await fetch("/api/admin/visitor-tracker")
                const data = await response.json()

                if (!response.ok) throw new Error(data.message || "Failed to fetch visitors")

                setVisitors(data.data)
                setLoading(false)
            } catch (err: any) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchVisitors()
    }, [])

    const parseUserAgent = (ua: string) => {
        const parser = new UAParser(ua);
        return {
            browser: parser.getBrowser().name || "Unknown",
            os: parser.getOS().name || "Unknown",
            device: parser.getDevice().type || "Desktop",
        };
    };

    if (loading) return <div className="p-4 text-center">Loading visitors...</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Visitor Analytics</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">IP Address</th>
                            <th className="py-2 px-4 border-b">Visit Time</th>
                            <th className="py-2 px-4 border-b">Browser</th>
                            <th className="py-2 px-4 border-b">OS</th>
                            <th className="py-2 px-4 border-b">Device</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitors.map((visitor) => {
                            const ua = parseUserAgent(visitor.userAgent)
                            return (
                                <tr key={visitor._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="py-2 px-4 border-b">{visitor.ip}</td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(visitor.visitedAt).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border-b">{ua.browser}</td>
                                    <td className="py-2 px-4 border-b">{ua.os}</td>
                                    <td className="py-2 px-4 border-b">{ua.device}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default VisitorPage;