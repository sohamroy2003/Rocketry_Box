import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Search, MoreHorizontal, Loader2, AlertCircle, RefreshCw, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface TeamMember {
    userId: string;
    name: string;
    email: string;
    role: "Admin" | "Manager" | "Support" | "Agent";
    registrationDate: string;
    status: "Active" | "Inactive" | "On Leave";
    phone: string;
    remarks: string;
}

type SortConfig = {
    key: keyof TeamMember | null;
    direction: "asc" | "desc" | null;
};

// Dummy data for development - will be replaced with API data in production
const TEAM_DATA: TeamMember[] = [
    {
        userId: "ADMIN001",
        name: "John Doe",
        email: "john.doe@rocketrybox.com",
        role: "Admin",
        registrationDate: "02/15/2023",
        status: "Active",
        phone: "+91 9876543210",
        remarks: "Super admin with all privileges"
    },
    {
        userId: "ADMIN002",
        name: "Jane Smith",
        email: "jane.smith@rocketrybox.com",
        role: "Manager",
        registrationDate: "03/22/2023",
        status: "Active",
        phone: "+91 9876543211",
        remarks: "Finance department manager"
    },
    {
        userId: "ADMIN003",
        name: "Robert Johnson",
        email: "robert.j@rocketrybox.com",
        role: "Support",
        registrationDate: "04/10/2023",
        status: "Inactive",
        phone: "+91 9876543212",
        remarks: "Customer support specialist"
    },
    {
        userId: "ADMIN004",
        name: "Emily Davis",
        email: "emily.d@rocketrybox.com",
        role: "Agent",
        registrationDate: "05/05/2023",
        status: "On Leave",
        phone: "+91 9876543213",
        remarks: "Sales representative"
    },
    {
        userId: "ADMIN005",
        name: "Michael Wilson",
        email: "michael.w@rocketrybox.com",
        role: "Admin",
        registrationDate: "06/18/2023",
        status: "Active",
        phone: "+91 9876543214",
        remarks: "IT department admin"
    },
    {
        userId: "ADMIN006",
        name: "Sarah Thompson",
        email: "sarah.t@rocketrybox.com",
        role: "Manager",
        registrationDate: "07/30/2023",
        status: "Active",
        phone: "+91 9876543215",
        remarks: "Marketing team lead"
    },
    {
        userId: "ADMIN007",
        name: "David Brown",
        email: "david.b@rocketrybox.com",
        role: "Support",
        registrationDate: "08/12/2023",
        status: "Active",
        phone: "+91 9876543216",
        remarks: "Technical support specialist"
    },
    {
        userId: "ADMIN008",
        name: "Jessica Anderson",
        email: "jessica.a@rocketrybox.com",
        role: "Agent",
        registrationDate: "09/25/2023",
        status: "Active",
        phone: "+91 9876543217",
        remarks: "Customer acquisition agent"
    },
    {
        userId: "ADMIN009",
        name: "Thomas Miller",
        email: "thomas.m@rocketrybox.com",
        role: "Admin",
        registrationDate: "10/08/2023",
        status: "Inactive",
        phone: "+91 9876543218",
        remarks: "Logistics department admin"
    },
    {
        userId: "ADMIN010",
        name: "Sophia Garcia",
        email: "sophia.g@rocketrybox.com",
        role: "Manager",
        registrationDate: "11/15/2023",
        status: "Active",
        phone: "+91 9876543219",
        remarks: "Human resources manager"
    }
];

// API functions for future implementation
// --------------------------------------
// async function fetchTeamMembers(): Promise<TeamMember[]> {
//   try {
//     const response = await fetch('/api/admin/team');
//     if (!response.ok) throw new Error('Failed to fetch team members');
//     
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching team members:', error);
//     throw error;
//   }
// }
//
// async function updateTeamMemberStatus(userId: string, status: TeamMember["status"]): Promise<void> {
//   try {
//     const response = await fetch(`/api/admin/team/${userId}/status`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status })
//     });
//     
//     if (!response.ok) throw new Error('Failed to update team member status');
//   } catch (error) {
//     console.error('Error updating team member status:', error);
//     throw error;
//   }
// }
// --------------------------------------

const getStatusStyle = (status: TeamMember["status"]) => {
    return {
        "Active": "bg-green-50 text-green-700",
        "Inactive": "bg-red-50 text-red-700",
        "On Leave": "bg-yellow-50 text-yellow-700"
    }[status];
};

const getRoleStyle = (role: TeamMember["role"]) => {
    return {
        "Admin": "bg-purple-50 text-purple-700",
        "Manager": "bg-blue-50 text-blue-700",
        "Support": "bg-indigo-50 text-indigo-700",
        "Agent": "bg-cyan-50 text-cyan-700"
    }[role];
};

