"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileText,
    Download,
    UserIcon,
    Clock,
    CheckCircle,
    AlertCircle,
    Trash2,
} from "lucide-react";

import { ITaskSubmission } from "@/types/courses/i-task-submittion";
import IUser from "@/types/i-user";
import { ITaskReview } from "@/DTOs/review-dto";
import { ReviewSubmissionAsync } from "@/services/materials-service";

interface ReviewBlockProps {
    submissions: ITaskSubmission[];
    students: IUser[];
    maxPoints?: number;
    handleSaveAllChanges: () => Promise<void>;
    pointsMap: Record<string, number | null>;
    setPointsMap: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
}

type SubmissionStatus = "not_submitted" | "submitted" | "graded" | "all";

function ReviewBlock({ submissions, students, maxPoints, pointsMap, setPointsMap, handleSaveAllChanges }: ReviewBlockProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<SubmissionStatus>("all");

    useEffect(() => {
        const initialPoints: Record<string, number | null> = {};
        submissions.forEach((s) => {
            if (s.user?.userName) {
                initialPoints[s.user.userName] = s.points ?? null;
            }
        });
        setPointsMap(initialPoints);
    }, [submissions]);

    const getSubmission = (userName: string): ITaskSubmission | undefined =>
        submissions.find((s) => s.user?.userName === userName);

    const getStatus = (submission?: ITaskSubmission): Exclude<SubmissionStatus, "all"> => {
        if (!submission) return "not_submitted";
        return submission.points === null ? "submitted" : "graded";
    };

    const getStatusBadge = (status: Exclude<SubmissionStatus, "all">) => {
        switch (status) {
            case "graded":
                return <Badge className="bg-green-500">Graded</Badge>;
            case "submitted":
                return <Badge className="bg-blue-500">Submitted</Badge>;
            case "not_submitted":
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Not Submitted
                    </Badge>
                );
        }
    };

    const getStatusIcon = (status: Exclude<SubmissionStatus, "all">) => {
        switch (status) {
            case "graded":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "submitted":
                return <Clock className="h-4 w-4 text-blue-500" />;
            case "not_submitted":
                return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const submission = getSubmission(student.userName);
            const status = getStatus(submission);

            const matchesSearch =
                student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.userName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [students, searchQuery, statusFilter]);

    

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>
                    {
                        submissions.filter((s) => s.user !== null && s.user !== undefined)
                            .length
                    }{" "}
                    of {students.length} students have submitted
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                    <Input
                        placeholder="Search by name or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            setStatusFilter(value as SubmissionStatus)
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="graded">Graded</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="not_submitted">Not Submitted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Student</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted Files</TableHead>
                                <TableHead className="w-[100px]">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => {
                                    const submission = getSubmission(student.userName);
                                    const status = getStatus(submission);
                                    return (
                                        <TableRow key={student.userName}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={
                                                                student.photoUrl
                                                                    ? `${process.env.NEXT_PUBLIC_BASE_API_URL}${student.photoUrl}`
                                                                    : ""
                                                            }
                                                            alt={student.userName}
                                                        />
                                                        <AvatarFallback>
                                                            <UserIcon className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">
                                                            {student.firstName} {student.lastName}{" "}
                                                            {student.fatherName}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {student.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="w-[120px]">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(status)}
                                                    {getStatusBadge(status)}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {submission ? (
                                                    <div className="flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                                                        {submission.submissionFiles.map((file) => (
                                                            <div
                                                                key={file.filePath}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <FileText className="h-6 w-6 text-muted-foreground" />
                                                                <span className="text-sm">{file.name}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 px-2 ml-auto"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={`${process.env.NEXT_PUBLIC_BASE_API_URL}${file.filePath}`}
                                                                        download
                                                                    >
                                                                        <Download className="h-3 w-3" />
                                                                        <span className="sr-only">Download</span>
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        No files submitted
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {submission ? (
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                className="h-8 w-24"
                                                                min={0}
                                                                max={maxPoints}
                                                                value={pointsMap[student.userName] ?? ""}
                                                                onChange={(e) => {
                                                                    const value = e.target.value === "" ? null : parseInt(e.target.value);
                                                                    setPointsMap((prev) => ({
                                                                        ...prev,
                                                                        [student.userName]: value,
                                                                    }));
                                                                }}
                                                            />
                                                            <span className="text-sm text-muted-foreground">/ {maxPoints}</span>
                                                        </div>
                                                        {pointsMap[student.userName] !== null && (
                                                            <Button variant={"outline"} size={"icon"} className="w-8 h-8" onClick={() => {
                                                                setPointsMap((prev) => ({
                                                                    ...prev,
                                                                    [student.userName]: null,
                                                                }));
                                                            }}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <h1 className="text-muted-foreground text-sm">—</h1>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                

                <div className="flex justify-end gap-2">
                    <Button onClick={handleSaveAllChanges}>Save All Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default ReviewBlock;
