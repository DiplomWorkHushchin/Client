"use client";

import { use, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Paperclip, File, X, CheckCircle, Upload, Loader2Icon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Task from "@/types/courses/i-task";
import { ITaskSubmission } from "@/types/courses/i-task-submittion";

interface TaskSubmissionProps {
  task: Task;
  handleDeleteSubmissionCallback?: () => void;
  onFileSubmit?: (files: File[], taskId: string) => void;
  isCompleted: boolean;
  setIsCompleted: (isCompleted: boolean) => void;
  attachedFiles: AttachedFile[];
  attachFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  taskSubmission?: ITaskSubmission | null;
}


function TaskSubmission({ task, handleDeleteSubmissionCallback, isCompleted, setIsCompleted, attachedFiles,
  attachFiles, removeFile, taskSubmission, onFileSubmit }
  : TaskSubmissionProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    attachFiles(files);
  };


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const taskSubmitDto = {
      files: attachedFiles.length > 0 ? attachedFiles.map(f => f.file) : [],
    };

    if (onFileSubmit && attachedFiles.length >= 0) {
      onFileSubmit(taskSubmitDto.files, task.id);
    }

    setIsSubmitting(false);
    setIsCompleted(true);
    attachFiles([]);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="text-lg flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Task Submission
          </div>
          {isCompleted ? (
            <Button onClick={handleDeleteSubmissionCallback}>
              Undo sunbmission
            </Button>) : <div />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isCompleted ? (
          <>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20",
                "hover:border-primary/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your completed work or any supporting documents
              </p>
            </div>

            {attachedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attached Files ({attachedFiles.length})
                </h4>
                <div className="space-y-2">
                  {attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="h-7 w-7"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Task Completed!</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Your submission has been received
              </p>
              {(taskSubmission?.submissionFiles && taskSubmission.submissionFiles.length > 0) && (
                <Badge variant="outline" className="mt-4">
                  {taskSubmission.submissionFiles.length} file{taskSubmission.submissionFiles.length !== 1 ? 's' : ''} submitted
                </Badge>
              )}
            </div>

            {(taskSubmission?.submissionFiles && taskSubmission.submissionFiles.length > 0) && (
              <div className="mt-4 w-full text-sm text-muted-foreground">
                <div className="space-y-2">
                  {taskSubmission.submissionFiles.map((file) => (
                    <div
                      key={file.name ?? Math.random()}
                      className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                          </div>
                        </div>
                        <a
                          href={process.env.NEXT_PUBLIC_BASE_API_URL + file.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!isCompleted && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        )}
      </CardFooter>
    </Card >
  );
}

export default TaskSubmission;