const TeamsTable = ({ data, loading, onStatusUpdate }: { 
    data: TeamMember[];
    loading: boolean;
    onStatusUpdate: (userId: string, status: TeamMember["status"]) => void;
}) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: null
    });

    const handleSort = (key: keyof TeamMember) => {
        let direction: "asc" | "desc" | null = "asc";

        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") {
                direction = "desc";
            } else if (sortConfig.direction === "desc") {
                direction = null;
            }
        }

        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        if (!sortConfig.key || !sortConfig.direction) return data;

        return [...data].sort((a, b) => {
            const aValue = String(a[sortConfig.key!] || "");
            const bValue = String(b[sortConfig.key!] || "");

            if (sortConfig.direction === "asc") {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
    };

    const getSortIcon = (key: keyof TeamMember) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="size-3" />;
        }
        return <ArrowUpDown className="size-3" />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
                <p className="text-muted-foreground">Loading team members...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg">
                <p className="text-muted-foreground mb-4">No team members found</p>
                <Link to="/admin/dashboard/teams/handler">
                    <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Team Member
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("userId")}
                            >
                                User ID {getSortIcon("userId")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("name")}
                            >
                                Name {getSortIcon("name")}
                            </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("email")}
                            >
                                Email {getSortIcon("email")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("role")}
                            >
                                Role {getSortIcon("role")}
                            </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("registrationDate")}
                            >
                                Registration {getSortIcon("registrationDate")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("status")}
                            >
                                Status {getSortIcon("status")}
                            </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("phone")}
                            >
                                Phone {getSortIcon("phone")}
                            </div>
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSort("remarks")}
                            >
                                Remarks {getSortIcon("remarks")}
                            </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {getSortedData().map((member) => (
                        <TableRow key={member.userId}>
                            <TableCell className="font-medium">
                                <Link
                                    to={`/admin/dashboard/teams/${member.userId}`}
                                    className="text-purple-600 hover:underline"
                                >
                                    {member.userId}
                                </Link>
                            </TableCell>
                            <TableCell>{member.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleStyle(
                                        member.role
                                    )}`}
                                >
                                    {member.role}
                                </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{member.registrationDate}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(
                                        member.status
                                    )}`}
                                >
                                    {member.status}
                                </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                            <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                                {member.remarks}
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Link to={`/admin/dashboard/teams/${member.userId}`} className="flex items-center w-full">
                                                View Details
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onStatusUpdate(member.userId, "Active")}
                                            disabled={member.status === "Active"}
                                        >
                                            Set as Active
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onStatusUpdate(member.userId, "Inactive")}
                                            disabled={member.status === "Inactive"}
                                        >
                                            Set as Inactive
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onStatusUpdate(member.userId, "On Leave")}
                                            disabled={member.status === "On Leave"}
                                        >
                                            Set as On Leave
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

const AdminTeamsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

    // Fetch team members data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // When API is ready, this would be:
                // const data = await fetchTeamMembers();
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Use dummy data for development
                setTeamMembers(TEAM_DATA);
            } catch (err) {
                console.error("Error fetching team members:", err);
                setError("Failed to load team members. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const handleStatusUpdate = async (userId: string, newStatus: TeamMember["status"]) => {
        try {
            setStatusUpdateLoading(true);
            
            // When API is ready, this would be:
            // await updateTeamMemberStatus(userId, newStatus);
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Update local state
            setTeamMembers(prevMembers => 
                prevMembers.map(member => 
                    member.userId === userId ? { ...member, status: newStatus } : member
                )
            );
            
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Failed to update status. Please try again.");
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // Filter team members based on search term
    const filteredMembers = teamMembers.filter(member => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            member.userId.toLowerCase().includes(searchTermLower) ||
            member.name.toLowerCase().includes(searchTermLower) ||
            member.email.toLowerCase().includes(searchTermLower)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-semibold">
                        Team Management
                    </h1>
                    <p className="text-base lg:text-lg text-muted-foreground mt-1">
                        Manage your administration team members
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/admin/dashboard/teams/handler">
                        <Button variant="purple">
                            <Plus className="size-4 mr-2" />
                            Add Team Member
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by ID, name, or email"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {error && (
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Retry Loading
                    </Button>
                )}
            </div>
            
            {error ? (
                <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-red-50 border-red-200 p-6">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Team Members</h3>
                    <p className="text-red-700 text-center mb-4">{error}</p>
                    <Button 
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="border-red-300"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            ) : (
                <TeamsTable 
                    data={filteredMembers} 
                    loading={loading}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}

            {statusUpdateLoading && (
                <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-purple-600">Updating status...</span>
                </div>
            )}
        </div>
    );
};

export default AdminTeamsPage;